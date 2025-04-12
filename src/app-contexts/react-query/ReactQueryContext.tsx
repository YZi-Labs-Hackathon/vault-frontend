'use client';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

export type ReactQueryContextValue = {
	[key: string]: any;
};

export const ReactQueryContext = React.createContext<ReactQueryContextValue>({});

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			throwOnError: false,
		},
		mutations: {
			throwOnError: false,
		},
	},
});
