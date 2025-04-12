import { CHAIN, getSignerFromAccount } from '@/app-contexts/thirdweb';
import { ChatSession } from '@/app-services/chat-session';
import { ChatMessage } from '@/app-types/ai-agent';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useActiveAccount } from 'thirdweb/react';
import { useMutationSendChatMessage } from './useMutationSendChatMessage';
import { get } from '@/app-helpers/misc';
import { getErrorMessage } from '@/app-helpers/errors';

interface UseChatSessionOptions {
	persistEnabled?: boolean;
	useDefaultIfEmpty?: boolean;
	vaultId?: string;
}

export const THINKING_MESSAGE = {
	id: 'thinking',
	from: 'bot',
	thinking: true,
	content: [],
};

export const useChatSession = (
	sessionId: string,
	options: UseChatSessionOptions = {},
) => {
	const { persistEnabled = true, useDefaultIfEmpty = true, vaultId } = options;
	const account = useActiveAccount();

	const { mutateAsync: sendChatMessage } = useMutationSendChatMessage();

	const [chatSession, setChatSession] = useState<ChatSession | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [messageDraft, setMessageDraft] = useState('');
	const [isThinking, setIsThinking] = useState(false);

	// Delay session setup until we're on the client
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const session = ChatSession.fromSessionId(sessionId);
			setChatSession(session);

			const initialMessages = useDefaultIfEmpty
				? session.useDefaultIfEmpty()
				: session.load();

			setMessages(initialMessages);

			// Auto trigger bot response if only 1 user message
			if (
				initialMessages.length === 1 &&
				initialMessages[0].from === 'user' &&
				typeof initialMessages[0].content?.[0] === 'string'
			) {
				sendAndWaitForChatResponse(initialMessages[0].content[0]);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessionId]);

	useEffect(() => {
		if (chatSession && persistEnabled) {
			chatSession.persist(messages);
		}
	}, [chatSession, messages, persistEnabled]);

	const sendAndWaitForChatResponse = async (message: string) => {
		try {
			setIsThinking(true);

			const response = await sendChatMessage({ message, vaultId, llmModel: 'OPENAI' });

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
				};
			}

			setMessages((prev) => [...prev, botMsg]);
		} catch (error) {
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
	};

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

	const executeAction = useCallback(
		async (message: ChatMessage) => {
			try {
				console.debug('message', message);
				if (!message.action || !account) return;

				const { data, target } = message.action;
				const signer = await getSignerFromAccount(account);
				const tx = await signer.sendTransaction({
					to: target,
					data: data,
				});
				await tx.wait();

				// Action should be no longer valid and exist in message
				deleteActionOfMessage(message);

				setTimeout(() => {
					const explorerUrl = get(CHAIN, (d) => d.blockExplorers[0].url, '');
					const successBotMsg: ChatMessage = {
						id: Date.now() + 1,
						from: 'bot',
						content: [
							`Transaction sent successfully! View it on explorer:`,
							`[${tx.hash}](${explorerUrl}/tx/${tx.hash})`,
						],
						typingAnimation: false,
					};
					setMessages((prev) => [...prev, successBotMsg]);
				}, 500);
			} catch (e) {
				console.error(e);
				toast.error(`Failed to execute action: ${getErrorMessage(e)}`);
			}
		},
		[account, setMessages],
	);

	return {
		messages,
		messageDraft,
		isThinking,
		setMessageDraft,
		commitMessageDraft,
		executeAction,
	};
};
