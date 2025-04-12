import { useAuthStore } from './auth-store';

export const useAuthStoreDispatcher = () =>
	useAuthStore((state) => {
		return state.dispatch;
	});
