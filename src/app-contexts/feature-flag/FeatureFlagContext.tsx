'use client';

import React from 'react';

export interface FeatureFlagContextValue {
	flags: Record<string, boolean>;
	isEnabled: (flag: string) => boolean;
}

export const FeatureFlagContext = React.createContext<FeatureFlagContextValue>({
	flags: {},
	isEnabled: () => false,
});
