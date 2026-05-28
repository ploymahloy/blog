import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

const navClassName = ({ isActive }: { isActive: boolean }) =>
	`rounded-md px-3 py-2 text-sm transition-colors ${
		isActive ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:bg-panel-muted hover:text-text-primary'
	}`;

interface AdminShellProps {
	children: React.ReactNode;
	title: string;
	backLink?: { to: string; label: string; state?: unknown };
}

function getViewSitePath(pathname: string): string {
	if (pathname.startsWith('/admin/posts')) return '/blog';
	if (pathname.startsWith('/admin/projects')) return '/';
	return '/';
}

export function AdminShell({ children, title, backLink }: AdminShellProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const { signOut, user } = useAuth();
	const viewSitePath = getViewSitePath(location.pathname);

	const handleSignOut = async () => {
		await signOut();
		navigate('/admin/login');
	};

	return (
		<section className='mx-auto w-full max-w-5xl px-4 py-10 sm:px-6'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div>
					<p className='text-sm uppercase tracking-wide text-accent'>Admin</p>
					<h1 className='mt-1 text-2xl font-semibold text-text-primary'>{title}</h1>
					{user?.email ?
						<p className='mt-1 text-sm text-text-muted'>{user.email}</p>
					:	null}
				</div>
				<div className='flex flex-wrap items-center gap-2'>
					<nav className='flex gap-1'>
						<NavLink to='/admin' end className={navClassName}>
							Dashboard
						</NavLink>
						<NavLink to='/admin/projects' className={navClassName}>
							Projects
						</NavLink>
						<NavLink to='/admin/posts' className={navClassName}>
							Posts
						</NavLink>
						<NavLink to='/admin/mfa' className={navClassName}>
							MFA
						</NavLink>
					</nav>
					<button
						type='button'
						onClick={() => void handleSignOut()}
						className='rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-panel-muted hover:text-text-primary'>
						Sign out
					</button>
				</div>
			</div>
			<div className='mt-8'>
				{backLink ?
					<Link to={backLink.to} state={backLink.state} className='text-sm text-accent hover:text-accent-soft'>
						{backLink.label}
					</Link>
				:	<Link to={viewSitePath} className='text-sm text-accent hover:text-accent-soft'>
						← View site
					</Link>
				}
			</div>
			<div className='mt-6'>{children}</div>
		</section>
	);
}
