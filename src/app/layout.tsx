import '@/assets/styles/main.scss';

import { ServerPropsWithLocale } from '@/app-types/common';
import { Metadata, Viewport } from 'next';
import { ToastContainer } from 'react-toastify';

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

export default async function RootLayout({
	children,
}: ServerPropsWithLocale<{ children: React.ReactNode }, {}>) {
	return (
		<html lang="en">
			<meta property="og:title" content="partnr vault" />

			<meta
				property="og:description"
				content="automate your trading effortlessly. explore, invest, and let AI optimize your returns!"
			/>

			<body suppressHydrationWarning>
				{children}

				<ToastContainer
					theme="light"
					hideProgressBar
					closeButton={false}
					autoClose={3000}
				/>
			</body>
		</html>
	);
}
