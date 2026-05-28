import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';

export function useMfaFactors() {
	const [verifiedFactors, setVerifiedFactors] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);

	const loadFactors = async () => {
		const { data, error: factorsError } = await supabase.auth.mfa.listFactors();
		if (factorsError) {
			setError(factorsError.message);
			return;
		}
		setVerifiedFactors(data.totp.filter(f => f.status === 'verified').map(f => f.friendly_name ?? f.id));
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
