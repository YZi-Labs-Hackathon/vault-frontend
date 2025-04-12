import { get } from '@/app-helpers/misc';
import { ApiResponse } from '@/app-types/common';
import { isNil, omitBy } from 'lodash';
import { AIChatData, AIChatParams } from './ai-agent-api.types';
import { axiosAIAgent } from './transport';

class AIAgentApiService {
	async sendChatMessage(params: AIChatParams): Promise<AIChatData> {
		const response = await axiosAIAgent.post<ApiResponse<AIChatData>>(
			'/v1/chat/messages',
			omitBy(params, isNil),
		);
		return get(response, (d) => d.data.data, {} as AIChatData) as AIChatData;
	}
}

export const AIAgentApi = new AIAgentApiService();
