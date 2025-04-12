'use client';
import { areAddressesEqual } from '@/app-helpers/address';
import { useOnEventCallback } from '@/app-hooks/common';
import { AuthApi } from '@/app-services/api';
import { PartnrAuth } from '@/app-services/auth';
import { Mutex } from 'async-mutex';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { signMessage } from 'thirdweb/utils';
import { useWeb3Wallet } from '../thirdweb';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
	children?: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const session = useSession();
	const { disconnect, address, connectionStatus, account, wallet } = useWeb3Wallet();
	const sessionUpdateMutex = useRef<Mutex>(new Mutex());
	const isConnected = connectionStatus === 'connected';
	const isDisconnected = connectionStatus === 'disconnected';

	const [isAuthCoreResolved, setIsAuthCoreResolved] = useState<boolean>(false);

	const requestSignature = useOnEventCallback(async () => {
		if (!address || !account) {
			throw new Error('Wallet is not available');
		}

		const challenge = await AuthApi.getChallenge(address);
		if (!challenge) {
			throw new Error('Failed to get challenge for logging in');
		}

		const signature = await signMessage({
			message: challenge,
			account,
		});
		if (!signature) {
			throw new Error('Failed to sign message');
		}

		return {
			address,
			challengeCode: challenge,
			signature,
		};
	});

	const onSessionUpdate = useOnEventCallback(async () => {
		if (!session) return;

		const newSession = await sessionUpdateMutex.current.runExclusive(async () => {
			return await session.update();
		});

		if (newSession && !!newSession.token.error) {
			console.debug('[AUTH] Session update error', {
				error: newSession.token.error,
			});
			// Force logging out if refresh token failed
			await logout(true);
		} else {
			console.debug('[AUTH] Session updated');
		}
	});

	const login = async () => {
		const { address, challengeCode, signature } = await requestSignature();

		await PartnrAuth.signIn({
			address,
			challengeCode,
			signature,
		});
	};

	const logout = async (shouldDisconnect: boolean = true) => {
		if (!session) {
			console.warn('session is not active, no need to logout');
			return;
		}

		// prettier-ignore
		await Promise.allSettled([
			shouldDisconnect ? disconnect() : Promise.resolve(),
			PartnrAuth.signOut(),
		])

		console.debug('User is logged out');
	};

	const _internalLogin = async () => {
		login().catch((e) => {
			console.error('authenticate error', e);
			logout();
		});
	};

	useEffect(() => {
		if (!address || !isConnected || session.status === 'loading') {
			return;
		}

		if (session.status === 'authenticated' && session.data?.user) {
			const addrFromSession = session.data.user.address;
			// If addresses are different, should login again
			if (!areAddressesEqual(addrFromSession, address)) {
				logout(true);
			}
			return;
		}
	}, [isConnected, session.data?.user, session.status, address]);

	useEffect(() => {
		console.debug('AuthProvider session', { session });
		if (session && session.data) {
			console.debug('User session', {
				userInfo: session.data.user,
				token: session.data.token,
			});
		} else {
			console.debug('User is not logged in');
		}
	}, [session]);

	useEffect(() => {
		if (!isAuthCoreResolved) {
			return;
		}

		const visibilityHandler = () =>
			document.visibilityState === 'visible' && onSessionUpdate();

		window.addEventListener('visibilitychange', visibilityHandler, false);
		return () => window.removeEventListener('visibilitychange', visibilityHandler, false);
	}, [onSessionUpdate, session, isAuthCoreResolved]);

	// For initial session update
	// 'session' should not be in deps list
	useEffect(() => {
		if (session && session.data) {
			onSessionUpdate().then(() => {
				PartnrAuth.resolveInit(onSessionUpdate);
				setIsAuthCoreResolved(true);
			});
		} else {
			PartnrAuth.resolveInit(onSessionUpdate);
			setIsAuthCoreResolved(true);
		}
	}, []);

	useEffect(() => {
		if (isConnected && !session.data) {
			setTimeout(() => {
				_internalLogin();
			}, 0);
		}

		if (isDisconnected && session.data) {
			logout(false);
		}
	}, [isConnected, isDisconnected, session.data]);

	// useEffect(() => {
	// 	const onConnect = () => {
	// 		_internalLogin();
	// 	};
	// 	const onDisconnect = () => {
	// 		logout(false);
	// 	};
	// 	const cleanupFuncs: ((() => void) | undefined)[] = [];

	// 	cleanupFuncs.push(wallet?.subscribe('onConnect', onConnect));
	// 	cleanupFuncs.push(wallet?.subscribe('disconnect', onDisconnect));

	// 	return () => {
	// 		cleanupFuncs.forEach((cleanup) => cleanup?.());
	// 	};
	// }, [wallet]);

	return (
		<AuthContext.Provider
			value={{
				session: session.data,
				address,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuthContext must be used within AuthProvider');
	}
	return context;
};
