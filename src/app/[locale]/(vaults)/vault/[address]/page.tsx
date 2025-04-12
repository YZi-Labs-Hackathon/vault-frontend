import VaultDetails from '@/app-features/vaults/screens/VaultDetails';
import { ServerPropsWithLocale } from '@/app-types/common';

export default async function VaultDetailPage({
	params,
}: ServerPropsWithLocale<{}, { address: string }>) {
	const { address } = await params;
	return <VaultDetails address={address} />;
}
