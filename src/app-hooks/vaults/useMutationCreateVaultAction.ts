import {
	CreateVaultActionData,
	CreateVaultActionParams,
	VaultApi,
} from '@/app-services/api';
import { useMutation } from '@tanstack/react-query';

const useMutationCreateVaultAction = (options?: {
	onSuccess?: (data: CreateVaultActionData) => void;
	onError?: (error: Error) => void;
}) => {
	return useMutation({
		mutationKey: ['mutation-create-vault-action'],
		onError: options?.onError,
		onSuccess: options?.onSuccess,
		mutationFn: async (params: CreateVaultActionParams) => {
			return VaultApi.createVaultAction(params);
		},
	});
};

export default useMutationCreateVaultAction;
