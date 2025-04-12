import { ChatMessage, serializeChatMessage } from '@/app-types/ai-agent';
import localforage from 'localforage';
import { isArray } from 'lodash';

class ChatSessionService {
	private chatStore: LocalForage;

	constructor() {
		this.chatStore = localforage.createInstance({
			driver: localforage.INDEXEDDB,
			name: 'partnt_vaults_chat',
			storeName: 'chat_store',
			version: 1,
		});
	}

	public chatKey(): string {
		return `chat_message_list`;
	}

	public async persist(messages: ChatMessage[]) {
		await this.chatStore.setItem(this.chatKey(), messages.map(serializeChatMessage));
	}

	public async insertOne(message: ChatMessage) {
		const messages = await this.load();
		messages.push(message);
		await this.persist(messages);
	}

	public async clear() {
		await this.chatStore.setItem(this.chatKey(), []);
	}

	public async load(): Promise<ChatMessage[]> {
		try {
			const messages = await this.chatStore.getItem(this.chatKey());
			if (messages) {
				if (isArray(messages)) {
					return messages.map((msg: any) => ({
						id: msg.id,
						from: msg.from,
						content: msg.content,
						action: msg.action,
						typingAnimation: false,
					}));
				}
			}
		} catch (e) {
			// Do nothing
		}
		return [];
	}
}
export const ChatSession = new ChatSessionService();
