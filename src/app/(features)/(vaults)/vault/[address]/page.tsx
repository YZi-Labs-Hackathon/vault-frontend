'use client';
import { NoSsrLayout } from '@/app-components/layout/NoSsrLayout';
import VaultDetails from '@/app-features/vaults/screens/VaultDetails';
import { useParams } from 'next/navigation';

export default function VaultDetailPage() {
	const { address } = useParams<{ address: string }>();
	return (
		<NoSsrLayout>
			<VaultDetails address={address} />
		</NoSsrLayout>
	);
}
