import { Table } from '@/app-components/common/Table';
import { useQueryVaultList } from '@/app-hooks/vaults';
import { VaultProtocolService, VaultStatus } from '@/app-types/vault';
import { useMemo } from 'react';
import { getVaultTableColumns, IVaultTableItem } from './vault-table-helpers';

const VaultTable = () => {
	const { data: vaults, isLoading } = useQueryVaultList({
		filterStatus: [VaultStatus.ACTIVE, VaultStatus.PAUSE, VaultStatus.CLOSE].join(','),
		services: [VaultProtocolService.venus, VaultProtocolService.pancake].join(','),
	});

	const vaultTableData = useMemo(() => {
		if (!vaults || !vaults.length) return [];

		return vaults.map(
			(vault) =>
				({
					name: vault.name,
					tvl: vault.tvl,
					pnl: vault.allTimePnl,
					userPnl: vault.yourPnl,
					userDeposit: vault.yourDeposit,
					vault,
				}) as IVaultTableItem,
		);
	}, [vaults]);

	return (
		<Table
			isLoading={isLoading && vaultTableData.length === 0}
			bordered
			columns={getVaultTableColumns()}
			data={vaultTableData}
		/>
	);
};

export default VaultTable;
