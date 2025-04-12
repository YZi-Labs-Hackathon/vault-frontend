import { get } from '@/app-helpers/misc';
import { env } from '@/env';
import axios from 'axios';
import { PartnrAuth } from '../auth';

export const axiosAPI = axios.create({
	baseURL: env.NEXT_PUBLIC_API_URL,
});

axiosAPI.interceptors.request.use(
	async (config) => {
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
	},
	(error) => Promise.reject(error),
);
