import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { projectOrder, projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects"
};

export default function ProjectsPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Projects"
        title="Projects"
        description="Current project list."
      />

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-card sm:p-8">
        <ul className="content-flow">
          {projectOrder.map(slug => {
            const project = projects[slug];
            return (
              <li key={slug}>
                <Link
                  href={project.href}
                  className="text-base text-pine-800 underline decoration-pine-400 underline-offset-4 hover:text-pine-950"
                >
                  {project.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
