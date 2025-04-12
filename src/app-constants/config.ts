import { PaginateMetadata } from '@/app-types/common';

export const PAGINATION_LIMIT_SELECTION = [10, 20, 50];

export const DEFAULT_PAGINATION_LIMIT = 10;

export const DEFAULT_PAGINATION_DATA: PaginateMetadata = {
	currentPage: 1,
	totalPages: 1,
	totalItems: 0,
	itemCount: 0,
	itemsPerPage: DEFAULT_PAGINATION_LIMIT,
};

export const DefaultDepositRules = {
	UNSET: 0,
};
