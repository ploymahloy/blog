import { Link } from 'react-router-dom';

import { AdminShell } from '../../components/admin/AdminShell';
import { useContent } from '../../hooks/useContent';

export function AdminDashboardPage() {
	const { projects, posts } = useContent();

	return (
		<AdminShell title='Dashboard'>
			<div className='grid gap-4 sm:grid-cols-2'>
				<Link to='/admin/projects' className='rounded-xl bg-panel p-6 transition-colors hover:bg-panel-muted'>
					<p className='text-3xl font-semibold text-text-primary'>{projects.length}</p>
					<p className='mt-1 text-sm text-text-secondary'>Projects</p>
				</Link>
				<Link to='/admin/posts' className='rounded-xl bg-panel p-6 transition-colors hover:bg-panel-muted'>
					<p className='text-3xl font-semibold text-text-primary'>{posts.length}</p>
					<p className='mt-1 text-sm text-text-secondary'>Blog posts</p>
				</Link>
			</div>
		</AdminShell>
	);
}
