'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AdminShell } from '@/components/admin/AdminShell';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';
import { useAdminContent } from '@/hooks/useAdminContent';
import { useAdminPostRouteId } from '@/hooks/useAdminPostRouteId';
import { publishBlogPostAction } from '@/lib/actions/admin-content';
import { buildPostFromForm, validatePostDraft } from '@/lib/admin-post-state';
import { clearAdminPostDraft, loadAdminPostDraft, saveAdminPostDraft } from '@/lib/admin-draft-storage';
import { fetchPostById } from '@/lib/content';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { BlogPost } from '@/types/content';

const inputClassName =
	'w-full rounded-lg bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

const emptyPost = (): BlogPost => ({
	id: '',
	title: '',
	summary: '',
	publishedAt: new Date().toISOString().slice(0, 10),
	readTime: '5 min read',
	tags: [],
	content: ''
});

export default function AdminPostEditorPage() {
	const routeId = useAdminPostRouteId();
	const isNew = routeId === 'new';
	const router = useRouter();
	const { reload } = useAdminContent();

	const [post, setPost] = useState<BlogPost>(emptyPost);
	const [tagsText, setTagsText] = useState('');
	const [isFetchingExisting, setIsFetchingExisting] = useState(false);
	const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPublishing, setIsPublishing] = useState(false);

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

		if (isNew) {
			setHasLoadedInitial(true);
			return;
		}

		if (draft) {
			setHasLoadedInitial(true);
			return;
		}

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
				if (!cancelled) {
					setIsFetchingExisting(false);
					setHasLoadedInitial(true);
				}
			}
		};

		void load();

		return () => {
			cancelled = true;
		};
	}, [isNew, routeId]);

	useEffect(() => {
		if (!routeId || !hasLoadedInitial) return;

		const timeoutId = window.setTimeout(() => {
			saveAdminPostDraft(routeId, buildPostFromForm(post, tagsText));
		}, 300);

		return () => window.clearTimeout(timeoutId);
	}, [hasLoadedInitial, post, routeId, tagsText]);

	const handlePublish = async (event: React.FormEvent) => {
		event.preventDefault();
		setError(null);

		const builtPost = buildPostFromForm(post, tagsText);
		const validationError = validatePostDraft(builtPost);
		if (validationError) {
			setError(validationError);
			return;
		}

		if (!routeId) return;

		setIsPublishing(true);
		try {
			await publishBlogPostAction(builtPost);
			clearAdminPostDraft(routeId, builtPost.id);
			await reload();
			router.replace('/admin/posts');
		} catch (publishError) {
			setError(publishError instanceof Error ? publishError.message : 'Failed to publish post');
		} finally {
			setIsPublishing(false);
		}
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
			<form onSubmit={event => void handlePublish(event)} className='space-y-6 rounded-xl bg-panel p-6'>
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

				<MarkdownEditor value={post.content} onChange={content => setPost(current => ({ ...current, content }))} />

				{error ?
					<p className='text-sm text-red-400' role='alert'>
						{error}
					</p>
				:	null}

				<button
					type='submit'
					disabled={isPublishing}
					className='rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-soft disabled:opacity-50'>
					{isPublishing ? 'Publishing…' : 'Publish'}
				</button>
			</form>
		</AdminShell>
	);
}
