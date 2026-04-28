export type ProjectSlug = "react-chess" | "polity";

export type Project = {
  slug: ProjectSlug;
  title: string;
  href: string;
  summary: string;
};

export const siteMeta = {
  title: "Michael Crombie",
  description: "Personal site for writing, projects, and Cromblog."
};

export const projectOrder: ProjectSlug[] = ["react-chess", "polity"];

export const projects: Record<ProjectSlug, Project> = {
  "react-chess": {
    slug: "react-chess",
    title: "React-Chess",
    href: "/projects/react-chess",
    summary: "Full implementation of the React chess app."
  },
  "polity": {
    slug: "polity",
    title: "The Root of Civilization",
    href: "/projects/polity",
    summary: "An interactive essay about the origins of agriculture and civilization."
  }
};
