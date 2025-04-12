'use client';

import { ExpandableDescription } from '@/app-components/common/ExpandableDescription';
import { PageContainer } from '@/app-components/layout/PageContainer';
import { getShortAddress } from '@/app-helpers/address';
import { formatCurrency } from '@/app-helpers/number';
import { useQueryVaultDetails } from '@/app-hooks/vaults';
import { useQueryVaultProtocol } from '@/app-hooks/vaults/useQueryVaultProtocol';
import Link from 'next/link';
import { useState } from 'react';
import {
	Breadcrumb,
	Button,
	Card,
	Col,
	Container,
	Form,
	InputGroup,
	Modal,
	Row,
	Spinner,
} from 'react-bootstrap';

interface VaultDetailsProps {
	address: string;
}

const VaultDetails: React.FC<VaultDetailsProps> = ({ address }) => {
	const [show, setShow] = useState(false);

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
						<Link href={`/vault/${address}/manage`} className="btn btn-outline-primary">
							Manage Vault
						</Link>
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
						<Card>
							<Card.Header>
								<Card.Title>Deposit</Card.Title>
							</Card.Header>
							<Card.Body>
								<Form.Group className="mb-4">
									<Form.Label>Amount</Form.Label>
									<InputGroup size="lg" className="mb-3">
										<Form.Control type="number" defaultValue={10} placeholder="0" />
										<InputGroup.Text>USDC</InputGroup.Text>
									</InputGroup>
								</Form.Group>
								<Button className="w-100" size="lg" onClick={() => setShow(true)}>
									Deposit
								</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>

			<Modal show={show} onHide={() => setShow(false)} centered>
				<Modal.Header closeButton className="border-0 pb-0" />
				<Modal.Body className="text-center">
					<div className="display-3">✔</div>
					<h4>Deposit successful</h4>
					<p className="mb-4">
						Please wait a few minutes for the funds to appear in the vault.
					</p>
					<div className="mb-3">
						<Button variant="outline-primary" className="px-5">
							Got it!
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</PageContainer>
	);
};

export default VaultDetails;
