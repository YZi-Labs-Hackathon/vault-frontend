import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { Account } from 'thirdweb/wallets';
import { CHAIN, twClient } from './tw-context';

export const getSignerFromAccount = async (account: Account) => {
	return await ethers5Adapter.signer.toEthers({
		client: twClient,
		chain: CHAIN,
		account,
	});
};
