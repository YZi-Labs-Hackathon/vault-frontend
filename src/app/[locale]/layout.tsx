import { AuthProvider, WrappedSessionProvider } from '@/app-contexts/auth';
import { ServerPropsWithLocale } from '@/app-types/common';
import { getAuthSession } from '@/auth/auth.shared';
import { i18nNamespaces, initTranslations, TranslationProvider } from '@/i18n';

export default async function LocaleLayout({
	children,
	params,
}: ServerPropsWithLocale<{ children: React.ReactNode }, {}>) {
	const { locale } = await params;
	const { resources } = await initTranslations(locale, i18nNamespaces);
	const session = await getAuthSession();

	return (
		<TranslationProvider
			locale={locale}
			resources={resources}
			namespaces={i18nNamespaces}
		>
			<WrappedSessionProvider session={session}>
				<AuthProvider>{children}</AuthProvider>
			</WrappedSessionProvider>
		</TranslationProvider>
	);
}
