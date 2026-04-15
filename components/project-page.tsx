import { SectionHeading } from "@/components/section-heading";
import type { Project } from "@/content/site";

type ProjectPageProps = {
  project: Project;
};

export function ProjectPage({ project }: ProjectPageProps) {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow={project.status}
        title={project.title}
        description={project.summary}
      />
      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-card sm:p-8">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm uppercase tracking-[0.18em] text-pine-700">
              Project type
            </dt>
            <dd className="mt-2 text-lg text-ink">{project.type}</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-[0.18em] text-pine-700">
              Current focus
            </dt>
            <dd className="mt-2 text-lg leading-8 text-ink">{project.focus}</dd>
          </div>
        </dl>
      </section>
      <section className="editorial-copy rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="content-flow">
          {project.body.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-pine-800">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

