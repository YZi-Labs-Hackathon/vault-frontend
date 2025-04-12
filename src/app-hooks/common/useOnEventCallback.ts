'use client';

import { useCallback, useRef } from 'react';

/**
 * Handle function
 * @param callback
 */
export const useOnEventCallback = <T extends (...args: any[]) => any>(callback: T): T => {
	const ref = useRef<T>((() => {}) as T);

	if (typeof callback === 'function') {
		ref.current = callback;
	}

	return useCallback<T>(
		((...args) => {
			return ref.current(...args);
		}) as T,
		[],
	);
};
