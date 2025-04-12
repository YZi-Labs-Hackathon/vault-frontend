import { get } from '@/app-helpers/misc';
import { GetVaultProtocolsParams, VaultApi } from '@/app-services/api';
import { VaultProtocol } from '@/app-types/vault';
import { NetworkMode, useQuery } from '@tanstack/react-query';

export const useQueryVaultProtocol = (
	filter?: GetVaultProtocolsParams,
	options?: {
		enabled?: boolean;
		networkMode?: NetworkMode;
	},
) => {
	const getVaultProtocol = async (): Promise<VaultProtocol> => {
		const protocols = await VaultApi.getVaultProtocols(filter);
		console.debug('protocols', protocols);
		return get(protocols, (d) => d[0], {} as VaultProtocol) as VaultProtocol;
	};

	return useQuery({
		queryKey: ['query-vault-protocols', filter],
		queryFn: getVaultProtocol,
		enabled: options?.enabled,
		networkMode: options?.networkMode,
	});
};
