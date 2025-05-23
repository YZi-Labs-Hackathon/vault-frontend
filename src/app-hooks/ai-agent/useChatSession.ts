import { CHAIN, getSignerFromAccount } from '@/app-contexts/thirdweb';
import { getErrorMessage } from '@/app-helpers/errors';
import { delay, get } from '@/app-helpers/misc';
import { AIChatParams } from '@/app-services/api';
import { ChatSession } from '@/app-services/chat-session';
import { ChatAction, ChatMessage, NEED_RETRY_ACTIONS } from '@/app-types/ai-agent';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useActiveAccount } from 'thirdweb/react';
import { useOnEventCallback } from '../common';
import {
	useMutationSyncCreateVaultTransaction,
	useMutationSyncDepositTransaction,
	useMutationSyncWithdrawalTransaction,
} from '../vaults';
import { useMutationSendChatMessage } from './useMutationSendChatMessage';

interface UseChatSessionOptions {
	vaultId?: string;
}

export const THINKING_MESSAGE = {
	id: 'thinking',
	from: 'bot',
	thinking: true,
	content: [],
};

export const useChatSession = (options: UseChatSessionOptions = {}) => {
	const { vaultId } = options;
	const account = useActiveAccount();

	const { mutateAsync: sendChatMessage } = useMutationSendChatMessage();
	const { mutateAsync: syncDepositTransaction } = useMutationSyncDepositTransaction();
	const { mutateAsync: syncWithdrawalTransaction } =
		useMutationSyncWithdrawalTransaction();
	const { mutateAsync: syncCreateVaultTransaction } =
		useMutationSyncCreateVaultTransaction();

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [messageDraft, setMessageDraft] = useState('');
	const [isThinking, setIsThinking] = useState(false);

	// Delay session setup until we're on the client
	useEffect(() => {
		if (typeof window !== 'undefined') {
			(async () => {
				const initialMessages = await ChatSession.load();

				if (initialMessages.length === 0) {
					sendAndWaitForChatResponse('Hi');
					return;
				}

				setMessages(initialMessages);

				const lastMsgIndex = initialMessages.length - 1;
				if (
					initialMessages[lastMsgIndex].from === 'user' &&
					typeof initialMessages[lastMsgIndex].content?.[0] === 'string'
				) {
					sendAndWaitForChatResponse(initialMessages[lastMsgIndex].content[0]);
				}
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		ChatSession.persist(messages);
	}, [messages]);

	const clearAllMessages = useOnEventCallback(async () => {
		setMessages([]);
		await delay(500);
		sendAndWaitForChatResponse('clear conservation', 'CLAUDE');
	});

	const sendAndWaitForChatResponse = useOnEventCallback(
		async (message: string, llmModel?: AIChatParams['llmModel']) => {
			try {
				setIsThinking(true);

				const response = await sendChatMessage({
					message,
					vaultId,
					llmModel: llmModel ?? 'OPENAI',
				});

				const botMsg: ChatMessage = {
					id: Date.now() + 1,
					from: 'bot',
					content: response.content || ['Sorry, I didn’t get that.'],
					typingAnimation: true,
				};

				if (response.requireSignature) {
					botMsg.action = {
						data: response.dataToSign,
						target: response.contractAddress,
						actionName: response.action ?? '',
						customParams: response.customParams ?? {},
					};
				}

				setMessages((prev) => [...prev, botMsg]);
			} catch (error) {
				// Retry with CLAUDE model if currently using OpenAI
				const isUsingOpenAI = !llmModel || llmModel === 'OPENAI';
				if (isUsingOpenAI) {
					await sendAndWaitForChatResponse(message, 'CLAUDE');
					return;
				}

				setMessages((prev) => [
					...prev,
					{
						id: Date.now() + 1,
						from: 'bot',
						content: ['Something went wrong. Please try again later.'],
						typingAnimation: true,
					},
				]);
			} finally {
				setIsThinking(false);
			}
		},
	);

	const commitMessageDraft = async () => {
		const trimmed = messageDraft.trim();
		if (!trimmed || isThinking) return;

		const userMsg: ChatMessage = {
			id: Date.now(),
			from: 'user',
			content: [trimmed],
		};

		setMessages((prev) => [...prev, userMsg]);
		setMessageDraft('');
		await sendAndWaitForChatResponse(trimmed);
	};

	const deleteActionOfMessage = (message: ChatMessage) => {
		if (!message.action) return;
		const updatedMessages = messages.map((msg) => {
			if (msg.id === message.id) {
				return { ...msg, action: undefined, typingAnimation: false };
			}
			return { ...msg, typingAnimation: false };
		});
		setMessages(updatedMessages);
	};

	const settleActionExecution = useOnEventCallback(
		async (
			txHash: string,
			actionName: ChatAction | string,
			customParams: Record<string, any> = {},
		) => {
			if (NEED_RETRY_ACTIONS.includes(actionName)) {
				sendAndWaitForChatResponse('retry');
				return;
			}

			switch (actionName as ChatAction) {
				case 'createVault': {
					syncCreateVaultTransaction({
						chainId: CHAIN.id,
						txHash,
					});
					break;
				}

				case 'deposit': {
					const { vaultContract } = customParams;
					vaultContract &&
						syncDepositTransaction({
							vaultAddress: vaultContract,
							txHash,
						});
					break;
				}

				case 'withdraw': {
					const { vaultContract } = customParams;
					vaultContract &&
						syncWithdrawalTransaction({
							vaultAddress: vaultContract,
							txHash,
						});
					break;
				}

				default:
					break;
			}
		},
	);

	const executeAction = useOnEventCallback(async (message: ChatMessage) => {
		try {
			if (!message.action || !account) return;

			const { data, target, actionName, customParams } = message.action;
			const signer = await getSignerFromAccount(account);
			const tx = await signer.sendTransaction({
				to: target,
				data: data,
			});
			const receipt = await tx.wait();
			const isSuccess = receipt.status === 1;

			// Action should be no longer valid and exist in message
			deleteActionOfMessage(message);
			await delay(500);

			const explorerUrl = get(CHAIN, (d) => d.blockExplorers[0].url, '');
			let resultMsg: ChatMessage;
			if (isSuccess) {
				resultMsg = {
					id: Date.now() + 1,
					from: 'bot',
					content: [
						`Transaction sent successfully! View it on explorer:`,
						`[${tx.hash}](${explorerUrl}/tx/${tx.hash})`,
					],
					typingAnimation: false,
				};
			} else {
				resultMsg = {
					id: Date.now() + 1,
					from: 'bot',
					content: [
						`Transaction failed! Inspect it on explorer:`,
						`[${tx.hash}](${explorerUrl}/tx/${tx.hash})`,
					],
					typingAnimation: false,
				};
			}

			setMessages((prev) => [...prev, resultMsg]);

			if (isSuccess) {
				await delay(500);
				settleActionExecution(tx.hash, actionName, customParams);
			}
		} catch (e) {
			console.error(e);
			toast.error(`Failed to execute action: ${getErrorMessage(e)}`);
		}
	});

	return {
		messages,
		messageDraft,
		isThinking,
		setMessageDraft,
		commitMessageDraft,
		executeAction,
		clearAllMessages,
	};
};
