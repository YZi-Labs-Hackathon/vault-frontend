'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export const useUrlQuery = () => {
	const searchParams = useSearchParams();

	return useMemo(() => {
		return Object.fromEntries(searchParams);
	}, [searchParams]);
};
