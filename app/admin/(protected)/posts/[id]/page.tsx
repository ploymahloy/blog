'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AdminShell } from '@/components/admin/AdminShell';
import { BlockBuilder } from '@/components/admin/BlockBuilder';
import { loadAdminPostDraft, saveAdminPostDraft } from '@/lib/admin-draft-storage';
import {
	buildPostFromForm,
	getAdminPostPreviewPath,
	validatePostDraft
} from '@/lib/admin-post-state';
import { fetchPostById } from '@/lib/content';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAdminPostRouteId } from '@/hooks/useAdminPostRouteId';
import type { ArticleBlock, BlogPost } from '@/types/content';

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

export default function AdminPostEditorPage() {
	const routeId = useAdminPostRouteId();
	const isNew = routeId === 'new';
	const router = useRouter();

	const [post, setPost] = useState<BlogPost>(emptyPost);
	const [tagsText, setTagsText] = useState('');
	const [isFetchingExisting, setIsFetchingExisting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPreviewing, setIsPreviewing] = useState(false);

	useEffect(() => {
		if (!routeId) return;

		const draft = loadAdminPostDraft(routeId);
		if (draft) {
			const matchesRoute = isNew || draft.id === routeId;
			if (matchesRoute) {
				setPost(draft);
				setTagsText(draft.tags.join(', '));
				setError(null);
			}
		}

		if (isNew) return;

		if (draft) return;

		let cancelled = false;

		const load = async () => {
			setIsFetchingExisting(true);
			setError(null);
			try {
				const supabase = createSupabaseBrowserClient();
				const loaded = await fetchPostById(supabase, routeId);
				if (cancelled) return;
				if (!loaded) {
					setError('Post not found');
					return;
				}
				setPost(loaded);
				setTagsText(loaded.tags.join(', '));
			} catch (loadError) {
				if (!cancelled) {
					setError(loadError instanceof Error ? loadError.message : 'Failed to load post');
				}
			} finally {
				if (!cancelled) setIsFetchingExisting(false);
			}
		};

		void load();

		return () => {
			cancelled = true;
		};
	}, [isNew, routeId]);

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
		saveAdminPostDraft(routeId, builtPost);
		router.push(getAdminPostPreviewPath(routeId));
		setIsPreviewing(false);
	};

	const shellTitle = isNew ? 'New post' : 'Edit post';
	const isPageLoading = !routeId || (!isNew && isFetchingExisting);

	if (isPageLoading) {
		return (
			<AdminShell title={shellTitle} backHref='/admin/posts' backLabel='← Back to posts'>
				<p className='text-text-secondary'>Loading…</p>
			</AdminShell>
		);
	}

	return (
		<AdminShell title={shellTitle} backHref='/admin/posts' backLabel='← Back to posts'>
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
