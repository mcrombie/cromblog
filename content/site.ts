import type { BlogSeriesSlug } from "@/content/blog";

export type ProjectSlug =
  | "clashvergence"
  | "phoneme-chart"
  | "world-builder"
  | "react-chess"
  | "polity"
  | "pomodoro-clock";

export type ProjectLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  unoptimized?: boolean;
};

export type Project = {
  slug: ProjectSlug;
  title: string;
  pitch: string;
  summary: string;
  stack: string[];
  image: ProjectImage;
  links: ProjectLink[];
  blogSeries?: BlogSeriesSlug;
};

export const siteMeta = {
  title: "Michael Crombie",
  description: "Personal site for writing, projects, and Cromblog."
};

export const projectOrder: ProjectSlug[] = [
  "clashvergence",
  "phoneme-chart",
  "world-builder",
  "react-chess",
  "polity",
  "pomodoro-clock"
];

export const projects: Record<ProjectSlug, Project> = {
  "clashvergence": {
    slug: "clashvergence",
    title: "Clashvergence",
    pitch:
      "Clashvergence is a Python civilization simulation that models how factions grow, trade, fracture, and adapt across a map.",
    summary:
      "A simulation engine for emergent political history, with turn-by-turn faction behavior, resources, diplomacy, migration, unrest, technology diffusion, and generated reports.",
    stack: ["Python", "HTML report generation", "JSON", "pytest", "AI-assisted narrative experiments"],
    image: {
      src: "/cromblog/simulating-civilizations-ii/hex-simulation.gif",
      alt: "Animated hex map showing a Clashvergence simulation running on a World Builder map",
      width: 996,
      height: 560,
      unoptimized: true
    },
    links: [
      { label: "View GitHub repo", href: "https://github.com/mcrombie/Clashvergence", external: true }
    ],
    blogSeries: "simulating-civilizations"
  },
  "phoneme-chart": {
    slug: "phoneme-chart",
    title: "Interactive Phoneme Chart",
    pitch:
      "Interactive Phoneme Chart is a TypeScript tool for exploring IPA sounds, language inventories, and constructed phonologies.",
    summary:
      "A rebuilt phonology explorer with IPA consonant and vowel charts, clickable sound details, language-specific inventories, conlang phonology views, and audio playback for many phonemes.",
    stack: ["TypeScript", "HTML", "CSS", "esbuild", "IPA data modeling"],
    image: {
      src: "/phoneme-chart/preview.png",
      alt: "Interactive Phoneme Chart showing an IPA consonant table and language controls",
      width: 1400,
      height: 860
    },
    links: [
      { label: "Open live demo", href: "/projects/phoneme-chart" },
      { label: "View GitHub repo", href: "https://github.com/mcrombie/phoneme-chart", external: true }
    ]
  },
  "world-builder": {
    slug: "world-builder",
    title: "World Builder",
    pitch:
      "World Builder is a hex-map editor for generating, customizing, and exporting maps for worldbuilding and simulation workflows.",
    summary:
      "A React/Electron map tool with terrain painting, generated maps, region metadata, underlay images, rivers, settlements, import/export, and compatibility with Clashvergence.",
    stack: ["React", "TypeScript", "Electron", "Vite", "Tailwind CSS", "Zustand"],
    image: {
      src: "/cromblog/simulating-civilizations-ii/generated-map.png",
      alt: "A randomly generated hex map in World Builder",
      width: 1456,
      height: 818
    },
    links: [
      { label: "Open live demo", href: "/world-builder/index.html" },
      { label: "View GitHub repo", href: "https://github.com/mcrombie/worldwright", external: true }
    ],
    blogSeries: "simulating-civilizations"
  },
  "react-chess": {
    slug: "react-chess",
    title: "React-Chess",
    pitch:
      "React-Chess is a rebuilt chess app with a TypeScript rules engine and a modern React/Vite interface.",
    summary:
      "A legacy chess project rebuilt around legal move generation, check/checkmate handling, castling, en passant, promotion, state normalization, and focused engine tests.",
    stack: ["React", "TypeScript", "Vite", "Vitest", "CSS"],
    image: {
      src: "/chess-gameplay.gif",
      alt: "Animated chess gameplay showing a rebuilt React chess board",
      width: 480,
      height: 480,
      unoptimized: true
    },
    links: [
      { label: "Open live demo", href: "/react-chess/index.html" },
      { label: "View GitHub repo", href: "https://github.com/mcrombie/React-Chess", external: true }
    ],
    blogSeries: "rebuilding-old-apps"
  },
  "polity": {
    slug: "polity",
    title: "The Root of Civilization",
    pitch:
      "The Root of Civilization is an interactive essay about settlement, agriculture, and the first pressure toward complex society.",
    summary:
      "An older interactive simulation project revived as a browser experience, showing populations clustering near favorable geography and developing into settled communities.",
    stack: ["React", "TypeScript", "Vite", "Simulation design", "Interactive writing"],
    image: {
      src: "/cromblog/revisiting-roots/polity-fertile-crescent.gif",
      alt: "Animated Root of Civilization simulation showing settlements forming along rivers",
      width: 900,
      height: 620,
      unoptimized: true
    },
    links: [
      { label: "Open live demo", href: "/polity/index.html" },
      { label: "View GitHub repo", href: "https://github.com/mcrombie/polity", external: true }
    ],
    blogSeries: "simulating-civilizations"
  },
  "pomodoro-clock": {
    slug: "pomodoro-clock",
    title: "Pomodoro Clock",
    pitch:
      "Pomodoro Clock is a focus timer with a lava lamp background that morphs from dark green to red as your session counts down.",
    summary:
      "A rebuilt Pomodoro timer with an SVG progress ring, CSS metaball lava lamp art, dark/light themes, Web Audio API alerts, browser notifications, localStorage persistence, and automatic long-break cycles.",
    stack: ["React", "TypeScript", "Vite", "Web Audio API", "CSS animations"],
    image: {
      src: "/pomodoro-clock/preview.png",
      alt: "Pomodoro Clock showing a 25-minute session timer with a green lava lamp background",
      width: 1280,
      height: 800
    },
    links: [
      { label: "Open live demo", href: "/pomodoro-clock/index.html" }
    ]
  }
};
