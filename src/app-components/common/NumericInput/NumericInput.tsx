import { useEffect, useState } from 'react';
import {
	NumberFormatValues,
	NumericFormat,
	NumericFormatProps,
	SourceInfo,
} from 'react-number-format';

interface NumericInputProps extends NumericFormatProps {
	useDefaultMaxLength?: boolean;
	decimal?: number;
}

const NumericInput: React.FC<NumericInputProps> = (props) => {
	const {
		value: propValue,
		onValueChange,
		useDefaultMaxLength = true,
		decimal = 18,
		...rest
	} = props;
	const [value, setValue] = useState(propValue);

	const handleValueChange = (values: NumberFormatValues, sourceInfo: SourceInfo) => {
		const { value: rawValue } = values;

		// Normalize any commas to dots for decimal separator
		// Have this replacement to handle iOS decimal keyboard issue
		let normalizedValue = rawValue.replace(',', '.');
		normalizedValue = normalizedValue === '.' ? '' : normalizedValue;

		// Update the state with the normalized value
		typeof onValueChange === 'function' &&
			onValueChange({ ...values, value: normalizedValue }, sourceInfo);
		setValue(normalizedValue);
	};

	useEffect(() => {
		if ((propValue === '' && value !== '') || (propValue !== '' && value === '')) {
			setValue(propValue);
			return;
		}

		if (propValue !== value) {
			setValue(propValue);
		}
	}, [propValue, value]);

	return (
		<NumericFormat
			decimalSeparator={'.'}
			// "," is not the decimal separator, but it should be allowed for input
			allowedDecimalSeparators={['.', ',']}
			thousandSeparator={','}
			allowNegative={false}
			onValueChange={handleValueChange}
			value={value}
			autoComplete="off"
			autoCorrect="off"
			autoCapitalize="off"
			decimalScale={decimal}
			maxLength={
				useDefaultMaxLength
					? String('1,000,000,000').length
					: props.maxLength || undefined
			}
			{...rest}
		/>
	);
};

export default NumericInput;
