/**
 * Only server codes can call into this file
 * Imports of this file must be cleaned so that it can be run in middleware.ts
 * Read more: https://nextjs.org/docs/pages/api-reference/edge
 **/

import { env } from '@/env';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_EXP_BUFFER, AuthToken } from './auth-types';

export const isAccessTokenExpired = (accessToken: string) => {
	const now = Math.floor(Date.now() / 1000);
	const { exp } = jwt.decode(accessToken) as jwt.JwtPayload;

	// exp (expiry time) is in seconds
	// if exp existsand exp is less than current seconds + a safe buffer
	// that means the token is expired
	return !!exp && exp < ACCESS_TOKEN_EXP_BUFFER + now;
};

export const deriveUserInfoFromAccessToken = (accessToken: string) => {
	const {
		id,
		address: addrFromPayload,
		chainType,
		role,
		status,
		name = '',
	} = jwt.decode(accessToken) as jwt.JwtPayload;

	return {
		id,
		address: addrFromPayload,
		chainType,
		role,
		status,
		name: name ?? '',
	};
};

/**
 * Sign out by accepting a request and return a response
 * Usage for server side only
 *
 * @param request
 * @returns
 */
export const signOut = (request: NextRequest) => {
	const response = NextResponse.redirect(new URL(request.url));

	request.cookies.getAll().forEach((cookie) => {
		if (cookie.name.includes('next-auth.session-token'))
			response.cookies.delete(cookie.name);
	});

	return response;
};

/**
 * call fetch with POST method
 * Usage for server side only
 *
 * @param param0
 * @returns
 */
export const post = async <T = any>({
	body,
	path,
	req,
}: {
	path: string;
	body: any;
	req?: any;
}) => {
	return (await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'User-Agent': req?.headers?.['user-agent'] ?? '',
		},
		body: !body ? undefined : JSON.stringify(body),
	}).then((r) => r.json())) as T;
};

type Normalizer<T extends any[]> = (...args: T) => string;

function safeMemoize<T extends any[], R>(
	fn: (...args: T) => Promise<R>,
	normalizer: Normalizer<T>,
): (...args: T) => Promise<R> {
	const cache = new Map<string, Promise<R>>();

	return async (...args: T): Promise<R> => {
		const cacheKey = normalizer(...args);

		if (cache.has(cacheKey)) {
			return cache.get(cacheKey)!;
		}

		const promise = fn(...args).finally(() => {
			cache.delete(cacheKey);
		});

		cache.set(cacheKey, promise);
		return promise;
	};
}

/**
 * Refresh token
 * Usage for server side only
 */
export const refreshToken = safeMemoize(
	async (token: AuthToken): Promise<AuthToken> => {
		const { data } = await post({
			path: '/api/auth/refresh',
			body: {
				refreshToken: token.refreshToken,
			},
		});

		if (!data || !data.accessToken || !data.refreshToken) {
			throw new Error(
				`Could not refresh token, given token might be expired: ${token.refreshToken}`,
			);
		}

		return {
			...token,
			accessToken: data.accessToken,
			refreshToken: data.refreshToken,
		};
	},
	(token) => token.refreshToken,
);
