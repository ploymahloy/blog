'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PostArticle } from '@/components/PostArticle';
import { AdminShell } from '@/components/admin/AdminShell';
import { clearAdminPostDraft } from '@/lib/admin-draft-storage';
import { getAdminPostEditorPath, validatePostDraft } from '@/lib/admin-post-state';
import { publishBlogPostAction } from '@/lib/actions/admin-content';
import { useAdminContent } from '@/hooks/useAdminContent';
import { useAdminPostDraft } from '@/hooks/useAdminPostDraft';
import { useAdminPostRouteId } from '@/hooks/useAdminPostRouteId';

export default function AdminPostPreviewPage() {
	const routeId = useAdminPostRouteId();
	const router = useRouter();
	const { reload } = useAdminContent();
	const { post, hasCheckedStorage } = useAdminPostDraft(routeId);

	const [error, setError] = useState<string | null>(null);
	const [isPublishing, setIsPublishing] = useState(false);

	useEffect(() => {
		if (!hasCheckedStorage || !routeId) return;

		if (!post) {
			router.replace(getAdminPostEditorPath(routeId));
		}
	}, [hasCheckedStorage, post, routeId, router]);

	if (!routeId || !hasCheckedStorage) {
		return (
			<AdminShell title='Preview post'>
				<p className='text-text-secondary'>Loading preview…</p>
			</AdminShell>
		);
	}

	if (!post) {
		return null;
	}

	const editorPath = getAdminPostEditorPath(routeId);

	const handlePublish = async () => {
		setError(null);

		const validationError = validatePostDraft(post);
		if (validationError) {
			setError(validationError);
			return;
		}

		setIsPublishing(true);
		try {
			await publishBlogPostAction(post);
			clearAdminPostDraft(routeId, post.id);
			await reload();
			router.replace('/admin/posts');
		} catch (publishError) {
			setError(publishError instanceof Error ? publishError.message : 'Failed to publish post');
		} finally {
			setIsPublishing(false);
		}
	};

	return (
		<AdminShell title='Preview post' backHref={editorPath} backLabel='← Back to edit'>
			<div className='space-y-6'>
				<p className='rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-text-secondary'>
					Preview — not published yet. Changes go live when you publish.
				</p>

				<div className='max-w-4xl'>
					<PostArticle post={post} />
				</div>

				{error ?
					<p className='text-sm text-red-400' role='alert'>
						{error}
					</p>
				:	null}

				<div className='flex flex-wrap items-center gap-3'>
					<button
						type='button'
						disabled={isPublishing}
						onClick={() => void handlePublish()}
						className='rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-soft disabled:opacity-50'>
						{isPublishing ? 'Publishing…' : 'Publish'}
					</button>
					<Link
						href={editorPath}
						className='rounded-md px-4 py-2 text-sm text-text-secondary hover:bg-panel-muted hover:text-text-primary'>
						Edit
					</Link>
				</div>
			</div>
		</AdminShell>
	);
}
