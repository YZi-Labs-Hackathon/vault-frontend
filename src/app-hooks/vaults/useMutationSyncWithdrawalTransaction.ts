import { VaultApi } from '@/app-services/api';
import { useMutation } from '@tanstack/react-query';

export const useMutationSyncWithdrawalTransaction = (options?: {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}) => {
	return useMutation({
		mutationKey: ['mutation-vault-sync-withdrawal-transaction'],
		onError: options?.onError,
		onSuccess: options?.onSuccess,
		mutationFn: async ({
			vaultAddress,
			txHash,
		}: {
			vaultAddress: string;
			txHash: string;
		}) => {
			await VaultApi.syncWithdrawalTransaction(vaultAddress, txHash);
		},
	});
};
