import { getStackIcon } from '@/lib/stack-icons';
import type { Project } from '@/types/content';

interface ProjectCardProps {
	project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
	const inProgress = project.inProgress ?? false;

	return (
		<div
			className='relative overflow-hidden rounded-xl'
			aria-label={inProgress ? `${project.title} (in progress)` : undefined}>
			<article className='relative flex h-full flex-col rounded-xl border border-panel-border bg-panel p-6 shadow-soft text-center sm:p-5'>
				<h3 className='text-xl font-semibold text-text-primary'>{project.title}</h3>
				<div className='grow'>
					<p className='mt-3 text-sm leading-relaxed text-text-secondary'>{project.summary}</p>
				</div>
				<ul className='mx-auto mt-5 flex w-fit flex-wrap justify-center gap-2.5'>
					{project.stack.map(key => {
						const entry = getStackIcon(key);
						const label = entry?.label ?? key;
						const Icon = entry?.icon;

						return (
							<li
								key={key}
								title={label}
								aria-label={label}
								className='px-2.5 py-1 text-text-secondary'>
								{Icon ?
									<Icon className='size-6 sm:size-8' aria-hidden />
									: <span className='text-xs'>{key}</span>}
							</li>
						);
					})}
				</ul>
				<div className='mx-auto mt-6 flex gap-4 text-sm'>
					<a href={project.repoUrl} className='text-accent hover:text-accent-soft' target='_blank' rel='noreferrer'>
						Repository
					</a>
					{project.liveUrl ?
						<a href={project.liveUrl} className='text-accent hover:text-accent-soft' target='_blank' rel='noreferrer'>
							Live Demo
						</a>
						: null}
				</div>
				{inProgress ?
					<div className='absolute top-4 right-4 sm:top-5 sm:right-5'>
						<p className='text-xs text-text-muted'>[Currently in development]</p>
					</div>
					: null}
			</article>
		</div>
	);
}
