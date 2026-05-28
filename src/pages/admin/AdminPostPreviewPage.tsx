import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';

import { PostArticle } from '../../components/PostArticle';
import { AdminShell } from '../../components/admin/AdminShell';
import { useContent } from '../../hooks/useContent';
import { upsertBlogPost } from '../../lib/content';
import { getAdminPostEditorPath, isAdminPostDraftState, validatePostDraft } from './admin-post-state';

export function AdminPostPreviewPage() {
	const { id: routeId } = useParams<{ id: string }>();
	const location = useLocation();
	const navigate = useNavigate();
	const { reload } = useContent();

	const [error, setError] = useState<string | null>(null);
	const [isPublishing, setIsPublishing] = useState(false);

	if (!routeId) {
		return <Navigate to='/admin/posts' replace />;
	}

	const draftState = isAdminPostDraftState(location.state) ? location.state : null;

	if (!draftState) {
		return <Navigate to={getAdminPostEditorPath(routeId)} replace />;
	}

	const post = draftState.post;
	const editorPath = getAdminPostEditorPath(routeId);
	const backLink = { to: editorPath, label: '← Back to edit', state: draftState };

	const handlePublish = async () => {
		setError(null);

		const validationError = validatePostDraft(post);
		if (validationError) {
			setError(validationError);
			return;
		}

		setIsPublishing(true);
		try {
			await upsertBlogPost(post);
			await reload();
			navigate('/admin/posts');
		} catch (publishError) {
			setError(publishError instanceof Error ? publishError.message : 'Failed to publish post');
		} finally {
			setIsPublishing(false);
		}
	};

	return (
		<AdminShell title='Preview post' backLink={backLink}>
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
						to={editorPath}
						state={draftState}
						className='rounded-md px-4 py-2 text-sm text-text-secondary hover:bg-panel-muted hover:text-text-primary'>
						Edit
					</Link>
				</div>
			</div>
		</AdminShell>
	);
}
