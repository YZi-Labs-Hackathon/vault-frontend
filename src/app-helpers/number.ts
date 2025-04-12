import { FiatCurrencyUnit } from '@/app-types/common';
import { addHexPrefix, isHexString } from 'ethereumjs-util';
import { BigNumber, ethers } from 'ethers';
import numeral from 'numeral';

export const hexlify = (input: string | number): string => {
	let value: string;

	if (typeof input === 'number') {
		value = input.toString();
	} else {
		value = input;
	}

	if (!isHexString(value)) {
		const decimalNumber = Number(value);
		value = decimalNumber.toString(16);
	}

	return addHexPrefix(value);
};

export const hexlifyTransactionValue = (value: string) => {
	return ethers.utils.hexValue(ethers.BigNumber.from(value).toHexString());
};

export const decimalize = (input: string | number): string => {
	let value: string;

	if (typeof input === 'number') {
		value = input.toString();
	} else {
		value = input;
	}

	if (isHexString(value)) {
		const decimalNumber = parseInt(value, 16);
		value = decimalNumber.toString(10);
	}

	return value;
};

export const decimalizeAsNumber = (input: string | number): number => {
	return Number(decimalize(input));
};

export const formatNumber = (
	value: string | number,
	decimals = 4,
	minimumFractionDigits = 0,
) => {
	if (isNaN(+value)) {
		return '';
	}

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		minimumFractionDigits: minimumFractionDigits,
		maximumFractionDigits: decimals,
	});

	return formatter.format(Number(value));
};

export const formatCurrencyWithUnit = ({
	value,
	decimals = 4,
	minimumFractionDigits = 0,
	fiatCurrency = FiatCurrencyUnit.USD,
}: {
	value: string;
	decimals?: number;
	minimumFractionDigits?: number;
	fiatCurrency?: FiatCurrencyUnit;
}) => {
	return formatCurrency(value, decimals, minimumFractionDigits, fiatCurrency);
};

export const formatCurrency = (
	value: string | number,
	decimals = 4,
	minimumFractionDigits = 0,
	currencyUnit: FiatCurrencyUnit = FiatCurrencyUnit.USD,
) => {
	if (isNaN(+value)) {
		return '';
	}

	let _currencyUnit = currencyUnit;
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: _currencyUnit,
		currencyDisplay: 'symbol',
		minimumFractionDigits: minimumFractionDigits,
		maximumFractionDigits: decimals,
	});

	const formatted = formatter.format(Number(value));
	return formatted;
};

export const formatMinimalUnitCurrency = (value: string | number) => {
	if (Number(value) === 0) {
		return formatCurrency('0.00', 2, 2);
	} else if (Number(value) < 0.0001) {
		return '< ' + formatCurrency('0.0001');
	} else if (Number(value) < 0.01) {
		return formatCurrency(value, 4, 0);
	} else {
		return formatCurrency(value, 2, 2);
	}
};

export const formatMinimalUnitNumber = (value: string | number) => {
	if (Number(value) === 0) {
		return formatNumber('0.00', 2, 2);
	} else if (Number(value) < 0.0001) {
		return '< ' + formatNumber('0.0001');
	}
	return formatNumber(value);
};

export const formatCurrencyWithSubscriptZero = (
	value: string | number,
	maximumNonZeroDigits = 4,
) => {
	try {
		const num = Number(value);

		if (num === 0) {
			return formatCurrency('0');
		}

		if (num >= 1) {
			return formatCurrency(value, maximumNonZeroDigits, 0);
		}

		if (num >= 0.01) {
			return formatCurrency(value, maximumNonZeroDigits + 1, 0);
		}

		if (num >= 0.001) {
			return formatCurrency(value, maximumNonZeroDigits + 2, 0);
		}

		if (num >= 0.0001) {
			return formatCurrency(value, maximumNonZeroDigits + 3, 0);
		}

		const numberString = value
			.toLocaleString('fullwide', { maximumFractionDigits: 20 })
			.replace(/,/g, '.');
		const [main, sub] = numberString.split('.');

		const match = sub.match(/^0+/);
		const zeros = match ? match[0] : '';
		const subscriptZero = formatSubscriptZero(zeros);

		let nonZeros = sub.slice(zeros.length);
		nonZeros = nonZeros.replace(/0+$/, '');
		const roundedNonZeros = String(
			Math.round(
				parseFloat(
					`${nonZeros.slice(0, maximumNonZeroDigits)}.${nonZeros.slice(
						maximumNonZeroDigits,
						maximumNonZeroDigits + 1,
					)}`,
				),
			),
		);

		return `$${main}.${subscriptZero}${roundedNonZeros}`;
	} catch {
		return formatCurrency('0');
	}
};

