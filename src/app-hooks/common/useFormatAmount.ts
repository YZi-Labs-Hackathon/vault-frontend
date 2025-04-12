import { useMemo } from 'react';
import { useNumberFormatter } from './useNumberFormatter';

interface FormatOptions {
	decimals?: number;
	minimal?: boolean;
	subscriptZero?: boolean;
}

export const useFormatAmount = (amount: string | number = 0, options?: FormatOptions) => {
	const { minimal = false, subscriptZero = false, decimals = 4 } = options || {};

	const { formatNumber, formatMinimalUnitNumber, formatNumberWithSubscriptZero } =
		useNumberFormatter();

	return useMemo(() => {
		if (subscriptZero) {
			return formatNumberWithSubscriptZero(amount, decimals);
		}

		if (minimal) {
			return formatMinimalUnitNumber(amount);
		}

		return formatNumber(amount, decimals);
	}, [
		formatNumber,
		formatMinimalUnitNumber,
		formatNumberWithSubscriptZero,
		amount,
		decimals,
		minimal,
		subscriptZero,
	]);
};
