import { defineChain } from 'thirdweb';
import { bsc } from 'thirdweb/chains';

export enum ProtocolType {
	Ethereum = 'ethereum',
}

export const NativeCoin = {
	EVM: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
};

export const DEFAULT_EVM_DECIMALS = 18;

/** Chain Definitions */
export const bnbChain = defineChain({
	...bsc,
	rpc: 'https://bsc-dataseed1.bnbchain.org',
});
