'use client';

import { ExpandableDescription } from '@/app-components/common/ExpandableDescription';
import { PageContainer } from '@/app-components/layout/PageContainer';
import { areAddressesEqual, getShortAddress } from '@/app-helpers/address';
import { formatCurrency } from '@/app-helpers/number';
import { useQueryVaultDetails } from '@/app-hooks/vaults';
import { useQueryVaultProtocol } from '@/app-hooks/vaults/useQueryVaultProtocol';
import Link from 'next/link';
import { Breadcrumb, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useActiveAccount } from 'thirdweb/react';
import DepositCard from '../components/DepositCard';

interface VaultDetailsProps {
	address: string;
}

const VaultDetails: React.FC<VaultDetailsProps> = ({ address }) => {
	const account = useActiveAccount();

	const { data: vault, isLoading } = useQueryVaultDetails({
		contractAddress: address,
	});

	const { data: vaultProtocol } = useQueryVaultProtocol(
		{
			vaultId: vault?.id,
		},
		{
			enabled: !!vault?.id,
			networkMode: 'offlineFirst',
		},
	);

	const isVaultCreator = () => {
		if (!vault || !account) return false;
		return areAddressesEqual(account.address, vault.creator.address);
	};

	if (!vault || isLoading) {
		return (
			<div
				className="w-full d-flex justify-content-center align-items-center"
				style={{ height: '100dvh' }}
			>
				<Spinner style={{ borderWidth: '2px' }} />
			</div>
		);
	}

	return (
		<PageContainer>
			<Container className="py-5">
				<Breadcrumb>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Item active>{vault.name}</Breadcrumb.Item>
				</Breadcrumb>
				<Row className="mb-4">
					<Col>
						<h1>{vault.name}</h1>
						<div>
							<span>Created by {getShortAddress(vault.creator.address)}</span> •{' '}
							<span className="badge bg-success">Deposits open</span>
						</div>
					</Col>
					<Col xs="auto">
						{isVaultCreator() ? (
							<Link href={`/vault/${address}/manage`} className="btn btn-outline-primary">
								Manage Vault
							</Link>
						) : null}
					</Col>
				</Row>
				<Row className="overall g-3">
					<Col>
						<div className="bg-light p-3">
							<div className="small text-secondary">TVL</div>
							<div className="fs-5 fw-medium">{formatCurrency(vault.totalLock)}</div>
						</div>
					</Col>
					<Col>
						<div className="bg-light p-3">
							<div className="small text-secondary">PnL</div>
							<div className="fs-5 fw-medium">{formatCurrency(vault.allTimePnl)}</div>
						</div>
					</Col>
					<Col>
						<div className="bg-light p-3">
							<div className="small text-secondary">Your Deposit</div>
							<div className="fs-5 fw-medium">
								{vault.yourDeposit ? formatCurrency(vault.yourDeposit) : '-'}
							</div>
						</div>
					</Col>
					<Col>
						<div className="bg-light p-3">
							<div className="small text-secondary">Your PnL</div>
							<div className="fs-5 fw-medium">
								{vault.yourPnl ? formatCurrency(vault.yourPnl) : '-'}
							</div>
						</div>
					</Col>
				</Row>
				<Row className="g-4 mt-5">
					<Col>
						<Card>
							<Card.Header>
								<Card.Title>Information</Card.Title>
							</Card.Header>
							<Card.Body>
								<dl className="row gy-1">
									<dt className="col-sm-3">Name:</dt>
									<dd className="col-sm-9">{vault.name}</dd>

									<dt className="col-sm-3">Protocol:</dt>
									<dd className="col-sm-9">{vaultProtocol?.name}</dd>

									<dt className="col-sm-3">Token:</dt>
									<dd className="col-sm-9">{vault.token.symbol}</dd>

									<dt className="col-sm-3">Network:</dt>
									<dd className="col-sm-9">{vault.chain.name}</dd>

									<dt className="col-sm-12">Description:</dt>
									<dd className="col-sm-12">
										<ExpandableDescription
											id="vault-description"
											text={vault.description ?? ''}
											more={'View more'}
											less={'View less'}
											className="small text-secondary"
											anchorClass="d-inline-block link-primary cursor-pointer"
										/>
									</dd>
								</dl>
							</Card.Body>
						</Card>
					</Col>
					<Col md="4">
						<DepositCard vault={vault} />
					</Col>
				</Row>
			</Container>
		</PageContainer>
	);
};

export default VaultDetails;
