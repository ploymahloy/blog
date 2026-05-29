'use client';

import Link from 'next/link';

import { AdminShell } from '@/components/admin/AdminShell';
import { useAdminContent } from '@/hooks/useAdminContent';

export default function AdminDashboardPage() {
	const { projects, posts } = useAdminContent();

	return (
		<AdminShell title='Dashboard'>
			<div className='grid gap-4 sm:grid-cols-2'>
				<Link href='/admin/projects' className='rounded-xl bg-panel p-6 transition-colors hover:bg-panel-muted'>
					<p className='text-3xl font-semibold text-text-primary'>{projects.length}</p>
					<p className='mt-1 text-sm text-text-secondary'>Projects</p>
				</Link>
				<Link href='/admin/posts' className='rounded-xl bg-panel p-6 transition-colors hover:bg-panel-muted'>
					<p className='text-3xl font-semibold text-text-primary'>{posts.length}</p>
					<p className='mt-1 text-sm text-text-secondary'>Blog posts</p>
				</Link>
			</div>
		</AdminShell>
	);
}
