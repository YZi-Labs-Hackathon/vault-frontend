'use client';
import { PageContainer } from '@/app-components/layout/PageContainer';
import { getShortAddress } from '@/app-helpers/address';
import { get } from '@/app-helpers/misc';
import { formatCurrency } from '@/app-helpers/number';
import { useQueryVaultDetails } from '@/app-hooks/vaults';
import { useQueryVaultProtocol } from '@/app-hooks/vaults/useQueryVaultProtocol';
import { VaultProtocolService } from '@/app-types/vault';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import {
	Breadcrumb,
	Card,
	Col,
	Container,
	ListGroup,
	Row,
	Spinner,
} from 'react-bootstrap';

interface VaultManageProps {
	address: string;
}

const VaultManage: React.FC<VaultManageProps> = ({ address }) => {
	const iframeRef = useRef<HTMLIFrameElement>(null);

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

	const getIframeUrl = () => {
		if (!vaultProtocol || !vault) return '';
		const service = vaultProtocol.service;
		if (service === VaultProtocolService.venus) {
			return `https://app.venus.io/#/?chainId=${Number(vault.chainId)}`;
		} else if (service === VaultProtocolService.aave) {
			return `https://app.aave.com/`;
		} else if (service === VaultProtocolService.pancake) {
			return `https://pancakeswap.finance/swap`;
		} else if (service === VaultProtocolService.apex) {
			return `https://omni.apex.exchange/trade/BTCUSDT`;
		}
		return '';
	};

	const handleEthereumMessage = async (event: MessageEvent) => {
		const type = event.data.type;
		const contentWindow = iframeRef.current?.contentWindow!;
		if (type === 'eth_requestAccounts') {
			contentWindow.postMessage(
				{
					type: 'eth_requestAccounts_response',
					result: [address],
					transactionId: event.data.transactionId ?? '',
				},
				'*',
			);
		} else if (type === 'eth_accounts') {
			contentWindow.postMessage(
				{
					type: 'eth_accounts_response',
					result: [address],
					transactionId: event.data.transactionId ?? '',
				},
				'*',
			);
		}
	};

	useEffect(() => {
		const handleMessage = async (event: MessageEvent) => {
			if (iframeRef.current && iframeRef.current.contentWindow) {
				handleEthereumMessage(event);
			}
		};

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, []);

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

	const serviceIframeUrl = getIframeUrl();

	return (
		<PageContainer>
			<Container className="py-5">
				<Breadcrumb>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Item href={`/vault/${address}`}>{vault.name}</Breadcrumb.Item>
					<Breadcrumb.Item active>Manage</Breadcrumb.Item>
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
						<Link href={`/vault/${address}`} className="btn btn-outline-primary">
							Back to Details
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
							<div className="small text-secondary">Your PNL</div>
							<div className="fs-5 fw-medium">
								{vault.yourPnl ? formatCurrency(vault.yourPnl) : '-'}
							</div>
						</div>
					</Col>
				</Row>
			</Container>
			<Container fluid className="pb-5">
				<Card className="border-0 bg-light">
					<Card.Body className="">
						<Row className="g-3">
							{/* <Col md="3">
								<ListGroup defaultActiveKey="#link1">
									<ListGroup.Item action href="#link2">
										Venus
									</ListGroup.Item>
								</ListGroup>
								<h6 className="mt-3 ps-2 border-start border-3">
									<span className="opacity-25 ">Protocols List</span>
								</h6>
							</Col> */}
							<Col>
								<div className="rounded overflow-hidden">
									{serviceIframeUrl ? (
										<iframe
											ref={iframeRef}
											src={serviceIframeUrl}
											className="w-100 border-0 d-block"
											height={600}
										/>
									) : null}
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
