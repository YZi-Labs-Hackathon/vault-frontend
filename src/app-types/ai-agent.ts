export type ChatMessage = {
	id: number;
	from: 'user' | 'bot';
	content: string[];
	typingAnimation?: boolean;
	action?: {
		data: string;
		target: string;
		actionName: ChatAction | string;
		customParams: Record<string, any>;
	};
};

export type ChatAction = 'createVault' | 'approve' | 'deposit' | 'withdraw';
export const NEED_RETRY_ACTIONS: (ChatAction | string)[] = ['approve'];

export const serializeChatMessage = (message: ChatMessage): Record<string, any> => {
	return {
		id: message.id,
		from: message.from,
		content: message.content,
		action: message.action,
	};
};
