import { ProjectCard } from '@/components/Card';
import { SocialLinks } from '@/components/SocialLinks';
import { getProjects } from '@/lib/content-server';

export default async function HomePage() {
	const projects = await getProjects();

	return (
		<section className='mx-auto w-full max-w-6xl px-8 py-10 pb-12 sm:px-6 sm:py-12'>
			<header className='text-center'>
				<p className='text-4xl font-semibold text-text-primary sm:text-5xl md:text-7xl'>Patrick Mahloy</p>
				<p className='mt-3 text-xl uppercase tracking-wide text-accent'>Software Engineer</p>
				<SocialLinks className='mt-6 justify-center md:-ml-2' />
				<p className='mt-8 hidden max-w-prose text-text-secondary mx-auto sm:block md:mt-10'>
					&quot;Born to ship...forced to estimate story points.&quot;
				</p>
			</header>
			<h1 className='mt-10 text-center text-3xl font-semibold text-text-primary sm:mt-14 md:text-left md:text-4xl'>
				Featured Projects
			</h1>
			<div className='mt-6 grid gap-6 sm:mt-8 sm:gap-4 md:grid-cols-2 xl:grid-cols-3'>
				{projects.map(project => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
		</section>
	);
}
