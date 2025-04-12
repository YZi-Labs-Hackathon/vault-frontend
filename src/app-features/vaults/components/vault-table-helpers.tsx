import { getShortAddress } from '@/app-helpers/address';
import { formatCurrency } from '@/app-helpers/number';
import { VaultListItem } from '@/app-types/vault';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';

export interface IVaultTableItem {
	name: string;
	tvl: string;
	age: number;
	pnl?: string;
	userPnl?: string;
	userDeposit?: string;
	vault: VaultListItem;
}

export const columnHelper = createColumnHelper<IVaultTableItem>();

export const getVaultTableColumns = () => {
	return [
		columnHelper.accessor('name', {
			header: () => 'Vault',
			cell: (info) => {
				const vaultAddress = info.row.original.vault.contractAddress;
				const creator = info.row.original.vault.creator.address;
				return (
					<>
						<div>
							<Link href={`/vault/${vaultAddress}`}>{info.getValue()}</Link>
						</div>
						<div className="small text-secondary">
							Created by <span className="fw-medium">{getShortAddress(creator)}</span>
						</div>
					</>
				);
			},
		}),

		columnHelper.accessor('tvl', {
			header: () => 'TVL',
			cell: (info) => {
				const tvl = info.getValue() ?? '0';
				return `${formatCurrency(tvl)}`;
			},
		}),

		columnHelper.accessor('age', {
			header: () => 'Age',
			cell: (info) => {
				return `${info.getValue()} days`;
			},
		}),

		columnHelper.accessor('pnl', {
			header: () => 'PnL',
			cell: (info) => {
				const pnl = info.getValue() ?? '0';
				return `${formatCurrency(pnl)}`;
			},
		}),

		columnHelper.accessor('userPnl', {
			header: () => 'Your PnL',
			cell: (info) => {
				const yourPnl = info.getValue();
				return yourPnl ? `${formatCurrency(yourPnl)}` : '-';
			},
		}),

		columnHelper.accessor('userDeposit', {
			header: () => 'Your Deposit',
			cell: (info) => {
				const yourDeposit = info.getValue();
				return yourDeposit ? `${formatCurrency(yourDeposit)}` : '-';
			},
		}),
	];
};
