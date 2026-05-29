'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAuth, useIsAdminReady } from '@/hooks/useAuth';

export function AdminGuard({ children }: { children: ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const { isLoading, authStep } = useAuth();
	const { isReady } = useIsAdminReady();

	useEffect(() => {
		if (isLoading) return;

		if (authStep === 'mfa' || !isReady) {
			const redirect = encodeURIComponent(pathname);
			router.replace(`/admin/login?redirect=${redirect}`);
		}
	}, [authStep, isLoading, isReady, pathname, router]);

	if (isLoading) {
		return (
			<section className='mx-auto w-full max-w-4xl px-4 py-10 sm:px-6'>
				<p className='text-text-secondary'>Checking session…</p>
			</section>
		);
	}

	if (authStep === 'mfa' || !isReady) {
		return null;
	}

	return children;
}
