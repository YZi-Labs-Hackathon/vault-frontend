import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		token: Pick<JWT, 'accessToken'> & { error?: string };
		user: {
			id: string;
			name?: string;
			address: string;
			chainType: string;
			role: string;
			status: number;
		};
	}

	interface User {
		accessToken: string;
		refreshToken: string;
		user: Session['user'];
	}
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT {
		accessToken: string;
		refreshToken: string;
		user: Session['user'];
	}
}
