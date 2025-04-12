import { ChatMessage } from '@/app-types/ai-agent';
import { v4 as uuid } from 'uuid';

export class ChatSession {
	private sessionId: string;

	private constructor() {
		this.sessionId = uuid();
	}

	public static create(): ChatSession {
		return new ChatSession();
	}

	public static fromSessionId(sessionId: string): ChatSession {
		const session = new ChatSession();
		session.sessionId = sessionId;
		return session;
	}

	public chatKey(): string {
		return `chat:${this.sessionId}`;
	}

	public getSessionId(): string {
		return this.sessionId;
	}

	public persist(messages: ChatMessage[]) {
		localStorage.setItem(this.chatKey(), JSON.stringify(messages));
	}

	public insertOne(message: ChatMessage) {
		const messages = this.load();
		messages.push(message);
		this.persist(messages);
	}

	public useDefaultIfEmpty(): ChatMessage[] {
		const messages = this.load();
		if (messages.length === 0) {
			const defaultMessages: ChatMessage[] = [
				{
					id: Date.now(),
					from: 'bot',
					text: 'Hello there, what can I help you?',
				},
			];
			this.persist(defaultMessages);
			return defaultMessages;
		}
		return messages;
	}

	public load(): ChatMessage[] {
		try {
			const messages = localStorage.getItem(this.chatKey());
			if (messages) {
				return JSON.parse(messages) as ChatMessage[];
			}
		} catch (e) {}
		return [];
	}
}
