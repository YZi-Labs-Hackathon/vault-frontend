import { get } from '@/app-helpers/misc';
import { ApiResponse } from '@/app-types/common';
import { Vault, VaultListItem, VaultProtocol } from '@/app-types/vault';
import { isNil, omitBy } from 'lodash';
import { axiosAPI } from './transport';
import {
	GetVaultDetailsParams,
	GetVaultProtocolsParams,
	GetVaultsFilterParams,
} from './vault-api.types';

class VaultApiService {
	async getVaultsPublic(filter?: GetVaultsFilterParams) {
		const response = await axiosAPI.get<ApiResponse<VaultListItem[]>>(
			'/api/vault/public',
			{
				params: omitBy(filter || {}, isNil),
				skip_auth: true,
			},
		);
		return get(response, (d) => d.data.data, []) as VaultListItem[];
	}

	async getVaultsWithAuth(filter?: GetVaultsFilterParams) {
		const response = await axiosAPI.get<ApiResponse<VaultListItem[]>>('/api/vault/list', {
			params: omitBy(filter || {}, isNil),
		});
		return get(response, (d) => d.data.data, []) as VaultListItem[];
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
}

export const VaultApi = new VaultApiService();
