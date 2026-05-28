import type { Session, User } from '@supabase/supabase-js';

export type AuthStep = 'password' | 'mfa' | 'ready';

export interface AuthContextValue {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	authStep: AuthStep;
	mfaFactorId: string | null;
	mfaChallengeId: string | null;
	loginError: string | null;
	signInWithPassword: (email: string, password: string) => Promise<void>;
	verifyMfaCode: (code: string) => Promise<void>;
	signOut: () => Promise<void>;
	refreshAuthStep: () => Promise<void>;
}
