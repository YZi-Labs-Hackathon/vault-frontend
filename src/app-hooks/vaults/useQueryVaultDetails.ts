import { useAuthContext } from '@/app-contexts/auth';
import { serializeSessionToQueryKey, serializeToQueryKey } from '@/app-helpers/misc';
import { GetVaultDetailsParams, VaultApi } from '@/app-services/api';
import { useQuery } from '@tanstack/react-query';

export const useQueryVaultDetails = (
	filter?: GetVaultDetailsParams,
	options?: {
		enabled?: boolean;
	},
) => {
	const { session } = useAuthContext();

	const getVaultDetails = async () => {
		if (session) {
			return await VaultApi.getVaultDetailsWithAuth(filter);
		} else {
			return await VaultApi.getVaultDetailsPublic(filter);
		}
	};

	return useQuery({
		queryKey: [
			...serializeToQueryKey('query-vault-details', filter ?? {}),
			...serializeSessionToQueryKey(session),
		],
		queryFn: getVaultDetails,
		enabled: options?.enabled ?? true,
	});
};
