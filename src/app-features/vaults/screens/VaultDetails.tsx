'use client';

import { PageContainer } from '@/app-components/layout/PageContainer';
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
} from 'react-bootstrap';

interface VaultDetailsProps {
	address: string;
}

const VaultDetails: React.FC<VaultDetailsProps> = ({ address }) => {
	const [myVault, setMyVault] = useState(true);
	const [show, setShow] = useState(false);

	return (
		<PageContainer>
			<Container className="py-5">
				<Breadcrumb>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Item active>Vault-ABC</Breadcrumb.Item>
				</Breadcrumb>
				<Row className="mb-4">
					<Col>
						<h1>NX Finance JLP Delta Neutral Vaul</h1>
						<div>
							<span>Created by 0x0000...0000</span> •{' '}
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
							<div className="small text-secondary">TVL / Max Capacity</div>
							<div className="fs-5 fw-medium">$56.1M / $100M</div>
						</div>
					</Col>
					<Col>
						<div className="bg-light p-3">
							<div className="small text-secondary">Vault PNL</div>
							<div className="fs-5 fw-medium">$12.33</div>
						</div>
					</Col>
					<Col>
						<div className="bg-light p-3">
							<div className="small text-secondary">your deposit</div>
							<div className="fs-5 fw-medium">$1,231.55</div>
						</div>
					</Col>
					<Col>
						<div className="bg-light p-3">
							<div className="small text-secondary">Your PNL</div>
							<div className="fs-5 fw-medium">$23.55</div>
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
									<dd className="col-sm-9">NX Finance JLP Delta Neutral Vaul</dd>
									<dt className="col-sm-3">Protocol:</dt>
									<dd className="col-sm-9">Venus, Aave, Drift</dd>
									<dt className="col-sm-3">Token:</dt>
									<dd className="col-sm-9">USDC</dd>
									<dt className="col-sm-3">Network:</dt>
									<dd className="col-sm-9">BNB Smart Chain</dd>
									<dt className="col-sm-3">Description:</dt>
									<dd className="col-sm-9">
										An AI-driven vault that responds to real-time market changes:
										<ul>
											<li>Staking take place within the Venus protocol.</li>
											<li>
												Adaptive Strategy: Uses advanced algorithms to optimize
												performance, automatically adjusting staking allocations based on
												market signals.
											</li>
											<li>
												Balance of Security & Growth: Prioritizes capital preservation
												while aiming for above-average yields in varying market
												conditions.
											</li>
										</ul>
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
									<Form.Label>Amout</Form.Label>
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
