export type ChatMessage = {
	id: number;
	from: 'user' | 'bot';
	content: string[];
	typingAnimation?: boolean;
	action?: {
		data: string;
		target: string;
	};
};

export const serializeChatMessage = (message: ChatMessage): Record<string, any> => {
	return {
		id: message.id,
		from: message.from,
		content: message.content,
		action: message.action,
	};
};
