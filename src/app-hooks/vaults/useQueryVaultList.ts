import { useAuthContext } from '@/app-contexts/auth';
import { serializeSessionToQueryKey, serializeToQueryKey } from '@/app-helpers/misc';
import { GetVaultsFilterParams, VaultApi } from '@/app-services/api';
import { useQuery } from '@tanstack/react-query';

export const useQueryVaultList = (filter?: GetVaultsFilterParams) => {
	const { session } = useAuthContext();

	const getVaults = async () => {
		if (session) {
			return await VaultApi.getVaultsWithAuth(filter);
		} else {
			return await VaultApi.getVaultsPublic(filter);
		}
	};

	return useQuery({
		queryKey: [
			...serializeToQueryKey('query-vault-list', filter ?? {}),
			...serializeSessionToQueryKey(session),
		],
		queryFn: getVaults,
	});
};
