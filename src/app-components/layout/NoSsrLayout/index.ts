import dynamic from 'next/dynamic';

export const NoSsrLayout = dynamic(() => import('./NoSsrLayout'), {
	ssr: false,
});
