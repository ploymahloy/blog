import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth, useIsAdminReady } from '../../hooks/useAuth';

export function AdminRoute() {
	const { isLoading, authStep } = useAuth();
	const { isReady } = useIsAdminReady();
	const location = useLocation();

	if (isLoading) {
		return (
			<section className='mx-auto w-full max-w-4xl px-4 py-10 sm:px-6'>
				<p className='text-text-secondary'>Checking session…</p>
			</section>
		);
	}

	if (authStep === 'mfa') {
		return <Navigate to='/admin/login' state={{ from: location }} replace />;
	}

	if (!isReady) {
		return <Navigate to='/admin/login' state={{ from: location }} replace />;
	}

	return <Outlet />;
}
