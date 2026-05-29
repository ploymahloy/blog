'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinkBaseClassName =
	'rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

function navLinkClassName(isActive: boolean) {
	return `${navLinkBaseClassName} ${
		isActive ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:bg-panel-muted hover:text-text-primary'
	}`;
}

export function SiteHeader() {
	const pathname = usePathname();
	const isPostPage = pathname.startsWith('/blog/') && pathname !== '/blog';

	return (
		<header>
			<div className='mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6'>
				<div>
					{isPostPage ?
						<Link
							href='/blog'
							className='rounded-md px-3 py-2 text-sm text-accent transition-colors hover:text-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'>
							Back
						</Link>
					:	null}
				</div>
				<nav className='flex gap-2'>
					<Link href='/' className={navLinkClassName(pathname === '/')}>
						Home
					</Link>
					<Link href='/blog' className={navLinkClassName(pathname === '/blog' || isPostPage)}>
						Blog
					</Link>
				</nav>
			</div>
		</header>
	);
}
