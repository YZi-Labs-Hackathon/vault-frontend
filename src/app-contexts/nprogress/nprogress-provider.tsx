'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { PropsWithChildren } from 'react';

const NProgressProvider = ({ children }: PropsWithChildren<{}>) => {
	return (
		<ProgressProvider height="2px" color="#fffd00" options={{ showSpinner: false }}>
			{children}
		</ProgressProvider>
	);
};

export default NProgressProvider;
