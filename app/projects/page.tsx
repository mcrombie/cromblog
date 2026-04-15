import type { Metadata } from "next";

import { ProjectCard } from "@/components/project-card";
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
        title="A growing body of long-form work."
        description="These projects move at different speeds, but they share an interest in systems, interpretation, and the kinds of questions that become richer when they are allowed to take their time."
      />

      <section className="grid gap-6">
        {projectOrder.map((slug) => (
          <ProjectCard key={slug} project={projects[slug]} />
        ))}
      </section>
    </div>
  );
}

