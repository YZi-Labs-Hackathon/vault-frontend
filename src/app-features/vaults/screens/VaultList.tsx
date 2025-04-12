'use client';
import { PageContainer } from '@/app-components/layout/PageContainer';
import { Container } from 'react-bootstrap';
import VaultTable from '../components/VaultTable';

export default function VaultList() {
	return (
		<PageContainer>
			<Container className="py-5">
				<h1 className="pb-4">All Vaults</h1>
				<VaultTable />
			</Container>
		</PageContainer>
	);
}
