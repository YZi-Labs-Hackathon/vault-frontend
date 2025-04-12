import { NativeCoin } from '@/app-constants/blockchain';
import { Maybe } from '@/app-types/common';
import { ethers } from 'ethers';

export const getShortAddress = (address: string) => {
	return (
		address.substr(0, 7) + '...' + address.substr(address.length - 5, address.length)
	);
};

export const getEvmAddress = (address: string): string => {
	try {
		if (!address) return '';
		return ethers.utils.getAddress(address);
	} catch (e) {
		// DO NOTHING
	}
	return '';
};

export const isEvmAddress = (address: string) => {
	try {
		return ethers.utils.isAddress(address);
	} catch (e) {
		// DO NOTHING
	}
	return false;
};

export const areAddressesEqual = (addr1: string, addr2: string) => {
	if (!addr1 || !addr2) return false;
	return addr1.toLowerCase() === addr2.toLowerCase();
};

export const isNativeAddress = (address: Maybe<string>) => {
	return !!address && areAddressesEqual(address, NativeCoin.EVM);
};
