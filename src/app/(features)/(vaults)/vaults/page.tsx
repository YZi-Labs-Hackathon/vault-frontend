'use client';
import { NoSsrLayout } from '@/app-components/layout/NoSsrLayout';
import VaultList from '@/app-features/vaults/screens/VaultList';

export default function VaultListPage() {
	return (
		<NoSsrLayout>
			<VaultList />
		</NoSsrLayout>
	);
}
