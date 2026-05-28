import { NavLink } from 'react-router-dom';

const navLinkBaseClassName =
	'rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

export function SiteHeader() {
	return (
		<header>
			<div className='mx-auto flex w-full max-w-6xl items-center justify-end px-4 py-4 sm:px-6'>
				<nav className='flex gap-2'>
					<NavLink
						to='/'
						className={({ isActive }) =>
							`${navLinkBaseClassName} ${
								isActive ? 'bg-accent/20 text-accent' : (
									'text-text-secondary hover:bg-panel-muted hover:text-text-primary'
								)
							}`
						}>
						Home
					</NavLink>
					<NavLink
						to='/blog'
						className={({ isActive }) =>
							`${navLinkBaseClassName} ${
								isActive ? 'bg-accent/20 text-accent' : (
									'text-text-secondary hover:bg-panel-muted hover:text-text-primary'
								)
							}`
						}>
						Blog
					</NavLink>
				</nav>
			</div>
		</header>
	);
}
