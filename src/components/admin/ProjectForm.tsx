import { useState } from 'react';

import type { Project } from '../../types/content';
import { isValidSlug } from '../../lib/content';

const inputClassName =
	'w-full rounded-lg bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

interface ProjectFormProps {
	initial?: Project;
	isNew?: boolean;
	onSubmit: (project: Project) => Promise<void>;
	onCancel: () => void;
}

export function ProjectForm({ initial, isNew = false, onSubmit, onCancel }: ProjectFormProps) {
	const [id, setId] = useState(initial?.id ?? '');
	const [title, setTitle] = useState(initial?.title ?? '');
	const [summary, setSummary] = useState(initial?.summary ?? '');
	const [stackText, setStackText] = useState(initial?.stack.join(', ') ?? '');
	const [repoUrl, setRepoUrl] = useState(initial?.repoUrl ?? '');
	const [liveUrl, setLiveUrl] = useState(initial?.liveUrl ?? '');
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError(null);

		const slug = id.trim();
		if (!slug || !isValidSlug(slug)) {
			setError('ID must be a kebab-case slug (e.g. my-project-name).');
			return;
		}

		const stack = stackText
			.split(',')
			.map(item => item.trim())
			.filter(Boolean);

		if (!title.trim() || !summary.trim() || !repoUrl.trim() || stack.length === 0) {
			setError('Fill in all required fields and at least one stack item.');
			return;
		}

		setIsSaving(true);
		try {
			await onSubmit({
				id: slug,
				title: title.trim(),
				summary: summary.trim(),
				stack,
				repoUrl: repoUrl.trim(),
				liveUrl: liveUrl.trim() || undefined
			});
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : 'Failed to save project');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<form onSubmit={event => void handleSubmit(event)} className='space-y-4 rounded-xl bg-panel p-6'>
			<div>
				<label htmlFor='project-id' className='mb-1 block text-sm text-text-secondary'>
					ID (slug)
				</label>
				<input
					id='project-id'
					type='text'
					value={id}
					onChange={event => setId(event.target.value)}
					disabled={!isNew}
					className={inputClassName}
				/>
			</div>
			<div>
				<label htmlFor='project-title' className='mb-1 block text-sm text-text-secondary'>
					Title
				</label>
				<input id='project-title' type='text' value={title} onChange={event => setTitle(event.target.value)} className={inputClassName} />
			</div>
			<div>
				<label htmlFor='project-summary' className='mb-1 block text-sm text-text-secondary'>
					Summary
				</label>
				<textarea
					id='project-summary'
					value={summary}
					onChange={event => setSummary(event.target.value)}
					rows={3}
					className={inputClassName}
				/>
			</div>
			<div>
				<label htmlFor='project-stack' className='mb-1 block text-sm text-text-secondary'>
					Stack (comma-separated)
				</label>
				<input id='project-stack' type='text' value={stackText} onChange={event => setStackText(event.target.value)} className={inputClassName} />
			</div>
			<div>
				<label htmlFor='project-repo' className='mb-1 block text-sm text-text-secondary'>
					Repo URL
				</label>
				<input id='project-repo' type='url' value={repoUrl} onChange={event => setRepoUrl(event.target.value)} className={inputClassName} />
			</div>
			<div>
				<label htmlFor='project-live' className='mb-1 block text-sm text-text-secondary'>
					Live URL (optional)
				</label>
				<input id='project-live' type='url' value={liveUrl} onChange={event => setLiveUrl(event.target.value)} className={inputClassName} />
			</div>

			{error ?
				<p className='text-sm text-red-400' role='alert'>
					{error}
				</p>
			:	null}

			<div className='flex gap-3'>
				<button
					type='submit'
					disabled={isSaving}
					className='rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-soft disabled:opacity-50'>
					{isSaving ? 'Saving…' : 'Save project'}
				</button>
				<button type='button' onClick={onCancel} className='rounded-md px-4 py-2 text-sm text-text-secondary hover:bg-panel-muted'>
					Cancel
				</button>
			</div>
		</form>
	);
}
