export type ProjectSlug =
  | "clashvergence"
  | "archivist"
  | "big-history-of-virginia"
  | "react-chess";

export type Project = {
  slug: ProjectSlug;
  title: string;
  href: string;
  type: string;
  status: string;
  summary: string;
  focus: string;
  demoHref?: string;
  demoLabel?: string;
  body: string[];
};

export const siteMeta = {
  title: "Cromblog",
  description:
    "A quiet home for software, history, essays, and long-form projects in progress.",
  githubHref: "https://github.com/your-name-here",
  linkedinHref: "https://linkedin.com/in/your-name-here"
};

export const projectOrder: ProjectSlug[] = [
  "clashvergence",
  "react-chess",
  "archivist",
  "big-history-of-virginia"
];

export const projects: Record<ProjectSlug, Project> = {
  clashvergence: {
    slug: "clashvergence",
    title: "Clashvergence",
    href: "/projects/clashvergence",
    type: "Strategy simulation and AI chronicle project",
    status: "Active build",
    summary:
      "A strategy simulation and AI narrative project exploring how civilizations evolve, compete, and reinterpret history through generated chronicles.",
    focus:
      "Current work is centered on simulation clarity, faction identity, and the quality of the chronicles that emerge from each turn.",
    body: [
      "Clashvergence lives at the meeting point of systems design and historical imagination. It asks what happens when long-running strategic play is paired with narrative retellings that treat each outcome as a remembered past rather than a raw scoreboard.",
      "The project is as interested in legibility as it is in scope. The simulation needs to feel intelligible, while the generated history needs to feel grounded enough that it reads like a chronicle instead of a log."
    ]
  },
  "react-chess": {
    slug: "react-chess",
    title: "React-Chess",
    href: "/projects/react-chess",
    type: "Legacy rebuild and modernization case study",
    status: "Playable revamp",
    summary:
      "A modern TypeScript rebuild of an older React chess project, embedded directly into the site as a playable article.",
    focus:
      "The current emphasis is on contrasting a monolithic learning-era implementation with a cleaner engine-first architecture.",
    demoHref: "http://localhost:5173",
    demoLabel: "Play full standalone app",
    body: [
      "React-Chess is useful to me because it makes software growth visible. The original version was earnest, ambitious, and increasingly fragile. The rebuild keeps the game itself intact while changing the shape of the code underneath it.",
      "This page is meant to function as both writeup and artifact. The board below is not a screenshot or a trailer. It is the rebuilt game, running inside the article so the claims about architecture and playability can be tested immediately."
    ]
  },
  archivist: {
    slug: "archivist",
    title: "Archivist",
    href: "/projects/archivist",
    type: "Research tooling and retrieval system",
    status: "Concept and prototyping",
    summary:
      "A domain-aware retrieval system for navigating long-form historical research and manuscript analysis.",
    focus:
      "The present emphasis is on building retrieval that respects chronology, source context, and the texture of manuscript-scale evidence.",
    body: [
      "Archivist is meant to support historical work that unfolds across hundreds of pages and many layers of citation, annotation, and revision. The challenge is not only to find relevant passages, but to preserve why they matter within a larger argument.",
      "Rather than flattening research into disconnected snippets, the aim is to build an interface that keeps chronology, provenance, and interpretive framing visible."
    ]
  },
  "big-history-of-virginia": {
    slug: "big-history-of-virginia",
    title: "A Big History of Virginia",
    href: "/projects/big-history-of-virginia",
    type: "Long-duration history project",
    status: "Ongoing research",
    summary:
      "A long-duration history project tracing Virginia through civilizational, imperial, and global frameworks.",
    focus:
      "The current direction is toward large-scale framing: placing Virginia within Atlantic, continental, and world-historical processes without losing local texture.",
    body: [
      "This project treats Virginia not as an isolated subject but as a node in larger movements of empire, migration, ecology, religion, and political order. The intention is to hold the local and the global in the same frame.",
      "It is a writing project first, but also a method project: an attempt to build a durable way of working across long spans of time without surrendering narrative coherence."
    ]
  }
};

export const aboutBlurb =
  "Cromblog is a personal portfolio for software, historical inquiry, and projects that take time. It is meant to hold working notes, finished pieces, and the longer arcs that rarely fit into fast, transactional corners of the web.";

export const homeSections = [
  "This site is a home for writing, history, software, and long-form work that benefits from patience.",
  "Some projects here are technical, some are interpretive, and some live somewhere between system design and narrative craft."
];
