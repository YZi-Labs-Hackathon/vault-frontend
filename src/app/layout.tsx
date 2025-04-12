import '@/assets/styles/main.scss';

import { FeatureFlagProvider } from '@/app-contexts/feature-flag';
import NProgressProvider from '@/app-contexts/nprogress/nprogress-provider';
import { ReactQueryProvider } from '@/app-contexts/react-query';
import { TWProvider } from '@/app-contexts/thirdweb';
import { ServerPropsWithLocale } from '@/app-types/common';
import { Metadata, Viewport } from 'next';
import i18nConfig from '../../i18n-config';

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: 'cover',
};

export const metadata: Metadata = {
	title: 'partnr vault',
	description:
		'automate your trading effortlessly. explore, invest, and let AI optimize your returns!',
};

export function generateStaticParams() {
	return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
	children,
	params,
}: ServerPropsWithLocale<{ children: React.ReactNode }, {}>) {
	const { locale } = await params;
	return (
		<html lang={locale}>
			<meta property="og:title" content="partnr vault" />

			<meta
				property="og:description"
				content="automate your trading effortlessly. explore, invest, and let AI optimize your returns!"
			/>

			<body>
				<NProgressProvider>
					<ReactQueryProvider>
						<FeatureFlagProvider>
							<TWProvider>{children}</TWProvider>
						</FeatureFlagProvider>
					</ReactQueryProvider>
				</NProgressProvider>
			</body>
		</html>
	);
}
