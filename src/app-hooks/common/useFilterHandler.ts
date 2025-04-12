'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useFilterHandler = () => {
	const pathname = usePathname();
	const router = useRouter();

	const handleFilterChange = useCallback(
		(
			filterName: string,
			value: string | undefined,
			options?: {
				resetPageValue?: boolean;
			},
		) => {
			const params = new URLSearchParams(window.location.search);

			if (value !== undefined) {
				params.set(filterName, value);
			} else {
				params.delete(filterName); // Delete if value is undefined
			}

			if (options?.resetPageValue) {
				params.delete('page');
			}

			const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
			router.replace(newUrl, { scroll: false });
		},
		[pathname, router],
	);

	return handleFilterChange;
};
