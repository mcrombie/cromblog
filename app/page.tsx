import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { aboutBlurb, homeSections, projects } from "@/content/site";

const featuredProject = projects.clashvergence;

export default function HomePage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Portfolio"
        title="A quiet place for durable work."
        description="Cromblog gathers software, historical inquiry, and long-form projects in a space designed to feel calm, readable, and built for attention."
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
            Featured project
          </p>
          <div className="mt-4 content-flow">
            <h2 className="font-serif text-3xl text-ink sm:text-4xl">
              {featuredProject.title}
            </h2>
            <div className="flex flex-wrap gap-3 text-sm text-pine-700">
              <span>{featuredProject.type}</span>
              <span className="h-1 w-1 self-center rounded-full bg-pine-400" />
              <span>{featuredProject.status}</span>
            </div>
            <p className="editorial-copy text-base leading-8 text-pine-800">
              {featuredProject.summary}
            </p>
            <p className="editorial-copy text-sm leading-7 text-pine-700">
              {featuredProject.focus}
            </p>
            <div className="pt-2">
              <Link
                href={featuredProject.href}
                className="inline-flex rounded-full border border-pine-800 bg-pine-800 px-5 py-3 text-sm text-pine-50 transition hover:bg-pine-700"
              >
                View project
              </Link>
            </div>
          </div>
        </div>

        <aside className="rounded-3xl border border-[color:var(--border)] bg-white/70 p-6 shadow-card sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
            About
          </p>
          <p className="mt-4 text-base leading-8 text-pine-800">{aboutBlurb}</p>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-[color:var(--border)] bg-white/70 p-6 shadow-card sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
            Orientation
          </p>
          <div className="mt-4 content-flow editorial-copy">
            {homeSections.map((section) => (
              <p key={section} className="text-base leading-8 text-pine-800">
                {section}
              </p>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[color:var(--border)] bg-pine-50/70 p-6 shadow-card sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
            Project index
          </p>
          <div className="mt-5 space-y-4">
            {Object.values(projects).map((project) => (
              <div
                key={project.slug}
                className="rounded-2xl border border-[color:var(--border)] bg-white/60 p-4"
              >
                <p className="font-serif text-xl text-ink">{project.title}</p>
                <p className="mt-2 text-sm leading-7 text-pine-700">
                  {project.summary}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <ProjectCard project={featuredProject} />
    </div>
  );
}

