'use client';

import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { FeatureFlagContext } from './FeatureFlagContext';

export const Features = {
	CreateVault: 'create_vault',
};

interface FeatureFlagProviderProps {
	children?: React.ReactNode;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({ children }) => {
	const { data: flags } = useQuery({
		queryKey: ['query-feature-flags'],
		throwOnError: false,
		queryFn: async () => {
			const rawFlagStr = process.env.NEXT_PUBLIC_FEATURE_FLAGS ?? '';
			const features = rawFlagStr.split(',').map((f) => f.trim());
			return features.reduce((acc, f) => {
				acc[f] = true;
				return acc;
			}, {}) as Record<string, boolean>;
		},
	});

	const isEnabled = (flag: string) => {
		return flags?.[flag] ?? false;
	};

	return (
		<FeatureFlagContext.Provider
			value={{
				flags: flags ?? {},
				isEnabled,
			}}
		>
			{children}
		</FeatureFlagContext.Provider>
	);
};

export const useFeatureFlag = () => {
	const context = useContext(FeatureFlagContext);
	if (!context) {
		throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
	}
	return context;
};
