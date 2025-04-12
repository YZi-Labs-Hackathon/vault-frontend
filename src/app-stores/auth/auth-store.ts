import { create } from 'zustand';
import { devtools, redux } from 'zustand/middleware';
import { StoreAction } from '../store-types';
import { IAuthStoreState } from './auth-store.types';

const reducer = (state: IAuthStoreState, action: StoreAction): IAuthStoreState => {
	switch (action.type) {
		default:
			return state;
	}
};

export const useAuthStore = create(devtools(redux(reducer, {})));
