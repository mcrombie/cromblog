import type { Metadata } from "next";

import { ProjectPage } from "@/components/project-page";
import { projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Archivist"
};

export default function ArchivistPage() {
  return <ProjectPage project={projects.archivist} />;
}

