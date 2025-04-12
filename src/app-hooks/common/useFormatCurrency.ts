import { useMemo } from 'react';
import { useNumberFormatter } from './useNumberFormatter';

interface FormatOptions {
	decimals?: number;
	minimal?: boolean;
	subscriptZero?: boolean;
}

export const useFormatCurrency = (
	currencyValue: string | number = 0,
	options?: FormatOptions,
) => {
	const { minimal = false, subscriptZero = false, decimals = 4 } = options || {};

	const { formatCurrency, formatMinimalUnitCurrency, formatCurrencyWithSubscriptZero } =
		useNumberFormatter();

	return useMemo(() => {
		if (subscriptZero) {
			return formatCurrencyWithSubscriptZero(currencyValue, decimals);
		}

		if (minimal) {
			return formatMinimalUnitCurrency(currencyValue);
		}

		return formatCurrency(currencyValue, decimals);
	}, [
		formatCurrency,
		formatMinimalUnitCurrency,
		formatCurrencyWithSubscriptZero,
		currencyValue,
		decimals,
		minimal,
		subscriptZero,
	]);
};
