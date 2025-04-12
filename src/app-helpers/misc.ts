import { Maybe } from '@/app-types/common';
import { env } from '@/env';
import DOMPurify from 'dompurify';
import { Session } from 'next-auth';

export type RequiredRecursively<T> = Exclude<
	T extends string | number | boolean
		? T
		: {
				[P in keyof T]-?: T[P] extends (infer U)[]
					? RequiredRecursively<U>[]
					: T[P] extends Array<infer U>
						? RequiredRecursively<U>[]
						: RequiredRecursively<T[P]>;
			},
	null | undefined
>;

export type AccessorFunction<T, R> = (object: RequiredRecursively<T>) => R;

export function get<T, R>(object: T, accessorFn: AccessorFunction<T, R>): R | undefined;
export function get<T, R>(
	object: T,
	accessorFn: AccessorFunction<T, R>,
	defaultValue: R,
	executeFn?: boolean,
): R;
export function get<T, R>(
	object: T,
	accessorFn: AccessorFunction<T, R>,
	defaultValue?: R,
	executeFn: boolean = true,
): R | undefined {
	try {
		const result =
			executeFn === true
				? accessorFn(object as unknown as RequiredRecursively<T>)
				: defaultValue;
		return result === undefined || result === null ? defaultValue : result;
	} catch (e) {
		return defaultValue;
	}
}

export type KnownKeys<T> = {
	[K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
	? U
	: never;

export function on<T extends Window | Document | HTMLElement | EventTarget>(
	obj: T | null,
	...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]
): void {
	if (obj && obj.addEventListener) {
		obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>));
	}
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
	obj: T | null,
	...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]
): void {
	if (obj && obj.removeEventListener) {
		obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>));
	}
}

export const cast = <T>(obj: any) => {
	return obj as unknown as T;
};

export const eventloop = async <T>(executorFn: () => T | Promise<T>) => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	return executorFn();
};

export const requestDelayedAnimationFrame = async (
	executorFn: () => void | Promise<void>,
	delay = 0,
) => {
	requestAnimationFrame(async () => {
		await new Promise((resolve) => setTimeout(resolve, delay));
		await executorFn();
	});
};

export const isSSR = () => typeof window === 'undefined';
export const isCSR = () => typeof window !== 'undefined';

/**
 * Serializes an object into a TanStack Query key.
 * @param keyPrefix A unique string identifier for the query.
 * @param obj The object to serialize (e.g., a Transaction or subset).
 * @returns An array suitable as a React Query query key.
 */
export function serializeToQueryKey<T extends Record<string, any>>(
	keyPrefix: string,
	obj: T,
): any[] {
	const queryKey: any[] = [keyPrefix];
	const sortedKeys = Object.keys(obj).sort();

	sortedKeys.forEach((key) => {
		const value = obj[key];

		if (value && typeof value === 'object' && !Array.isArray(value)) {
			queryKey.push({ [key]: serializeToQueryKey('', value).slice(1) });
		} else {
			queryKey.push({ [key]: value });
		}
	});

	return queryKey;
}

export const serializeSessionToQueryKey = (session: Maybe<Session>) => {
	if (!session) {
		return ['session', 'unauthorized'];
	}
	return ['session', session.user.id, session.token.accessToken];
};

export const isDev = () => {
	return env.NEXT_PUBLIC_ENV === 'development';
};

export const isProd = () => {
	return env.NEXT_PUBLIC_ENV === 'production';
};

export const isStaging = () => {
	return env.NEXT_PUBLIC_ENV === 'staging';
};

/**
 * Sanitizes text input using DOMPurify to prevent XSS attacks.
 * @param text The text to sanitize
 * @returns Sanitized text string with malicious content removed
 */
export const sanitizeText = (text: string): string => {
	if (!text) return '';
	return DOMPurify.sanitize(text.trim());
};
