import { getSignerFromAccount } from '@/app-contexts/thirdweb';
import { EVMVault__factory } from '@/app-typechains';
import { useMutation } from '@tanstack/react-query';
import { useActiveAccount } from 'thirdweb/react';
import { z } from 'zod';
import { useMutationSyncDepositTransaction } from './useMutationSyncDepositTransaction';
import useMutationVaultDepositSignature from './useMutationVaultDepositSignature';

const zUseVaultDepositParams = z.object({
	vaultAddress: z.string(),
	depositParams: z.object({
		amount: z.string(),
		receiver: z.string(),
		vaultId: z.string(),
	}),
});

export type UseVaultDepositParams = z.infer<typeof zUseVaultDepositParams>;

export const useMutationVaultDeposit = () => {
	const { mutateAsync: getDepositSig } = useMutationVaultDepositSignature();
	const { mutateAsync: syncTransaction } = useMutationSyncDepositTransaction();
	const account = useActiveAccount();

	return useMutation({
		mutationKey: ['mutation-vault-deposit'],
		mutationFn: async (params: UseVaultDepositParams) => {
			if (!account) {
				throw new Error('No active account found');
			}

			const zresult = zUseVaultDepositParams.safeParse(params);
			if (!zresult.success) {
				throw new Error(`Invalid deposit parameters: ${zresult.error.message}`);
			}

			const depositSignature = await getDepositSig({
				amount: params.depositParams.amount,
				vaultId: params.depositParams.vaultId,
			});
			const signer = await getSignerFromAccount(account);
			const vaultContract = EVMVault__factory.connect(params.vaultAddress, signer);
			const { signature, vaultParam } = depositSignature;
			const { amount, userAddress, vaultTvl } = vaultParam;

			const tx = await vaultContract.deposit(
				amount,
				userAddress,
				vaultTvl,
				signature.deadline,
				signature.signature,
			);
			const receipt = await tx.wait();
			const txHash = receipt.transactionHash;

			if (!txHash) {
				throw new Error('Transaction hash not found');
			}

			syncTransaction({
				vaultAddress: params.vaultAddress,
				txHash,
			});
			return txHash;
		},
	});
};
