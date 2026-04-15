import Link from "next/link";

import type { Project } from "@/content/site";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-card">
      <div className="flex flex-wrap items-center gap-3 text-sm text-pine-700">
        <span>{project.type}</span>
        <span className="h-1 w-1 rounded-full bg-pine-400" />
        <span>{project.status}</span>
      </div>
      <div className="mt-4 content-flow">
        <h2 className="font-serif text-2xl text-ink">{project.title}</h2>
        <p className="text-base leading-8 text-pine-700">{project.summary}</p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="max-w-xl text-sm leading-7 text-pine-700">
          {project.focus}
        </p>
        <Link
          href={project.href}
          className="rounded-full border border-pine-700 px-4 py-2 text-sm text-pine-800 transition hover:bg-pine-800 hover:text-pine-50"
        >
          View project
        </Link>
      </div>
    </article>
  );
}

