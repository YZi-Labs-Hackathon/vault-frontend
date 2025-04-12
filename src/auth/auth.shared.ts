/**
 * Both client and server codes can call into this file
 * EXCEPT for the nextjs middleware.ts
 */

import jwt from 'jsonwebtoken';
import { type Session } from 'next-auth';
import { ACCESS_TOKEN_EXP_BUFFER } from './auth-types';
import { authConfig } from './auth.config';

export const isAccessTokenExpired = (accessToken: string) => {
	const now = Math.floor(Date.now() / 1000);
	const { exp } = jwt.decode(accessToken) as jwt.JwtPayload;

	// exp (expiry time) is in seconds
	// if exp existsand exp is less than current seconds + a safe buffer
	// that means the token is expired
	return !!exp && exp < ACCESS_TOKEN_EXP_BUFFER + now;
};

export const isSessionValid = (session: Session | null): session is Session => {
	if (!session) return false;
	return !isAccessTokenExpired(session.token.accessToken);
};

/**
 * Get session
 * Usage for server side only
 */
export const getAuthSession = async () => {
	const { getServerSession } = await import('next-auth');
	return await getServerSession(authConfig);
};
