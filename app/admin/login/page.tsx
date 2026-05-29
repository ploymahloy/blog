import { Suspense } from 'react';

import { AdminLoginForm } from './login-form';

export default function AdminLoginPage() {
	return (
		<Suspense
			fallback={
				<section className='mx-auto w-full max-w-md px-4 py-10 sm:px-6'>
					<p className='text-text-secondary'>Loading…</p>
				</section>
			}>
			<AdminLoginForm />
		</Suspense>
	);
}
