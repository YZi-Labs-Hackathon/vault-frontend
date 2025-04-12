'use client';
import { getShortAddress } from '@/app-helpers/address';
import { Button } from 'react-bootstrap';
import {
	useActiveAccount,
	useActiveWallet,
	useActiveWalletChain,
	useActiveWalletConnectionStatus,
	useAutoConnect,
	useWalletDetailsModal,
} from 'thirdweb/react';
import { AUTO_CONNECT_TIMEOUT, CHAIN, twClient } from '../tw-context';
import { useWeb3Wallet } from '../tw-provider';

interface ConnectButtonProps {}

export const ConnectButton: React.FC<ConnectButtonProps> = () => {
	const { connect, isConnecting } = useWeb3Wallet();

	const status = useActiveWalletConnectionStatus();
	const activeChain = useActiveWalletChain();
	const activeWallet = useActiveWallet();
	const account = useActiveAccount();
	const { open } = useWalletDetailsModal();

	const { isPending: isAutoConnecting } = useAutoConnect({
		client: twClient,
		timeout: AUTO_CONNECT_TIMEOUT,
	});

	const isConnectBtnLoading =
		isConnecting || isAutoConnecting || status === 'connecting' || status === 'unknown';

	const onSwitchChain = async () => {
		try {
			if (!activeWallet) return;
			await activeWallet.switchChain(CHAIN);
		} catch (e) {}
	};

	const onOpenWalletDetailsModal = async () => {
		try {
			await open({
				client: twClient,
				hideBuyFunds: true,
				showBalanceInFiat: 'USD',
				hideSwitchWallet: true,
				locale: 'en_US',
				chains: [CHAIN],
				theme: 'light',
			});
		} catch (e) {}
	};

	const isChainCompatible = () => {
		if (!activeChain) {
			return false;
		}
		return activeChain.id === CHAIN.id;
	};

	const ConnectButtonUI = (
		<Button onClick={connect} disabled={isConnectBtnLoading}>
			<span>Connect Wallet</span>
		</Button>
	);

	const SwitchChainButton = (
		<Button onClick={onSwitchChain} disabled={isConnectBtnLoading}>
			<span>Switch to {CHAIN.name}</span>
		</Button>
	);

	const ConnectedButton = (
		<Button onClick={onOpenWalletDetailsModal}>
			<span>{getShortAddress(account?.address ?? '')}</span>
		</Button>
	);

	return (
		<>
			{/** Status is not connected */}
			{(status === 'disconnected' || status === 'unknown' || status === 'connecting') &&
				ConnectButtonUI}

			{/** Status is connected but chain is not correct */}
			{status === 'connected' && !isChainCompatible() && SwitchChainButton}

			{/** Status is connected and chain is correct */}
			{status === 'connected' && isChainCompatible() && ConnectedButton}
		</>
	);
};
