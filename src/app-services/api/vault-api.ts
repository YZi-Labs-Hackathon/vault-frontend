import { get } from '@/app-helpers/misc';
import { ApiResponse, Paginate } from '@/app-types/common';
import { Vault, VaultListItem, VaultProtocol } from '@/app-types/vault';
import { isNil, omitBy } from 'lodash';
import { axiosAPI } from './transport';
import {
	CreateVaultActionData,
	CreateVaultActionParams,
	GetVaultDetailsParams,
	GetVaultProtocolsParams,
	GetVaultsFilterParams,
	VaultDepositParams,
	VaultDepositSignature,
} from './vault-api.types';

class VaultApiService {
	async getVaultsPublic(filter?: GetVaultsFilterParams) {
		const response = await axiosAPI.get<ApiResponse<Paginate<VaultListItem>>>(
			'/api/vault/public',
			{
				params: omitBy(filter || {}, isNil),
				skip_auth: true,
			},
		);
		return get(
			response,
			(d) => d.data.data,
			{} as Paginate<VaultListItem>,
		) as Paginate<VaultListItem>;
	}

	async getVaultsWithAuth(filter?: GetVaultsFilterParams) {
		const response = await axiosAPI.get<ApiResponse<Paginate<VaultListItem>>>(
			'/api/vault/list',
			{
				params: omitBy(filter || {}, isNil),
			},
		);
		return get(
			response,
			(d) => d.data.data,
			{} as Paginate<VaultListItem>,
		) as Paginate<VaultListItem>;
	}

	async getVaultDetailsPublic(filter?: GetVaultDetailsParams) {
		const response = await axiosAPI.get<ApiResponse<Vault>>('/api/vault/detail/public', {
			params: omitBy(filter || {}, isNil),
			skip_auth: true,
		});
		return get(response, (d) => d.data.data, {} as Vault) as Vault;
	}

	async getVaultDetailsWithAuth(filter?: GetVaultDetailsParams) {
		const response = await axiosAPI.get<ApiResponse<Vault>>('/api/vault/detail', {
			params: omitBy(filter || {}, isNil),
		});
		return get(response, (d) => d.data.data, {} as Vault) as Vault;
	}

	async getVaultProtocols(filter?: GetVaultProtocolsParams) {
		const response = await axiosAPI.get<ApiResponse<VaultProtocol[]>>('/api/protocol', {
			params: omitBy(filter, isNil),
			skip_auth: true,
		});
		return get(response, (d) => d.data.data, []) as VaultProtocol[];
	}

	public async getVaultDepositSignature(
		params: VaultDepositParams,
	): Promise<VaultDepositSignature> {
		const response = await axiosAPI.post<ApiResponse<VaultDepositSignature>>(
			'/api/vault/depositor/deposit',
			params,
		);
		return get(
			response,
			(d) => d.data.data,
			{} as VaultDepositSignature,
		) as VaultDepositSignature;
	}

	public async syncDepositTransaction(vaultAddress: string, txHash: string) {
		await axiosAPI.post(`/api/webhook/deposit/${vaultAddress}/${txHash}`);
	}

	public async syncWithdrawalTransaction(vaultAddress: string, txHash: string) {
		await axiosAPI.post(`/api/webhook/withdraw/${vaultAddress}/${txHash}`);
	}

	public async syncCreateVaultTransaction(chainId: number, txHash: string) {
		await axiosAPI.post(`/api/webhook/create-vault/${chainId}/${txHash}`);
	}

	public async createVaultAction(params: CreateVaultActionParams) {
		const response = await axiosAPI.post<ApiResponse<CreateVaultActionData>>(
			'/api/vault/action',
			params,
		);
		return get(
			response,
			(d) => d.data.data,
			{} as CreateVaultActionData,
		) as CreateVaultActionData;
	}
}

export const VaultApi = new VaultApiService();
