import { isNil } from 'lodash';

export const urlStateUtils = {
	encodeState: <T>(state: T): string => {
		return btoa(JSON.stringify(state));
	},

	decodeState: <T>(encodedState: string): T | null => {
		try {
			return JSON.parse(atob(encodedState));
		} catch (e) {}

		return null;
	},

	getStateFromURL: <T>(): T | null => {
		if (typeof window === 'undefined') {
			return null;
		}

		const params = new URLSearchParams(window.location.search);

		return Object.fromEntries(params) as T;
	},

	updateURLWithState: (queryKey: string, state: string) => {
		const params = new URLSearchParams(window.location.search);
		params.delete(queryKey);

		params.set(queryKey, state);

		const newURL = `${window.location.pathname}?${params.toString()}`;
		window.history.replaceState({}, '', newURL);
	},

	formatQueryParams: (params: { key: string; value?: string }[]) => {
		return params
			.filter((e) => !isNil(e.value))
			.map(({ key, value }) => `${key}=${value}`)
			.join('&');
	},
};
