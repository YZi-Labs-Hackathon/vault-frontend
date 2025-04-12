import { AIAgentApi, AIChatParams } from '@/app-services/api';
import { useMutation } from '@tanstack/react-query';

export const useMutationSendChatMessage = () => {
	return useMutation({
		mutationKey: ['mutation-send-chat-message'],
		mutationFn: async (params: AIChatParams) => {
			const response = await AIAgentApi.sendChatMessage(params);
			if (!response.content) {
				throw new Error('No response content');
			}
			return response;
		},
	});
};
