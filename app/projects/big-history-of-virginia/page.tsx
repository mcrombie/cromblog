import type { Metadata } from "next";

import { ProjectPage } from "@/components/project-page";
import { projects } from "@/content/site";

export const metadata: Metadata = {
  title: "A Big History of Virginia"
};

export default function BigHistoryOfVirginiaPage() {
  return <ProjectPage project={projects["big-history-of-virginia"]} />;
}
