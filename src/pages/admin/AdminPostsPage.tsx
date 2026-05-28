import { useState } from 'react';
import { Link } from 'react-router-dom';

import { AdminShell } from '../../components/admin/AdminShell';
import { useContent } from '../../hooks/useContent';
import { deleteBlogPost } from '../../lib/content';

export function AdminPostsPage() {
	const { posts, reload } = useContent();
	const [actionError, setActionError] = useState<string | null>(null);

	const handleDelete = async (id: string, title: string) => {
		if (!window.confirm(`Delete post "${title}"?`)) return;
		setActionError(null);
		try {
			await deleteBlogPost(id);
			await reload();
		} catch (error) {
			setActionError(error instanceof Error ? error.message : 'Delete failed');
		}
	};

	return (
		<AdminShell title='Blog posts'>
			{actionError ?
				<p className='mb-4 text-sm text-red-400' role='alert'>
					{actionError}
				</p>
			:	null}

			<Link
				to='/admin/posts/new'
				className='mb-6 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-soft'>
				New post
			</Link>

			<ul className='space-y-3'>
				{posts.map(post => (
					<li key={post.id} className='flex flex-wrap items-center justify-between gap-3 rounded-xl bg-panel p-4'>
						<div>
							<p className='font-medium text-text-primary'>{post.title}</p>
							<p className='text-sm text-text-muted'>
								{post.id} · {post.publishedAt}
							</p>
						</div>
						<div className='flex gap-2'>
							<Link to={`/admin/posts/${post.id}`} className='text-sm text-accent hover:text-accent-soft'>
								Edit
							</Link>
							<button
								type='button'
								onClick={() => void handleDelete(post.id, post.title)}
								className='text-sm text-red-400 hover:text-red-300'>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</AdminShell>
	);
}
