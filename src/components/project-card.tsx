import type { Project } from "../types/content";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-panel-border bg-panel p-5 shadow-soft transition-transform duration-200 hover:-translate-y-0.5">
      <p className="text-xs font-medium uppercase tracking-wide text-accent">
        Featured Project
      </p>
      <h3 className="mt-2 text-xl font-semibold text-text-primary">
        {project.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        {project.summary}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        {project.featuredReason}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tool) => (
          <li
            key={tool}
            className="rounded-full border border-panel-border bg-panel-muted px-2.5 py-1 text-xs text-text-secondary"
          >
            {tool}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-4 text-sm">
        <a
          href={project.repoUrl}
          className="text-accent hover:text-accent-soft"
          target="_blank"
          rel="noreferrer"
        >
          Repository
        </a>
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            className="text-accent hover:text-accent-soft"
            target="_blank"
            rel="noreferrer"
          >
            Live Demo
          </a>
        ) : null}
      </div>
    </article>
  );
}
