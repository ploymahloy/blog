'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth, useIsAdminReady } from '@/hooks/useAuth';

const inputClassName =
	'w-full rounded-lg bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

export function AdminLoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { authStep, loginError, signInWithPassword, verifyMfaCode, isLoading } = useAuth();
	const { isReady } = useIsAdminReady();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [mfaCode, setMfaCode] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const redirect = searchParams.get('redirect') ?? '/admin';

	useEffect(() => {
		if (!isLoading && isReady) {
			router.replace(redirect);
		}
	}, [isLoading, isReady, router, redirect]);

	if (!isLoading && isReady) {
		return null;
	}

	const handlePasswordSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsSubmitting(true);
		await signInWithPassword(email.trim(), password);
		setIsSubmitting(false);
	};

	const handleMfaSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsSubmitting(true);
		await verifyMfaCode(mfaCode.trim());
		setIsSubmitting(false);
	};

	return (
		<section className='mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center px-4 py-10 sm:px-6'>
			<div className='rounded-xl bg-panel p-6 shadow-soft'>
				<p className='text-sm uppercase tracking-wide text-accent'>Admin</p>
				<h1 className='mt-2 text-2xl font-semibold text-text-primary'>
					{authStep === 'mfa' ? 'Authenticator code' : 'Sign in'}
				</h1>

				{authStep === 'mfa' ?
					<form onSubmit={event => void handleMfaSubmit(event)} className='mt-6 space-y-4'>
						<p className='text-sm text-text-secondary'>Enter the 6-digit code from your authenticator app.</p>
						<div>
							<label htmlFor='mfa-code' className='mb-1 block text-sm text-text-secondary'>
								Code
							</label>
							<input
								id='mfa-code'
								type='text'
								inputMode='numeric'
								autoComplete='one-time-code'
								maxLength={6}
								value={mfaCode}
								onChange={event => setMfaCode(event.target.value)}
								className={inputClassName}
							/>
						</div>
						{loginError ?
							<p className='text-sm text-red-400' role='alert'>
								{loginError}
							</p>
						:	null}
						<button
							type='submit'
							disabled={isSubmitting || mfaCode.length < 6}
							className='w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-soft disabled:opacity-50'>
							{isSubmitting ? 'Verifying…' : 'Verify'}
						</button>
					</form>
				:	<form onSubmit={event => void handlePasswordSubmit(event)} className='mt-6 space-y-4'>
						<div>
							<label htmlFor='admin-email' className='mb-1 block text-sm text-text-secondary'>
								Email
							</label>
							<input
								id='admin-email'
								type='email'
								autoComplete='email'
								value={email}
								onChange={event => setEmail(event.target.value)}
								className={inputClassName}
								required
							/>
						</div>
						<div>
							<label htmlFor='admin-password' className='mb-1 block text-sm text-text-secondary'>
								Password
							</label>
							<input
								id='admin-password'
								type='password'
								autoComplete='current-password'
								value={password}
								onChange={event => setPassword(event.target.value)}
								className={inputClassName}
								required
							/>
						</div>
						{loginError ?
							<p className='text-sm text-red-400' role='alert'>
								{loginError}
							</p>
						:	null}
						<button
							type='submit'
							disabled={isSubmitting}
							className='w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-soft disabled:opacity-50'>
							{isSubmitting ? 'Signing in…' : 'Sign in'}
						</button>
					</form>
				}
			</div>
		</section>
	);
}
