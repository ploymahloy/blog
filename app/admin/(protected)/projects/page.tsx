'use client';

import { useState } from 'react';

import { AdminShell } from '@/components/admin/AdminShell';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { deleteProjectAction, reorderProjectsAction, saveProjectAction } from '@/lib/actions/admin-content';
import { useAdminContent } from '@/hooks/useAdminContent';
import type { Project } from '@/types/content';

export default function AdminProjectsPage() {
	const { projects, reload } = useAdminContent();
	const [editing, setEditing] = useState<Project | 'new' | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);
	const [isReordering, setIsReordering] = useState(false);

	const handleSave = async (project: Project) => {
		await saveProjectAction(project);
		await reload();
		setEditing(null);
	};

	const handleMove = async (id: string, direction: 'up' | 'down') => {
		const index = projects.findIndex(project => project.id === id);
		if (index === -1) return;

		const swapIndex = direction === 'up' ? index - 1 : index + 1;
		if (swapIndex < 0 || swapIndex >= projects.length) return;

		const reordered = [...projects];
		[reordered[index], reordered[swapIndex]] = [reordered[swapIndex], reordered[index]];

		setActionError(null);
		setIsReordering(true);
		try {
			await reorderProjectsAction(reordered.map(project => project.id));
			await reload();
		} catch (error) {
			setActionError(error instanceof Error ? error.message : 'Reorder failed');
		} finally {
			setIsReordering(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm(`Delete project "${id}"?`)) return;
		setActionError(null);
		try {
			await deleteProjectAction(id);
			await reload();
		} catch (error) {
			setActionError(error instanceof Error ? error.message : 'Delete failed');
		}
	};

	return (
		<AdminShell title='Projects'>
			{actionError ?
				<p className='mb-4 text-sm text-red-400' role='alert'>
					{actionError}
				</p>
			:	null}

			{editing ?
				<ProjectForm
					initial={editing === 'new' ? undefined : editing}
					isNew={editing === 'new'}
					onSubmit={handleSave}
					onCancel={() => setEditing(null)}
				/>
			:	<>
					<button
						type='button'
						onClick={() => setEditing('new')}
						className='mb-6 rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-soft'>
						New project
					</button>
					<ul className='space-y-3'>
						{projects.map((project, index) => (
							<li
								key={project.id}
								className='flex flex-wrap items-center justify-between gap-3 rounded-xl bg-panel p-4'>
								<div>
									<p className='font-medium text-text-primary'>{project.title}</p>
									<p className='text-sm text-text-muted'>{project.id}</p>
									{project.inProgress ?
										<p className='mt-1 text-xs font-medium uppercase tracking-wide text-accent'>In progress</p>
									:	null}
								</div>
								<div className='flex flex-wrap gap-2'>
									<button
										type='button'
										disabled={index === 0 || isReordering}
										onClick={() => void handleMove(project.id, 'up')}
										aria-label={`Move ${project.title} up`}
										className='text-sm text-text-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40'>
										Move up
									</button>
									<button
										type='button'
										disabled={index === projects.length - 1 || isReordering}
										onClick={() => void handleMove(project.id, 'down')}
										aria-label={`Move ${project.title} down`}
										className='text-sm text-text-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40'>
										Move down
									</button>
									<button
										type='button'
										onClick={() => setEditing(project)}
										className='text-sm text-accent hover:text-accent-soft'>
										Edit
									</button>
									<button
										type='button'
										onClick={() => void handleDelete(project.id)}
										className='text-sm text-red-400 hover:text-red-300'>
										Delete
									</button>
								</div>
							</li>
						))}
					</ul>
				</>
			}
		</AdminShell>
	);
}
