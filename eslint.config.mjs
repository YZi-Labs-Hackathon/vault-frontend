import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	...compat.rules({
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'@typescript-eslint/no-explicit-any': 'off',
		'no-mixed-spaces-and-tabs': 'warn',
		'react-hooks/exhaustive-deps': 'on',
		'no-async-promise-executor': 'off',
		'no-empty': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'eslint-comments/no-unused-disable': 'off',
		'react-hooks/exhaustive-deps': 'on',
	}),
];

export default eslintConfig;
