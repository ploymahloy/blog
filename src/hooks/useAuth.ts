import { useContext } from 'react';

import { AuthContext } from '../context/auth-context';
import type { AuthContextValue } from '../context/auth-types';

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}

export function useIsAdminReady() {
	const { session, authStep, isLoading } = useAuth();
	return { isReady: Boolean(session) && authStep === 'ready', isLoading };
}
