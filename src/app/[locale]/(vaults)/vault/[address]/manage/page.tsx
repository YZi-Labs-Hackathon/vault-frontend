import VaultManage from '@/app-features/vaults/screens/VaultManage';
import { ServerPropsWithLocale } from '@/app-types/common';

export default async function VaultManagePage({
	params,
}: ServerPropsWithLocale<{}, { address: string }>) {
	const { address } = await params;
	return <VaultManage address={address} />;
}
