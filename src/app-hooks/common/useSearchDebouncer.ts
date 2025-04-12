import { debounce } from 'lodash';
import { useCallback } from 'react';

export const useSearchDebouncer = ({
	debounceMs,
	onSearch,
}: {
	debounceMs?: number;
	onSearch?: (query: string) => void;
}) => {
	return useCallback(
		debounce((text: string) => onSearch?.(text), debounceMs || 400),
		[],
	);
};
