export type StorePayload = Record<string, any>;

export type StoreAction = {
	type: string;
	payload: StorePayload;
};

export type PersistedState<T> = {
	state: T;
	version: number;
};
