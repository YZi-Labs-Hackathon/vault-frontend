'use client';
import { useContext } from 'react';
import {
	ThirdwebProvider,
	useActiveAccount,
	useActiveWallet,
	useActiveWalletConnectionStatus,
	useConnectModal,
	useDisconnect,
} from 'thirdweb/react';
import { APP_CHAINS, CHAIN, twClient, TWContext, WALLETS } from './tw-context';

export interface TWProviderProps {
	children: React.ReactNode;
}

export const TWProvider = ({ children }: TWProviderProps) => {
	return (
		<ThirdwebProvider>
			<TWProviderInner>{children}</TWProviderInner>
		</ThirdwebProvider>
	);
};

export const TWProviderInner = ({ children }: TWProviderProps) => {
	const { connect: openConnectModal, isConnecting } = useConnectModal();
	const { disconnect } = useDisconnect();
	const status = useActiveWalletConnectionStatus();
	const wallet = useActiveWallet();
	const account = useActiveAccount();

	const connect = async () => {
		try {
			await openConnectModal({
				client: twClient,
				chains: APP_CHAINS,
				chain: CHAIN,
				locale: 'en_US',
				theme: 'light',
				wallets: WALLETS,
				recommendedWallets: [WALLETS[0], WALLETS[1]],
				size: 'compact',
				showThirdwebBranding: false,
				showAllWallets: false,
				appMetadata: {
					name: 'Partnr Vaults',
				},
				walletConnect: {
					projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_CLIENT_ID,
				},
			});
		} catch (e) {}
	};

	return (
		<TWContext.Provider
			value={{
				connect,
				disconnect: async () => wallet && disconnect(wallet),
				isConnecting,
				address: account?.address,
				account,
				wallet,
				connectionStatus: status,
			}}
		>
			{children}
		</TWContext.Provider>
	);
};

export const useWeb3Wallet = () => {
	const context = useContext(TWContext);
	if (!context) {
		throw new Error('useTWProviderContext must be used within a TWProvider');
	}
	return context;
};
