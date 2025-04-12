import { useCoreTable } from '@/app-hooks/common';
import { ColumnDef, flexRender, Row, TableOptions } from '@tanstack/react-table';
import classNames from 'classnames';
import React, { CSSProperties, useEffect, useMemo } from 'react';
import { Table as BsTable, TableProps as BsTableProps } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { ActivityIndicator } from '../ActivityIndicator';
import CellSkeleton from './CellSkeleton';

export interface TableProps<TData> extends BsTableProps {
	className?: string;
	tableClassname?: string;
	sticky?: boolean;
	data: TData[];
	columns: ColumnDef<TData, any>[];
	options?: Omit<TableOptions<TData>, 'columns' | 'data' | 'getCoreRowModel'>;
	isLoading?: boolean;
	isFetchingNextPage?: boolean;
	numberOfSkeletons?: number;
	tableEmptyComponent?: React.ReactNode | (() => React.ReactNode);
	onEndReached?: () => void;
	getRowStyles?: (row: Row<TData>) => CSSProperties;
	onRowClick?: (row: Row<TData>) => void;
}

const Table = <TData,>({
	className,
	tableClassname,
	sticky,
	data,
	columns,
	options,
	isLoading,
	isFetchingNextPage,
	numberOfSkeletons = 8,
	tableEmptyComponent,
	onEndReached,
	getRowStyles,
	onRowClick,
	...tableProps
}: TableProps<TData>) => {
	const tableData = useMemo(
		() => (isLoading ? Array(numberOfSkeletons).fill({}) : data),
		[isLoading, data],
	);
	const tableColumns = useMemo(
		() =>
			isLoading
				? columns.map((column) => ({
						...column,
						cell: () => <CellSkeleton />,
					}))
				: columns,
		[isLoading, columns],
	);

	const table = useCoreTable({
		data: tableData,
		columns: tableColumns,
		...options,
	});

	const { ref, inView } = useInView({ skip: typeof onEndReached !== 'function' });

	useEffect(() => {
		if (inView && typeof onEndReached === 'function') {
			onEndReached();
		}
	}, [inView]);

	const shouldShowEmptyComponent =
		!!tableEmptyComponent && !isLoading && data.length === 0;

	return (
		<div className={className}>
			{!shouldShowEmptyComponent ? (
				<BsTable
					className={classNames(tableClassname, sticky && 'sticky')}
					responsive
					{...tableProps}
				>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								onClick={() => onRowClick?.(row)}
								className={classNames(onRowClick && 'cursor-pointer')}
							>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										style={typeof getRowStyles === 'function' ? getRowStyles(row) : {}}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</BsTable>
			) : (
				<>
					{typeof tableEmptyComponent === 'function'
						? tableEmptyComponent()
						: tableEmptyComponent}
				</>
			)}
			{isFetchingNextPage && (
				<ActivityIndicator className="d-flex justify-content-center align-items-center" />
			)}
			<div ref={ref}></div>
		</div>
	);
};

export default Table;
