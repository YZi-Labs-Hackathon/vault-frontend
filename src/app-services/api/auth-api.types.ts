export interface AuthPayload {
	challengeCode: string;
	address: string;
	signature: string;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
}

export interface AuthRefreshPayload {
	refreshToken: string;
}
