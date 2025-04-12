import { env } from '@/env';
import { z } from 'zod';

export const zCredentialsSchema = z.object({
	challengeCode: z.string(),
	address: z.string(),
	signature: z.string(),
});
export type AuthCredentials = z.infer<typeof zCredentialsSchema>;

export const SESSION_SECURE = env.NEXTAUTH_URL?.startsWith('https://');

export const SESSION_TIMEOUT = 30 * 24 * 60 * 60;

// Should be called in server side only as it uses NEXTAUTH_URL env
export const SESSION_COOKIE_NAME = SESSION_SECURE
	? '__Secure-next-auth.session-token'
	: 'next-auth.session-token';

export interface AuthToken {
	accessToken: string;
	refreshToken: string;
}

export const ACCESS_TOKEN_EXP_BUFFER = Number(env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRE_BUFFER);
