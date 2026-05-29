'use client';

import { useEffect, useState } from 'react';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const supabase = createSupabaseBrowserClient();

export function useMfaFactors() {
	const [verifiedFactors, setVerifiedFactors] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);

	const loadFactors = async () => {
		const { data, error: factorsError } = await supabase.auth.mfa.listFactors();
		if (factorsError) {
			setError(factorsError.message);
			return;
		}
		setVerifiedFactors(
			data.totp
				.filter((factor: { status: string }) => factor.status === 'verified')
				.map((factor: { friendly_name?: string; id: string }) => factor.friendly_name ?? factor.id)
		);
	};

	useEffect(() => {
		let cancelled = false;

		queueMicrotask(() => {
			if (!cancelled) {
				void loadFactors();
			}
		});

		return () => {
			cancelled = true;
		};
	}, []);

	return { verifiedFactors, error, reloadFactors: loadFactors };
}
