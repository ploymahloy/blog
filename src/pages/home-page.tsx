import { ProjectCard } from "../components/project-card";
import { projects } from "../data/projects";

export function HomePage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm uppercase tracking-wide text-accent">
        Software Engineer Portfolio
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-text-primary sm:text-4xl">
        Featured Projects
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-secondary">
        I build reliable systems and developer-friendly tools. These are selected
        projects that balance product impact with engineering quality.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
