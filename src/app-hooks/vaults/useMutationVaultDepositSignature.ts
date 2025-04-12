import { VaultApi, VaultDepositParams, VaultDepositSignature } from '@/app-services/api';
import { useMutation } from '@tanstack/react-query';

const useMutationVaultDepositSignature = (options?: {
	onSuccess?: (data: VaultDepositSignature) => void;
	onError?: (error: Error) => void;
}) => {
	return useMutation({
		mutationKey: ['mutation-vault-deposit-signature'],
		onError: options?.onError,
		onSuccess: options?.onSuccess,
		mutationFn: async ({ amount, vaultId }: VaultDepositParams) => {
			return VaultApi.getVaultDepositSignature({
				amount,
				vaultId,
			});
		},
	});
};

export default useMutationVaultDepositSignature;
