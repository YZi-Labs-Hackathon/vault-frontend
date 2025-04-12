import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthCredentials, AuthToken, zCredentialsSchema } from './auth-types';
import { deriveUserInfoFromAccessToken, post, refreshToken } from './auth.server';
import { isAccessTokenExpired } from './auth.shared';

const authConfig: AuthOptions = {
	providers: [
		CredentialsProvider({
			credentials: {},
			id: 'login',
			authorize: async (credentials, req) => {
				const result = zCredentialsSchema.safeParse(credentials);

				if (!result.success) {
					throw new Error('Invalid credentials');
				}

				const { challengeCode, address, signature } = credentials as AuthCredentials;
				const { statusCode, message, data } = await post({
					req,
					path: '/api/auth/login',
					body: {
						challengeCode,
						address,
						signature,
					},
				});

				if ((statusCode !== 200 && statusCode !== 201) || !data) {
					throw new Error(message);
				}

				const { accessToken, refreshToken } = data;
				const user = deriveUserInfoFromAccessToken(accessToken);

				return {
					id: user.id,
					accessToken,
					refreshToken,
					user,
				};
			},
		}),
	],
	pages: {
		signIn: '/auth/login',
		signOut: '/auth/logout',
	},
	callbacks: {
		jwt: async ({ token, user, trigger }) => {
			try {
				if (user) {
					token.accessToken = user.accessToken;
					token.refreshToken = user.refreshToken;
					token.user = user.user;
				}

				// If trigger === 'update' and token is about to expire
				// then refresh token
				// trigger === 'update' is true when `useSession().update()` is called
				if (trigger === 'update' && isAccessTokenExpired(token.accessToken)) {
					// Just refresh token no matter if it's already expired (will throw an error for the re-signin)
					const newToken: AuthToken = await refreshToken(token);
					console.log('[INFO] refreshed token', token);
					if (newToken) {
						const user = deriveUserInfoFromAccessToken(token.accessToken);
						return {
							...token,
							accessToken: newToken.accessToken,
							refreshToken: newToken.refreshToken,
							user,
						};
					}
				}

				return token;
			} catch (e) {
				console.log('[ERROR] refresh token', (e as any).message);
				return {
					...token,
					error: 'RefreshTokenError',
					message: (e as any).message,
				};
			}
		},
		session: ({ session, token }) => {
			session.user = token.user;
			session.token = {
				accessToken: token.accessToken,
				error: token.error ? (token.error as string) : undefined,
			};
			return session;
		},
	},
	session: { strategy: 'jwt' },
	debug: true,
};

export { authConfig };
