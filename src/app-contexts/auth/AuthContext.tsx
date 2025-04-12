import { Maybe } from '@/app-types/common';
import { Session } from 'next-auth';
import React from 'react';

export interface AuthContextValue {
	session: Maybe<Session>;
	address: Maybe<string>;
	login: () => Promise<void>;
	logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextValue | null>(null);
