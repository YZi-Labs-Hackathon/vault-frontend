import { get } from '@/app-helpers/misc';
import { env } from '@/env';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { PartnrAuth } from '../auth';

const authInterceptor = async (config: InternalAxiosRequestConfig<any>) => {
	if (config.skip_auth !== true) {
		const session = await PartnrAuth.getSession();
		const accessToken = get(session, (d) => d.token.accessToken, '');
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		} else {
			throw new Error(
				'Unauthorized! Authentication is not available. You may need to sign in again and retry.',
			);
		}
	}
	return config;
};

/** Main API */
export const axiosAPI = axios.create({
	baseURL: env.NEXT_PUBLIC_API_URL,
});

axiosAPI.interceptors.request.use(
	async (config) => {
		await authInterceptor(config);
		return config;
	},
	(error) => Promise.reject(error),
);

/** AI Agent API */
export const axiosAIAgent = axios.create({
	baseURL: env.NEXT_PUBLIC_AI_AGENT_API_URL,
});

axiosAIAgent.interceptors.request.use(
	async (config) => {
		await authInterceptor(config);
		return config;
	},
	(error) => Promise.reject(error),
);
