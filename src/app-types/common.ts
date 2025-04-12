export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}

export interface PaginateMetadata {
	itemCount: number;
	totalItems: number;
	itemsPerPage: number;
	totalPages: number;
	currentPage: number;
}

export interface Paginate<T> {
	items: T[];
	meta: PaginateMetadata;
}

export type HexString = `0x${string}`;

export type ServerPropsWithLocale<T, P> = Readonly<
	T & {
		params: Promise<
			P & {
				locale: string;
			}
		>;
	}
>;

export type Maybe<T> = T | null | undefined;

export enum FiatCurrencyUnit {
	USD = 'USD',
	VND = 'VND',
}
