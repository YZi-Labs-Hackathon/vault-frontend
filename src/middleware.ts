import { i18nRouter } from 'next-i18n-router';
import { Config } from 'next-i18n-router/dist/types';
import { NextRequest } from 'next/server';
import i18nConfig from '../i18n-config';

export async function middleware(request: NextRequest) {
	return i18nRouter(request, i18nConfig as Config);
}

export const config = {
	/*
	 * --- negative lookahead pattern ---
	 * Match all request paths except for the ones starting with:
	 * - api (API routes)
	 * - _next/static (static files)
	 * - _next/image (image optimization files)
	 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
	 * - vendors/.* (vendors files)
	 * - .well-known/.* (well-known files)
	 */
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|favicon.png|sitemap.xml|robots.txt|vendors/.*|.well-known/.*).*)',
	],
};
