'use client';

import { FlatNamespace, KeyPrefix } from 'i18next';
import {
	FallbackNs,
	UseTranslationOptions,
	UseTranslationResponse,
	useTranslation as useBase,
} from 'react-i18next';

type $Tuple<T> = readonly [T?, ...T[]];

export const useTranslation = <
	Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
	KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
	ns?: Ns,
	options?: UseTranslationOptions<KPrefix>,
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> => {
	return useBase(ns, options);
};
