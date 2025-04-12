import { AuthProvider, WrappedSessionProvider } from '@/app-contexts/auth';
import { ServerPropsWithLocale } from '@/app-types/common';
import { getAuthSession } from '@/auth/auth.shared';

export default async function LocaleLayout({
	children,
}: ServerPropsWithLocale<{ children: React.ReactNode }, {}>) {
	const session = await getAuthSession();

	return (
		<WrappedSessionProvider session={session}>
			<AuthProvider>{children}</AuthProvider>
		</WrappedSessionProvider>
	);
}
