import type { ReactNode } from 'react';

import { useContent } from '../hooks/useContent';

interface ContentStatusProps {
	children: ReactNode;
}

export function ContentStatus({ children }: ContentStatusProps) {
	const { isLoading, error } = useContent();

	if (isLoading) {
		return (
			<section className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6'>
				<p className='text-text-secondary'>Loading…</p>
			</section>
		);
	}

	if (error) {
		return (
			<section className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6'>
				<div className='rounded-xl bg-panel p-6'>
					<p className='text-text-primary font-semibold'>Unable to load content</p>
					<p className='mt-2 text-sm text-text-secondary'>{error}</p>
				</div>
			</section>
		);
	}

	return children;
}
