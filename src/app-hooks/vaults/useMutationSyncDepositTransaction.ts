import { VaultApi } from '@/app-services/api';
import { useMutation } from '@tanstack/react-query';

const useMutationSyncDepositTransaction = (options?: {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}) => {
	return useMutation({
		mutationKey: ['mutation-vault-sync-deposit-transaction'],
		onError: options?.onError,
		onSuccess: options?.onSuccess,
		mutationFn: async ({
			vaultAddress,
			txHash,
		}: {
			vaultAddress: string;
			txHash: string;
		}) => {
			await VaultApi.syncDepositTransaction(vaultAddress, txHash);
		},
	});
};

export default useMutationSyncDepositTransaction;
