import { AuthProvider, WrappedSessionProvider } from '@/app-contexts/auth';
import NProgressProvider from '@/app-contexts/nprogress/nprogress-provider';
import { ReactQueryProvider } from '@/app-contexts/react-query';
import { TWProvider } from '@/app-contexts/thirdweb';
import { ServerPropsWithLocale } from '@/app-types/common';
import { getAuthSession } from '@/auth/auth.shared';

export default async function LocaleLayout({
	children,
}: ServerPropsWithLocale<{ children: React.ReactNode }, {}>) {
	const session = await getAuthSession();

	return (
		<NProgressProvider>
			<ReactQueryProvider>
				<TWProvider>
					<WrappedSessionProvider session={session}>
						<AuthProvider>{children}</AuthProvider>
					</WrappedSessionProvider>
				</TWProvider>
			</ReactQueryProvider>
		</NProgressProvider>
	);
}
