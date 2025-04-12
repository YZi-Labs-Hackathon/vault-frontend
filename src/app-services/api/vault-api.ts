import { get } from '@/app-helpers/misc';
import { ApiResponse } from '@/app-types/common';
import { VaultListItem } from '@/app-types/vault';
import { isNil, omitBy } from 'lodash';
import { axiosAPI } from './transport';
import { GetVaultsFilterParams } from './vault-api.types';

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
}

export const VaultApi = new VaultApiService();
