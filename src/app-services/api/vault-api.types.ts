import { ProtocolType } from '@/app-constants/blockchain';

export interface GetVaultsFilterParams {
	name?: string;
	chainId?: string;
	tokenId?: string;
	creatorId?: string;
	page?: number;
	limit?: number;
	filterStatus?: string;
	services?: string;
}

export interface GetVaultDetailsParams {
	vaultId?: string;
	contractAddress?: string;
}

export interface GetVaultProtocolsParams {
	protocol?: ProtocolType;
	id?: string;
	vaultId?: string;
	name?: string;
}

export interface VaultDepositParams {
	amount: string;
	vaultId: string;
}

export interface VaultDepositSignatureParams {
	amount: string;
	userAddress: string;
	vaultTvl: string;
}

export interface VaultDepositSignatureSignature {
	deadline: string;
	signature: string;
}
export interface VaultDepositSignature {
	vaultParam: VaultDepositSignatureParams;
	signature: VaultDepositSignatureSignature;
}

export interface CreateVaultActionParams {
	service: string;
	to: string;
	dataRaw: string;
	vaultAddress: string;
}

export interface CreateVaultActionData {
	targets: string[];
	data: string[];
	deadline: string;
	signature: string;
}