export const formatNumberWithSubscriptZero = (
	value: string | number,
	maximumNonZeroDigits = 4,
) => {
	try {
		const num = Number(value);

		if (num === 0) {
			return formatNumber('0.00', 2, 2);
		}

		if (num >= 0.0001) {
			return formatNumber(value, maximumNonZeroDigits);
		}

		const numberString = value
			.toLocaleString('fullwide', { maximumFractionDigits: 20 })
			.replace(/,/g, '.');
		const [main, sub] = numberString.split('.');

		const match = sub.match(/^0+/);
		const zeros = match ? match[0] : '';
		const subscriptZero = formatSubscriptZero(zeros);

		let nonZeros = sub.slice(zeros.length);
		nonZeros = nonZeros.replace(/0+$/, '');
		const roundedNonZeros = String(
			Math.round(
				parseFloat(
					`${nonZeros.slice(0, maximumNonZeroDigits)}.${nonZeros.slice(
						maximumNonZeroDigits,
						maximumNonZeroDigits + 1,
					)}`,
				),
			),
		);

		return `${main}.${subscriptZero}${roundedNonZeros}`;
	} catch {
		return formatNumber('0.00', 2, 2);
	}
};

export const formatSubscriptZero = (value: string) => {
	const zeroCount = value.length;

	if (zeroCount < 10) {
		const unicodeCharacter = String.fromCharCode(0x2080 + zeroCount);
		return '0' + unicodeCharacter;
	}

	const tens = Math.floor(zeroCount / 10);
	const units = zeroCount % 10;

	const tensCharacter = String.fromCharCode(0x2080 + tens);
	const unitsCharacter = String.fromCharCode(0x2080 + units);

	return '0' + tensCharacter + unitsCharacter;
};

export const formatUnits = (amount: string | ethers.BigNumberish, decimals: number) => {
	try {
		return ethers.utils.formatUnits(amount ?? '0', decimals);
	} catch (e) {
		return amount.toString();
	}
};

export const parseUnits = (amount: string | ethers.BigNumberish, decimals: number) => {
	try {
		return ethers.utils.parseUnits((amount ?? '0').toString(), decimals);
	} catch (e) {
		return amount.toString();
	}
};

export const numeralFormat = (number: string) => {
	return BigNumber.from(number).gt(BigNumber.from(1000000)) // check if is bignumber
		? numeral(number).format('0,0.[00]a').toUpperCase()
		: formatNumberWithSubscriptZero(number);
};

export const decimalToBytes2 = (decimal: number): string => {
	// Ensure the number fits within the range of 2 bytes (0 to 65535)
	if (decimal < 0 || decimal > 0xffff) {
		throw new Error('Number is out of range for bytes2.');
	}

	// Convert the number to a hexadecimal string with zero-padding to 4 characters
	const hexString = decimal.toString(16).padStart(4, '0');

	// Add the "0x" prefix to indicate it's a hexadecimal representation
	return `0x${hexString}`;
};

export const bytes2ToDecimal = (bytes2: string): number => {
	// Validate the input to ensure it's a valid bytes2 hexadecimal string
	if (!/^0x[0-9a-fA-F]{4}$/.test(bytes2)) {
		throw new Error('Invalid bytes2 format.');
	}

	// Remove the "0x" prefix and parse the hexadecimal string as a decimal number
	return parseInt(bytes2.slice(2), 16);
};

export function isScientificNumber(str: string) {
	const scientificNotationRegex = /^[+-]?\d+(\.\d+)?[eE][+-]?\d+$/;
	return scientificNotationRegex.test(str);
}

export const isZeroNumber = (value: string) => {
	try {
		if (!value) {
			return true;
		}
		return ethers.BigNumber.from(value).isZero();
	} catch (e) {
		return false;
	}
};

export function percentToPercentBps(percent: number): number {
	if (percent < 0 || percent > 1) {
		throw new Error('Invalid percent value. Must be between 0 and 1.');
	}

	return percent * 100 * 100;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const formatNumeral = (value: string) => {
	return numeral(value).format('0,0.[000]a').toUpperCase();
};

export const formatNumeralCurrency = (value: string) => {
	return numeral(value).format('$0,0.[000000]a').toUpperCase();
};
