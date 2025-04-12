import { VaultApi } from '@/app-services/api';
import { useMutation } from '@tanstack/react-query';

export const useMutationSyncCreateVaultTransaction = (options?: {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}) => {
	return useMutation({
		mutationKey: ['mutation-vault-sync-create-vault-transaction'],
		onError: options?.onError,
		onSuccess: options?.onSuccess,
		mutationFn: async ({
			chainId,
			txHash,
		}: {
			chainId: number | string;
			txHash: string;
		}) => {
			await VaultApi.syncCreateVaultTransaction(Number(chainId), txHash);
		},
	});
};
