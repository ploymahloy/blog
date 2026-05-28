import { useState } from 'react';

import { AdminShell } from '../../components/admin/AdminShell';
import { ProjectForm } from '../../components/admin/ProjectForm';
import { useContent } from '../../hooks/useContent';
import { deleteProject, upsertProject } from '../../lib/content';
import type { Project } from '../../types/content';

export function AdminProjectsPage() {
	const { projects, reload } = useContent();
	const [editing, setEditing] = useState<Project | 'new' | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);

	const handleSave = async (project: Project) => {
		await upsertProject(project);
		await reload();
		setEditing(null);
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm(`Delete project "${id}"?`)) return;
		setActionError(null);
		try {
			await deleteProject(id);
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
						{projects.map(project => (
							<li key={project.id} className='flex flex-wrap items-center justify-between gap-3 rounded-xl bg-panel p-4'>
								<div>
									<p className='font-medium text-text-primary'>{project.title}</p>
									<p className='text-sm text-text-muted'>{project.id}</p>
								</div>
								<div className='flex gap-2'>
									<button type='button' onClick={() => setEditing(project)} className='text-sm text-accent hover:text-accent-soft'>
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
