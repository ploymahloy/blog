import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { AdminShell } from '../../components/admin/AdminShell';
import { BlockBuilder } from '../../components/admin/BlockBuilder';
import { fetchPostById } from '../../lib/content';
import type { ArticleBlock, BlogPost } from '../../types/content';
import {
	buildPostFromForm,
	getAdminPostPreviewPath,
	isAdminPostDraftState,
	validatePostDraft
} from './admin-post-state';

const inputClassName =
	'w-full rounded-lg bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

const emptyPost = (): BlogPost => ({
	id: '',
	title: '',
	summary: '',
	publishedAt: new Date().toISOString().slice(0, 10),
	readTime: '5 min read',
	tags: [],
	content: [{ type: 'paragraph', content: '' }]
});

export function AdminPostEditorPage() {
	const { id: routeId } = useParams<{ id: string }>();
	const isNew = routeId === 'new';
	const navigate = useNavigate();
	const location = useLocation();

	const [post, setPost] = useState<BlogPost>(emptyPost);
	const [tagsText, setTagsText] = useState('');
	const [isLoading, setIsLoading] = useState(!isNew);
	const [error, setError] = useState<string | null>(null);
	const [isPreviewing, setIsPreviewing] = useState(false);

	useEffect(() => {
		const draftState = isAdminPostDraftState(location.state) ? location.state : null;
		if (!draftState) return;

		const matchesRoute = isNew || draftState.post.id === routeId;
		if (!matchesRoute) return;

		setPost(draftState.post);
		setTagsText(draftState.post.tags.join(', '));
		setIsLoading(false);
		setError(null);
	}, [isNew, location.state, routeId]);

	useEffect(() => {
		if (isNew) return;
		if (isAdminPostDraftState(location.state)) return;

		const load = async () => {
			if (!routeId) return;
			setIsLoading(true);
			setError(null);
			try {
				const loaded = await fetchPostById(routeId);
				if (!loaded) {
					setError('Post not found');
					return;
				}
				setPost(loaded);
				setTagsText(loaded.tags.join(', '));
			} catch (loadError) {
				setError(loadError instanceof Error ? loadError.message : 'Failed to load post');
			} finally {
				setIsLoading(false);
			}
		};

		void load();
	}, [isNew, location.state, routeId]);

	const handlePreview = (event: React.FormEvent) => {
		event.preventDefault();
		setError(null);

		const builtPost = buildPostFromForm(post, tagsText);
		const validationError = validatePostDraft(builtPost);
		if (validationError) {
			setError(validationError);
			return;
		}

		if (!routeId) return;

		setIsPreviewing(true);
		navigate(getAdminPostPreviewPath(routeId), { state: { post: builtPost } });
		setIsPreviewing(false);
	};

	const shellTitle = isNew ? 'New post' : 'Edit post';
	const postsBackLink = { to: '/admin/posts', label: '← Back to posts' };

	if (isLoading) {
		return (
			<AdminShell title={shellTitle} backLink={postsBackLink}>
				<p className='text-text-secondary'>Loading…</p>
			</AdminShell>
		);
	}

	return (
		<AdminShell title={shellTitle} backLink={postsBackLink}>
			<form onSubmit={handlePreview} className='space-y-6 rounded-xl bg-panel p-6'>
				<div className='grid gap-4 sm:grid-cols-2'>
					<div>
						<label htmlFor='post-id' className='mb-1 block text-sm text-text-secondary'>
							ID (slug)
						</label>
						<input
							id='post-id'
							type='text'
							value={post.id}
							onChange={event => setPost(current => ({ ...current, id: event.target.value }))}
							disabled={!isNew}
							className={inputClassName}
						/>
					</div>
					<div>
						<label htmlFor='post-date' className='mb-1 block text-sm text-text-secondary'>
							Published date
						</label>
						<input
							id='post-date'
							type='date'
							value={post.publishedAt}
							onChange={event => setPost(current => ({ ...current, publishedAt: event.target.value }))}
							className={inputClassName}
						/>
					</div>
				</div>

				<div>
					<label htmlFor='post-title' className='mb-1 block text-sm text-text-secondary'>
						Title
					</label>
					<input
						id='post-title'
						type='text'
						value={post.title}
						onChange={event => setPost(current => ({ ...current, title: event.target.value }))}
						className={inputClassName}
					/>
				</div>

				<div>
					<label htmlFor='post-summary' className='mb-1 block text-sm text-text-secondary'>
						Summary
					</label>
					<textarea
						id='post-summary'
						value={post.summary}
						onChange={event => setPost(current => ({ ...current, summary: event.target.value }))}
						rows={3}
						className={inputClassName}
					/>
				</div>

				<div className='grid gap-4 sm:grid-cols-2'>
					<div>
						<label htmlFor='post-read-time' className='mb-1 block text-sm text-text-secondary'>
							Read time
						</label>
						<input
							id='post-read-time'
							type='text'
							value={post.readTime}
							onChange={event => setPost(current => ({ ...current, readTime: event.target.value }))}
							className={inputClassName}
						/>
					</div>
					<div>
						<label htmlFor='post-tags' className='mb-1 block text-sm text-text-secondary'>
							Tags (comma-separated)
						</label>
						<input id='post-tags' type='text' value={tagsText} onChange={event => setTagsText(event.target.value)} className={inputClassName} />
					</div>
				</div>

				<div>
					<p className='mb-2 text-sm font-medium text-text-secondary'>Content blocks</p>
					<BlockBuilder
						blocks={post.content}
						onChange={(content: ArticleBlock[]) => setPost(current => ({ ...current, content }))}
					/>
				</div>

				{error ?
					<p className='text-sm text-red-400' role='alert'>
						{error}
					</p>
				:	null}

				<button
					type='submit'
					disabled={isPreviewing}
					className='rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-soft disabled:opacity-50'>
					{isPreviewing ? 'Opening preview…' : 'Preview'}
				</button>
			</form>
		</AdminShell>
	);
}
