import { useEffect, useState } from 'react';
import { ChatSession } from '@/app-services/chat-session';
import { ChatMessage } from '@/app-types/ai-agent';
import { useMutationSendChatMessage } from './useMutationSendChatMessage';

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

			const response = await sendChatMessage({ message, vaultId });

			const botMsg: ChatMessage = {
				id: Date.now() + 1,
				from: 'bot',
				content: response.content || ['Sorry, I didn’t get that.'],
				typingAnimation: true,
			};

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

	return {
		messages,
		messageDraft,
		isThinking,
		setMessageDraft,
		commitMessageDraft,
	};
};
