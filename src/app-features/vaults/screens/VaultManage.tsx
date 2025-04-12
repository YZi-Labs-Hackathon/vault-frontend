'use client';
import { PageContainer } from '@/app-components/layout/PageContainer';
import { getSignerFromAccount } from '@/app-contexts/thirdweb';
import ChatWidget from '@/app-features/ai-agent/components/ChatWidget';
import { areAddressesEqual, getShortAddress } from '@/app-helpers/address';
import { getErrorMessage } from '@/app-helpers/errors';
import { get } from '@/app-helpers/misc';
import { formatCurrency } from '@/app-helpers/number';
import { useQueryVaultDetails } from '@/app-hooks/vaults';
import useMutationCreateVaultAction from '@/app-hooks/vaults/useMutationCreateVaultAction';
import { useQueryVaultProtocol } from '@/app-hooks/vaults/useQueryVaultProtocol';
import { EVMVault__factory } from '@/app-typechains';
import { VaultProtocolService } from '@/app-types/vault';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Breadcrumb, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useActiveAccount } from 'thirdweb/react';

interface VaultManageProps {
	address: string;
}

const SAMPLE_VAULT_ACTION = {
	targets: ['0xfD36E2c2a6789Db23113685031d7F16329158384'],
	data: [
		'0xc299823800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000fd5840cd36d94d7229439859c0112a4185bc0255',
	],
	deadline: 1744341802,
	signature:
		'0x2af09f53f883fa492833569c0e7a3c5e8fafaf523d6a0fc4f447fa426a1bbb0f7587c9955e048e25dc0ab8cbbb70b600791918c51efd5339bd4f920cf2c827ea1c',
};

const VaultManage: React.FC<VaultManageProps> = ({ address }) => {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const account = useActiveAccount();
	const router = useRouter();
	const { mutateAsync: createVaultAction } = useMutationCreateVaultAction();

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

	const doVaultAction = async ({ to, data }: { to: string; data: string }) => {
		if (!to || !data) {
			throw new Error('Could not send transaction. Missing parameters!');
		}

		if (!account) {
			throw new Error('Please connect to your wallet first');
		}

		if (!vault) {
			throw new Error('Not found vault information');
		}

		const {
			targets,
			data: targetData,
			deadline,
			signature,
		} = await createVaultAction({
			vaultAddress: vault.contractAddress,
			dataRaw: data,
			to: to,
			service: vaultProtocol?.service ?? VaultProtocolService.venus,
		});

		// const { targets, data: targetData, deadline, signature } = SAMPLE_VAULT_ACTION;

		const signer = await getSignerFromAccount(account);
		const vaultContract = EVMVault__factory.connect(vault.contractAddress, signer);
		const tx = await vaultContract.execute(targets, targetData, deadline, signature);
		await tx.wait();

		return tx.hash;
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
		} else if (type === 'eth_sendTransaction') {
			try {
				const { to, data } = get(event, (d) => d.data.params[0], {});
				const txHash = await doVaultAction({
					to: to,
					data: data,
				});
				contentWindow.postMessage(
					{
						type: 'eth_sendTransaction_response',
						result: txHash,
						transactionId: event.data.transactionId ?? '',
					},
					'*',
				);
			} catch (e) {
				const error = getErrorMessage(e);
				toast.error(error, {
					autoClose: 3000,
				});
				contentWindow.postMessage(
					{
						type: 'eth_sendTransaction_response',
						error: error,
						transactionId: event.data.transactionId ?? '',
					},
					'*',
				);
			}
		}
	};

	useEffect(() => {
		if (!account || !vault || !vaultProtocol) return;

		const handleMessage = async (event: MessageEvent) => {
			if (iframeRef.current && iframeRef.current.contentWindow) {
				handleEthereumMessage(event);
			}
		};

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, [account, vault, vaultProtocol]);

	useEffect(() => {
		if (!vault || !account) return;

		if (!areAddressesEqual(account.address, vault.creator.address)) {
			router.back();
		}
	}, [vault, account]);

	if (!vault) {
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

			<ChatWidget vaultId={vault.id} />
		</PageContainer>
	);
};

export default VaultManage;
