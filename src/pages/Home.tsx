import { ProjectCard } from '../components/Card';
import { SocialLinks } from '../components/SocialLinks';
import { projects } from '../data/projects';

export function HomePage() {
	return (
		<section className='mx-auto w-full max-w-6xl px-4 py-10 md:px-6'>
			<p className='text-5xl font-semibold text-center text-text-primary md:text-7xl'>Patrick Mahloy</p>
			<p className='mt-1 text-xl uppercase tracking-wide text-accent text-center'>Software Engineer</p>
			<SocialLinks className='mt-3' />
			<p className='my-4 text-text-secondary text-center whitespace-pre-line'>
				&quot;Born to ship...forced to estimate story points.&quot;
			</p>
			<h1 className='mt-4 md:mt-2 text-3xl font-semibold text-text-primary md:text-4xl text-center md:text-left'>
				Featured Projects
			</h1>
			<div className='mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
				{projects.map(project => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
		</section>
	);
}
