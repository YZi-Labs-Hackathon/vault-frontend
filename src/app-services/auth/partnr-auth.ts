import { Deferred } from '@/app-helpers/deferred-promise';
import { SignInPayload } from '@/app-types/auth';
import { isAccessTokenExpired } from '@/auth/auth.shared';
import memoize from 'memoizee';
import { Session } from 'next-auth';
import { getSession, signIn, signOut } from 'next-auth/react';

class PartnrAuthService {
	#initSessionDeferred: Deferred<void> = new Deferred();
	#sessionUpdateFn: (() => Promise<void>) | null = null;

	#callSessionUpdate = memoize(
		async (_: Session) => {
			await this.#sessionUpdateFn?.();
		},
		{
			maxAge: 60 * 1000, // 1-minute cache
			promise: true,
			normalizer: (args) => JSON.stringify(args[0].token.accessToken),
		},
	);

	async resolveInit(sessionUpdateFn: () => Promise<void>) {
		this.#sessionUpdateFn = sessionUpdateFn;
		this.#initSessionDeferred.resolve();
	}

	async signIn({ address, challengeCode, signature }: SignInPayload) {
		const res = await signIn('login', {
			redirect: false,
			address,
			challengeCode,
			signature,
		});

		if (res?.ok) {
			return true;
		} else {
			throw new Error(res?.error || 'Failed to sign in');
		}
	}

	async signOut() {
		return signOut({ redirect: false });
	}

	async #internalGetSession(): Promise<Session | null> {
		const session = await getSession();
		if (!session) {
			return null;
		}

		if (isAccessTokenExpired(session.token.accessToken)) {
			console.debug('Access token is expired. Refreshing...');
			await this.#callSessionUpdate(session);
			// Re-fetch session after refresh
			return await getSession();
		}

		return session;
	}

	async getSession(): Promise<Session | null> {
		try {
			await this.#initSessionDeferred.promise;
			return await this.#internalGetSession();
		} catch (e) {
			console.error('Failed to get session:', e);
			return null;
		}
	}
}

export const PartnrAuth = new PartnrAuthService();
