'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';

const navClassName = (isActive: boolean) =>
	`rounded-md px-3 py-2 text-sm transition-colors ${
		isActive ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:bg-panel-muted hover:text-text-primary'
	}`;

interface AdminShellProps {
	children: React.ReactNode;
	title: string;
	backHref?: string;
	backLabel?: string;
}

function getViewSitePath(pathname: string): string {
	if (pathname.startsWith('/admin/posts')) return '/blog';
	if (pathname.startsWith('/admin/projects')) return '/';
	return '/';
}

export function AdminShell({ children, title, backHref, backLabel }: AdminShellProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { signOut, user } = useAuth();
	const viewSitePath = getViewSitePath(pathname);

	const handleSignOut = async () => {
		await signOut();
		router.replace('/admin/login');
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
						<Link href='/admin' className={navClassName(pathname === '/admin')}>
							Dashboard
						</Link>
						<Link href='/admin/projects' className={navClassName(pathname.startsWith('/admin/projects'))}>
							Projects
						</Link>
						<Link href='/admin/posts' className={navClassName(pathname.startsWith('/admin/posts'))}>
							Posts
						</Link>
						<Link href='/admin/mfa' className={navClassName(pathname.startsWith('/admin/mfa'))}>
							MFA
						</Link>
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
				{backHref && backLabel ?
					<Link href={backHref} className='text-sm text-accent hover:text-accent-soft'>
						{backLabel}
					</Link>
				:	<Link href={viewSitePath} className='text-sm text-accent hover:text-accent-soft'>
						← View site
					</Link>
				}
			</div>
			<div className='mt-6'>{children}</div>
		</section>
	);
}
