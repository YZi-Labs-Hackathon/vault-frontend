/** Read more about fetch in Next.js: https://nextjs.org/docs/app/api-reference/functions/fetch */

import { Maybe } from '@/app-types/common';
import { Session } from 'next-auth';

interface FetchOptions {
	/** Custom headers to include in the request */
	headers?: Record<string, string>;

	/** HTTP method (defaults to GET) */
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

	/** Request body for POST/PUT/PATCH requests */
	body?: Record<string, any> | FormData;

	/** Cache control for Next.js server-side fetching */
	cache?: 'force-cache' | 'no-store';

	/** Revalidation time in seconds for Next.js cache */
	next?: { revalidate?: number; tags?: string[] };

	/** Timeout in milliseconds before request is aborted */
	timeout?: number;

	/** Whether to throw an error on HTTP errors (default: true) */
	throwOnError?: boolean;

	/**
	 * Attach authentication to the request
	 * can be an access token
	 * or a session object from NextAuth
	 */
	auth?: string | Maybe<Session>;
}

/**
 * API response wrapper with success status and data/error
 */
interface FetchResponse<T> {
	success: boolean;
	data?: T;
	error?: {
		message: string;
		status?: number;
		details?: any;
	};
}

/**
 * Fetches data server-side in Next.js with type safety and error handling
 * @param url - The endpoint to fetch from (relative or absolute URL)
 * @param options - Custom fetch options
 * @returns Promise resolving to FetchResponse with typed data
 * @example
 * const response = await ssrFetch<Vault>('/api/vault/uuid-of-vault', {
 *   cache: 'force-cache',
 *   next: { revalidate: 3600 }
 * });
 * if (response.success) {
 *   console.log(response.data); // Typed Vault object
 * }
 */
export async function ssrFetch<T = any>(
	url: string,
	options: FetchOptions = {},
): Promise<FetchResponse<T>> {
	// Default configuration
	const defaultOptions: FetchOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
		throwOnError: true,
		...options,
	};

	// Merge custom headers with defaults
	const headers = {
		...defaultOptions.headers,
		...(options.headers || {}),
	};

	if (options.auth) {
		if (typeof options.auth === 'string') {
			headers['Authorization'] = `Bearer ${options.auth}`;
		} else if (options.auth.token.accessToken) {
			headers['Authorization'] = `Bearer ${options.auth.token.accessToken}`;
		}
	}

	// Prepare fetch configuration
	const config: RequestInit = {
		method: defaultOptions.method,
		headers,
		cache: defaultOptions.cache,
		next: defaultOptions.next,
	};

	// Add body for applicable methods
	if (
		defaultOptions.body &&
		['POST', 'PUT', 'PATCH'].includes(defaultOptions.method || 'GET')
	) {
		config.body =
			defaultOptions.body instanceof FormData
				? defaultOptions.body
				: JSON.stringify(defaultOptions.body);

		// Remove Content-Type header if using FormData (browser will set it with boundary)
		if (defaultOptions.body instanceof FormData) {
			delete headers['Content-Type'];
		}
	}

	try {
		// Handle timeout if specified
		let controller: AbortController | undefined;
		let timeoutId: NodeJS.Timeout | undefined;
		if (defaultOptions.timeout) {
			controller = new AbortController();
			config.signal = controller.signal;
			timeoutId = setTimeout(() => controller?.abort(), defaultOptions.timeout);
		}

		// Perform the fetch
		const response = await fetch(url, config);

		// Clear timeout if it exists
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		// Handle HTTP errors
		if (!response.ok && defaultOptions.throwOnError) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		// Parse response based on content type
		const contentType = response.headers.get('content-type');
		let data: T;

		if (contentType?.includes('application/json')) {
			data = await response.json();
		} else {
			data = (await response.text()) as any; // Type assertion as fallback
		}

		return {
			success: response.ok,
			data: response.ok ? data : undefined,
			error: !response.ok
				? {
						message: `Fetch failed with status ${response.status}`,
						status: response.status,
						details: data,
					}
				: undefined,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error occurred';

		const fetchError = {
			success: false,
			error: {
				message: errorMessage,
				details: error instanceof Error ? error.stack : undefined,
			},
		};

		if (defaultOptions.throwOnError) {
			throw error;
		}

		return fetchError;
	}
}

export async function apiSSRFetch<T = any>(
	apiPath: string,
	options: FetchOptions = {},
	overrideUrl?: string,
) {
	return await ssrFetch<T>(
		`${overrideUrl ?? process.env.NEXT_PUBLIC_API_URL}`
			.concat(`${apiPath.startsWith('/') ? '' : '/'}`)
			.concat(apiPath),
		options,
	);
}
