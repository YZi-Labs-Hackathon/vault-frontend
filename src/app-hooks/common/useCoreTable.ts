import {
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowData,
	TableOptions,
	useReactTable,
} from '@tanstack/react-table';

export const useCoreTable = <TData extends RowData>(
	options: Omit<
		TableOptions<TData>,
		'getCoreRowModel' | 'getPaginationRowModel' | 'getSortedRowModel'
	>,
) => {
	return useReactTable({
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		...options,
	});
};
