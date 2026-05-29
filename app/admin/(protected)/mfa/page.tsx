'use client';

import { AdminShell } from '@/components/admin/AdminShell';
import { useMfaFactors } from '@/hooks/useMfaFactors';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useState } from 'react';

const supabase = createSupabaseBrowserClient();

export default function AdminMfaPage() {
	const { verifiedFactors, error: factorsError, reloadFactors } = useMfaFactors();
	const [qrCode, setQrCode] = useState<string | null>(null);
	const [factorId, setFactorId] = useState<string | null>(null);
	const [verifyCode, setVerifyCode] = useState('');
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isEnrolling, setIsEnrolling] = useState(false);

	const startEnroll = async () => {
		setIsEnrolling(true);
		setError(null);
		setMessage(null);

		const { data, error: enrollError } = await supabase.auth.mfa.enroll({
			factorType: 'totp',
			friendlyName: 'Authenticator app'
		});

		setIsEnrolling(false);

		if (enrollError) {
			setError(enrollError.message);
			return;
		}

		setQrCode(data.totp.qr_code);
		setFactorId(data.id);
		setMessage('Scan the QR code with your authenticator app, then enter the code below.');
	};

	const confirmEnroll = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!factorId) return;

		setError(null);
		const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
		if (challengeError) {
			setError(challengeError.message);
			return;
		}

		const { error: verifyError } = await supabase.auth.mfa.verify({
			factorId,
			challengeId: challengeData.id,
			code: verifyCode.trim()
		});

		if (verifyError) {
			setError(verifyError.message);
			return;
		}

		setMessage('MFA enrolled successfully. You will need your authenticator code on future sign-ins.');
		setQrCode(null);
		setFactorId(null);
		setVerifyCode('');
		await reloadFactors();
	};

	const displayError = error ?? factorsError;

	return (
		<AdminShell title='Multi-factor authentication'>
			<p className='text-sm text-text-secondary'>
				Enroll an authenticator app (Google Authenticator, 1Password, etc.) for admin sign-in.
			</p>

			{verifiedFactors.length > 0 ?
				<div className='mt-4 rounded-xl bg-panel p-4'>
					<p className='text-sm text-text-primary font-medium'>Enrolled factors</p>
					<ul className='mt-2 list-disc pl-5 text-sm text-text-secondary'>
						{verifiedFactors.map(name => (
							<li key={name}>{name}</li>
						))}
					</ul>
				</div>
			:	null}

			{!factorId ?
				<button
					type='button'
					onClick={() => void startEnroll()}
					disabled={isEnrolling}
					className='mt-6 rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-soft disabled:opacity-50'>
					{isEnrolling ? 'Starting…' : verifiedFactors.length ? 'Enroll another device' : 'Enroll authenticator'}
				</button>
			:	null}

			{qrCode ?
				<div className='mt-6 space-y-4 rounded-xl bg-panel p-4'>
					<img src={qrCode} alt='TOTP QR code' className='mx-auto h-48 w-48 bg-white p-2' />
					<form onSubmit={event => void confirmEnroll(event)} className='space-y-3'>
						<label htmlFor='enroll-code' className='block text-sm text-text-secondary'>
							Verification code
						</label>
						<input
							id='enroll-code'
							type='text'
							inputMode='numeric'
							maxLength={6}
							value={verifyCode}
							onChange={event => setVerifyCode(event.target.value)}
							className='w-full max-w-xs rounded-lg bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
						/>
						<button
							type='submit'
							disabled={verifyCode.length < 6}
							className='rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-soft disabled:opacity-50'>
							Confirm enrollment
						</button>
					</form>
				</div>
			:	null}

			{message ?
				<p className='mt-4 text-sm text-accent'>{message}</p>
			:	null}
			{displayError ?
				<p className='mt-4 text-sm text-red-400' role='alert'>
					{displayError}
				</p>
			:	null}
		</AdminShell>
	);
}
