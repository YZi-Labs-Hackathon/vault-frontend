import localforage from 'localforage';
import { isArray, isNil, isObject } from 'lodash';
import { CacheOptions } from './cache-types';

/**
 * Cache using localforage
 */
class IndexedDBCacheService {
	private cache: LocalForage;

	constructor() {
		this.cache = localforage.createInstance({
			driver: localforage.INDEXEDDB,
			name: 'mirai_cache',
			storeName: 'mcache_store',
			version: 1,
		});
	}

	public async set(key: string, value: any, options?: CacheOptions): Promise<void> {
		if (isNil(value)) {
			throw new Error('Not allowed nil value');
		}

		await this.cache.setItem(key, {
			data: value,
			metadata: {
				maxAge: options?.maxAge,
				timestamp: Math.floor(Date.now() / 1000),
			},
		});
	}

	public async get<T>(key: string): Promise<T | null> {
		const cachedObject: any = await this.cache.getItem(key);
		if (cachedObject) {
			const { data, metadata } = cachedObject;
			if (metadata?.maxAge > 0) {
				const currentTime = Math.floor(Date.now() / 1000);
				const expiredTime = metadata.timestamp + metadata.maxAge;

				if (currentTime > expiredTime) {
					return null;
				}
			}
			return data as T;
		}
		return null;
	}

	public async setObject<T>(
		key: string,
		value: T,
		options?: CacheOptions,
	): Promise<void> {
		if (!isObject(value) && !isArray(value)) {
			throw new Error('Not allowed non-object value. Please use setString instead.');
		}
		return await this.set(key, value, options);
	}

	public async setString(
		key: string,
		value: string,
		options?: CacheOptions,
	): Promise<void> {
		return await this.set(
			key,
			typeof value === 'string' ? value : JSON.stringify(value),
			options,
		);
	}

	public async getObject<T>(key: string): Promise<T | null> {
		return await this.get<T>(key);
	}

	public async getString(key: string): Promise<string | null> {
		return await this.get<string>(key);
	}

	public async remove(key: string): Promise<void> {
		await this.cache.removeItem(key);
	}
}

export const IndexedDBCache = new IndexedDBCacheService();
