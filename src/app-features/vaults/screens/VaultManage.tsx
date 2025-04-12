'use client';
import { PageContainer } from '@/app-components/layout/PageContainer';
import Link from 'next/link';
import { Breadcrumb, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';

interface VaultManageProps {
	address: string;
}

const VaultManage: React.FC<VaultManageProps> = ({ address }) => {
	return (
		<PageContainer>
			<Container className="py-5">
				<Breadcrumb>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Item href="/vault-detail/Vault-ABC">Vault-ABC</Breadcrumb.Item>
					<Breadcrumb.Item active>Manage</Breadcrumb.Item>
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
						<Link href="/vault-manage/Vault-ABC" className="btn btn-outline-primary">
							Back to Details
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
			</Container>
			<Container fluid className="pb-5">
				<Card className="border-0 bg-light">
					<Card.Body className="">
						<Row className="g-3">
							<Col md="3">
								<ListGroup defaultActiveKey="#link1">
									<ListGroup.Item action href="#link1">
										Aave
									</ListGroup.Item>
									<ListGroup.Item action href="#link2">
										Venus
									</ListGroup.Item>
									<ListGroup.Item action href="#link3">
										Drift
									</ListGroup.Item>
									<ListGroup.Item action href="#link4">
										Hhyperliquid
									</ListGroup.Item>
								</ListGroup>
								<h6 className="mt-3 ps-2 border-start border-3">
									<span className="opacity-25 ">Protocols List</span>
								</h6>
							</Col>
							<Col>
								<div className="rounded overflow-hidden">
									<iframe
										src="https://app.aave.com/staking/"
										className="w-100 border-0 d-block"
										height={600}
									/>
								</div>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</Container>
		</PageContainer>
	);
};

export default VaultManage;
