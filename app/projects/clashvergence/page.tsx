import type { Metadata } from "next";

import { ProjectPage } from "@/components/project-page";
import { projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Clashvergence"
};

export default function ClashvergencePage() {
  return <ProjectPage project={projects.clashvergence} />;
}

