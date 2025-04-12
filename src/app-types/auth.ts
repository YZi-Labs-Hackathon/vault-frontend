import { Session } from 'next-auth';
import { Maybe } from './common';

export interface PartnrAccessToken {
	accessToken: string;
	refreshToken: string;
}

export interface PartnrAccessTokenJson {
	accessToken: string;
	refreshToken: string;
}

export const PARTNR_AUTH_STORE_PREFIX = 'partnr-auth-store/';

export interface PartnrUser {
	id: string;
	name?: string;
	address: string;
	chainType: string;
	role: string;
	status: number;
}

export interface AuthContextValue {
	session: Maybe<Session>;
	address: Maybe<string>;
	login: () => Promise<void>;
	logout: () => Promise<void>;
}

export interface SignInPayload {
	address: string;
	challengeCode: string;
	signature: string;
}
