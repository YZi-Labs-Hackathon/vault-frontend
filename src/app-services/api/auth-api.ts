import { get } from '@/app-helpers/misc';
import { ApiResponse } from '@/app-types/common';
import { AuthPayload, AuthRefreshPayload, AuthResponse } from './auth-api.types';
import { axiosAPI } from './transport';

class AuthApiService {
	async login(payload: AuthPayload): Promise<AuthResponse | null> {
		const response = await axiosAPI.post<ApiResponse<AuthResponse>>(
			'/api/auth/login',
			{
				...payload,
			},
			{
				skip_auth: true,
			},
		);
		return get(response, (d) => d.data.data, null);
	}

	async refresh(payload: AuthRefreshPayload): Promise<AuthResponse | null> {
		const response = await axiosAPI.post<ApiResponse<AuthResponse>>(
			'/api/auth/refresh',
			{
				...payload,
			},
			{
				skip_auth: true,
			},
		);
		return get(response, (d) => d.data.data, null);
	}

	async getChallenge(address: string): Promise<string> {
		const response = await axiosAPI.get<ApiResponse<{ challengeCode: string }>>(
			`/api/auth/challengeCode/${address}`,
			{
				skip_auth: true,
			},
		);
		return get(response, (d) => d.data.data.challengeCode, '');
	}
}

export const AuthApi = new AuthApiService();
