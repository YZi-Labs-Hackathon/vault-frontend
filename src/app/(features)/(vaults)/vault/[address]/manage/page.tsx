'use client';
import { NoSsrLayout } from '@/app-components/layout/NoSsrLayout';
import VaultManage from '@/app-features/vaults/screens/VaultManage';
import { useParams } from 'next/navigation';

export default function VaultManagePage() {
	const { address } = useParams<{ address: string }>();
	return (
		<NoSsrLayout>
			<VaultManage address={address} />
		</NoSsrLayout>
	);
}
