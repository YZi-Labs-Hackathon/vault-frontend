import * as numberUtils from '@/app-helpers/number';
import { FiatCurrencyUnit } from '@/app-types/common';
import { useCallback } from 'react';

export const useNumberFormatter = () => {
	const formatCurrency = useCallback(
		(value: string | number, decimals = 4, minimumFractionDigits = 0) => {
			return numberUtils.formatCurrency(
				value,
				decimals,
				minimumFractionDigits,
				FiatCurrencyUnit.USD,
			);
		},
		[],
	);

	const formatMinimalUnitCurrency = useCallback((value: string | number) => {
		if (Number(value) === 0) {
			return formatCurrency('0.00', 2, 2);
		} else if (Number(value) < 0.0001) {
			return '< ' + formatCurrency('0.0001');
		} else if (Number(value) < 0.01) {
			return formatCurrency(value, 4, 0);
		} else {
			return formatCurrency(value, 2, 2);
		}
	}, []);

	const formatNumber = useCallback(
		(value: string | number, decimals = 4, minimumFractionDigits = 0) => {
			return numberUtils.formatNumber(value, decimals, minimumFractionDigits);
		},
		[],
	);

	const formatMinimalUnitNumber = useCallback((value: string | number) => {
		if (Number(value) === 0) {
			return formatNumber('0.00', 2, 2);
		} else if (Number(value) < 0.0001) {
			return '< ' + formatNumber('0.0001');
		}
		return formatNumber(value);
	}, []);

	const formatNumberWithSubscriptZero = useCallback(
		(value: string | number, maximumNonZeroDigits = 4) => {
			return numberUtils.formatNumberWithSubscriptZero(value, maximumNonZeroDigits);
		},
		[],
	);

	const formatCurrencyWithSubscriptZero = useCallback(
		(value: string | number, maximumNonZeroDigits = 4) => {
			return numberUtils.formatCurrencyWithSubscriptZero(value, maximumNonZeroDigits);
		},
		[],
	);

	return {
		formatCurrency,
		formatMinimalUnitCurrency,
		formatNumber,
		formatMinimalUnitNumber,
		formatNumberWithSubscriptZero,
		formatCurrencyWithSubscriptZero,
	};
};
