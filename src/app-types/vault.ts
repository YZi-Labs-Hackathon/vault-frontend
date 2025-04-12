import { ProtocolType } from '@/app-constants/blockchain';
import { Maybe } from './common';

export enum VaultChainProtocol {
	EVM = 'EVM',
	SOLANA = 'Solana',
}

export enum VaultChainType {
	Mainnet = 'mainnet',
	Testnet = 'testnet',
}

export interface VaultChainNativeCurrency {
	name: string;
	symbol: string;
	decimals: number;
}

export interface VaultChain {
	id: string;
	createdAt: string;
	chainId: number;
	chainType: VaultChainProtocol;
	name: string;
	shortName: string;
	logo: string;
	rpc: string[];
	tokenStandard: string;
	durableBlockConfirmations: number;
	type: VaultChainType;
	nativeCurrency: VaultChainNativeCurrency;
	explorers: string[];
	defaultEnableNative: boolean;
	skipDefaultGasForNative: boolean;
	status: number;
	description: string;
}

export enum VaultProtocolService {
	aave = 'aave',
	venus = 'venus',
	apex = 'apex',
	drift = 'drift',
	pancake = 'pancake',
}

export interface VaultProtocol {
	id: string;
	createdAt: string;
	service: VaultProtocolService;
	name: string;
	image: string;
	description: string;
	totalTVL: string;
	totalEarned: string;
	totalDeposits: string;
	totalWithdrawals: string;
	totalUsers: string;
	supportedChainIds: string[];
	tags: string[];
}

export interface VaultToken {
	id: string;
	createdAt: string;
	name: string;
	symbol: string;
	address: string;
	logo: string;
	decimals: string;
	chainId: string | number;
	protocol: ProtocolType;
	status: number;
	assetId: string;
	chain: VaultChain;
}

export interface VaultDepositRule {
	min: number;
	max: number;
}

export interface VaultWithdrawTerm {
	lockUpPeriod: number;
	delay: number;
}

export interface VaultFee {
	performanceFee: number;
	recipientAddress: number;
}

export enum VaultStatus {
	IN_REVIEW = 'IN_REVIEW',
	ACTIVE = 'ACTIVE',
	CLOSE = 'CLOSE',
	PAUSE = 'PAUSE',
}

export interface VaultCreator {
	address: string;
	chainType: string;
	name: string;
}

export interface VaultListItem {
	id: string;
	createdAt: string;
	name: string;
	logo: string;
	description: string;
	chainId: string;
	tokenId: string;
	creatorId: string;
	depositRule: Maybe<VaultDepositRule>;
	withdrawTerm: VaultWithdrawTerm;
	fee: VaultFee;
	aiAgent: any;
	contractAddress: string;
	shareTokenAddress: string;
	status: VaultStatus;
	creator: VaultCreator;
	chain?: VaultChain;
	token?: VaultToken;
	tvl: string;
	apr: number;
	age: number;
	yourDeposit?: string; // Big number string
	yourPnl?: string;
	allTimePnl?: string;
}

export interface Vault {
	id: string;
	createdAt: string;
	name: string;
	logo: string;
	description: string;
	chainId: string;
	tokenId: string;
	creatorId: string;
	depositRule: Maybe<VaultDepositRule>;
	withdrawTerm: VaultWithdrawTerm;
	fee: VaultFee;
	aiAgent: any;
	contractAddress: string;
	shareTokenAddress: string;
	status: VaultStatus;
	creator: VaultCreator;
	chain: VaultChain;
	token: VaultToken;
	protocol?: VaultProtocol;
	totalLock: string;
	yourDeposit: string;
	apy: number;
	yourPnl: string;
	allTimePnl: string;
	age: number;
	profitShare: string;
	maxDrawDown: number;
	yourPnl24h: string;
	defaultProtocolId: string;
}
