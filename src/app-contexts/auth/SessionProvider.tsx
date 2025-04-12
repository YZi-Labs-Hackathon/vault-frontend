'use client';
import { Maybe } from '@/app-types/common';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

interface WrappedSessionProviderProps {
	session: Maybe<Session>;
	children?: React.ReactNode;
}

export const WrappedSessionProvider: React.FC<WrappedSessionProviderProps> = ({
	session,
	children,
}) => {
	return (
		<SessionProvider
			session={session}
			// Usecase: Disable offline support
			refetchWhenOffline={false}
			// Usecase: Multiple tabs opened
			refetchOnWindowFocus={true}
			// No need to poll the session
			refetchInterval={0}
		>
			{children}
		</SessionProvider>
	);
};
