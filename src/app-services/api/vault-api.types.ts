import { ProtocolType } from '@/app-constants/blockchain';

export interface GetVaultsFilterParams {
	name?: string;
	chainId?: string;
	tokenId?: string;
	creatorId?: string;
	page?: number;
	limit?: number;
	filterStatus?: string;
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
