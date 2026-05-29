'use client';

import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { AuthContext } from '@/context/auth-context';
import type { AuthContextValue, AuthStep } from '@/context/auth-types';

const supabase = createSupabaseBrowserClient();

async function resolveAuthStep(): Promise<{
	step: AuthStep;
	factorId: string | null;
}> {
	const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
	if (aalError) {
		return { step: 'password', factorId: null };
	}

	if (aalData.currentLevel === 'aal2') {
		return { step: 'ready', factorId: null };
	}

	if (aalData.nextLevel === 'aal2' && aalData.currentLevel === 'aal1') {
		const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
		if (factorsError) {
			return { step: 'password', factorId: null };
		}

		const totpFactor = factorsData.totp.find((factor: { status: string; id: string }) => factor.status === 'verified');
		if (totpFactor) {
			return { step: 'mfa', factorId: totpFactor.id };
		}
	}

	const {
		data: { session }
	} = await supabase.auth.getSession();
	if (session) {
		return { step: 'ready', factorId: null };
	}

	return { step: 'password', factorId: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [authStep, setAuthStep] = useState<AuthStep>('password');
	const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
	const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
	const [loginError, setLoginError] = useState<string | null>(null);

	const refreshAuthStep = useCallback(async () => {
		const { step, factorId } = await resolveAuthStep();
		setAuthStep(step);
		setMfaFactorId(factorId);

		if (step === 'mfa' && factorId) {
			const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
			if (challengeError) {
				setLoginError(challengeError.message);
				return;
			}
			setMfaChallengeId(challengeData.id);
		} else {
			setMfaChallengeId(null);
		}
	}, []);

	const handleSession = useCallback(
		async (nextSession: Session | null) => {
			setSession(nextSession);
			setUser(nextSession?.user ?? null);

			if (!nextSession) {
				setAuthStep('password');
				setMfaFactorId(null);
				setMfaChallengeId(null);
				return;
			}

			await refreshAuthStep();
		},
		[refreshAuthStep]
	);

	useEffect(() => {
		let isMounted = true;

		const init = async () => {
			const {
				data: { session: initialSession }
			} = await supabase.auth.getSession();
			if (!isMounted) return;
			await handleSession(initialSession);
			if (isMounted) setIsLoading(false);
		};

		void init();

		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, nextSession: Session | null) => {
			void handleSession(nextSession);
		});

		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
	}, [handleSession]);

	const signInWithPassword = useCallback(
		async (email: string, password: string) => {
			setLoginError(null);
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) {
				setLoginError(error.message);
				return;
			}
			await refreshAuthStep();
		},
		[refreshAuthStep]
	);

	const verifyMfaCode = useCallback(
		async (code: string) => {
			if (!mfaFactorId || !mfaChallengeId) {
				setLoginError('MFA challenge is not ready. Try signing in again.');
				return;
			}

			setLoginError(null);
			const { error } = await supabase.auth.mfa.verify({
				factorId: mfaFactorId,
				challengeId: mfaChallengeId,
				code
			});

			if (error) {
				setLoginError(error.message);
				const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
					factorId: mfaFactorId
				});
				if (!challengeError) {
					setMfaChallengeId(challengeData.id);
				}
				return;
			}

			await refreshAuthStep();
		},
		[mfaFactorId, mfaChallengeId, refreshAuthStep]
	);

	const signOut = useCallback(async () => {
		setLoginError(null);
		await supabase.auth.signOut();
		setAuthStep('password');
		setMfaFactorId(null);
		setMfaChallengeId(null);
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			session,
			isLoading,
			authStep,
			mfaFactorId,
			mfaChallengeId,
			loginError,
			signInWithPassword,
			verifyMfaCode,
			signOut,
			refreshAuthStep
		}),
		[
			user,
			session,
			isLoading,
			authStep,
			mfaFactorId,
			mfaChallengeId,
			loginError,
			signInWithPassword,
			verifyMfaCode,
			signOut,
			refreshAuthStep
		]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
