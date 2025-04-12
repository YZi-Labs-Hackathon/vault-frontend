'use client';
import { bnbChain } from '@/app-constants/blockchain';
import React from 'react';
import { createThirdwebClient } from 'thirdweb';
import {
	Account,
	ConnectionStatus,
	createWallet,
	Wallet,
	WalletId,
} from 'thirdweb/wallets';

export type TWContextValue = {
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
	isConnecting: boolean;
	address?: string;
	account?: Account;
	wallet?: Wallet<WalletId>;
	connectionStatus: ConnectionStatus;
	[key: string]: any;
};

export const TWContext = React.createContext<TWContextValue>({
	connect: async () => {},
	disconnect: async () => {},
	connectionStatus: 'unknown',
	isConnecting: false,
});

export const WALLETS = [
	createWallet('io.miraiapp'),
	createWallet('walletConnect'),
	createWallet('io.metamask'),
];

export const APP_CHAINS = [bnbChain];
export const CHAIN = bnbChain;

export const AUTO_CONNECT_TIMEOUT = 10_000;

export const twClient = createThirdwebClient({
	clientId: process.env.NEXT_PUBLIC_TW_CLIENT_ID as string,
});
