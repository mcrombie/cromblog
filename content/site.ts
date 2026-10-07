import type { BlogSeriesSlug } from "@/content/blog";
import { archivistArt } from "@/content/archivist-art";
import { gameArt } from "@/content/game-art";

export type ProjectSlug =
  | "azhora"
  | "big-history-of-virginia"
  | "archivist"
  | "doodle-lab"
  | "crombot-one"
  | "clio"
  | "cromonsters"
  | "clashvergence"
  | "phoneme-chart"
  | "world-builder"
  | "react-chess"
  | "polity"
  | "pomodoro-clock"
  | "stardate-valley";

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

/** The Projects page's tabs: every project sits in exactly one. */
export type ProjectCategory = "apps" | "art" | "books" | "games";
export const projectCategories: readonly { id: ProjectCategory; label: string }[] = [
  { id: "apps", label: "Apps" },
  { id: "art", label: "Art" },
  { id: "books", label: "Books" },
  { id: "games", label: "Games" }
];

export type Project = {
  slug: ProjectSlug;
  category: ProjectCategory;
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
  description:
    "Software, essays, simulations, history, and imagined worlds by Michael Crombie."
};

function configuredHttpsUrl(value: string | undefined) {
  const candidate = value?.trim();
  if (!candidate) {
    return undefined;
  }

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:") {
      return undefined;
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

// The public demo is live, so it is the default. NEXT_PUBLIC_ARCHIVIST_URL
// still overrides it when a build should point somewhere else.
const archivistDemoFallbackUrl = "https://archivist.mcrombie.com";

export const archivistDemoUrl =
  configuredHttpsUrl(process.env.NEXT_PUBLIC_ARCHIVIST_URL) ??
  archivistDemoFallbackUrl;

export const projectOrder: ProjectSlug[] = [
  "azhora",
  "big-history-of-virginia",
  "archivist",
  "doodle-lab",
  "crombot-one",
  "clio",
  "cromonsters",
  "stardate-valley",
  "clashvergence",
  "phoneme-chart",
  "world-builder",
  "react-chess",
  "polity",
  "pomodoro-clock"
];

export const projects: Record<ProjectSlug, Project> = {
  azhora: {
    slug: "azhora",
    category: "games",
    title: "Azhora",
    pitch:
      "Azhora is a 3D adventure game set on a continent I have been drawing and writing about for years.",
    summary:
      "Walk, ride, and fly across a low-poly continent of more than a hundred regions, with towns, quests, skills, and a brewing war between its kingdoms. Built in plain JavaScript with Three.js and Electron, mostly by talking to coding agents, and now being refocused on a five-region campaign sandbox.",
    stack: ["JavaScript", "Three.js", "Electron", "Game design", "Worldbuilding"],
    // Rendered from the game: Minora with the mountains behind it (the Azhora II post's thumbnail).
    image: {
      src: "/cromblog/azhora-ii/minora.jpg",
      alt: "The white-walled city of Minora and its Guild tower in Azhora, with mountains rising behind it.",
      width: 1920,
      height: 1080
    },
    links: [
      { label: "Play Azhora", href: "/games/azhora" },
      { label: "Watch the demos", href: "/cromblog/azhora-ii#demo" },
      { label: "Explore the map", href: "/game-azhora-map" },
      { label: "View GitHub repo", href: "https://github.com/mcrombie/azhora-game", external: true }
    ],
    blogSeries: "azhora"
  },
  "stardate-valley": {
    slug: "stardate-valley",
    category: "games",
    title: "Stardate Valley",
    pitch: "A farm-life dating spoof: you inherited a farm, and the entire town inherited a crush on you.",
    summary:
      "Grow turnips, fish, and date all eight adult neighbors in this Stardew-inspired spoof, complete with pixel tools, heart events, a foul-mouthed goblin lord, an outrageously flirty Crombot, and a very ambitious polycule potluck. For a quick tour, open Grandpa’s letter and choose “Skip to the flirting.”",
    stack: ["Browser game", "Farming", "Romance", "Pixel art"],
    image: {
      src: "/games/heartwood-valley/assets/village-map.png",
      alt: "Stardate Valley: a pixel-art farm, cottages, flower gardens, and a wooden bridge over a turquoise river",
      width: 1536,
      height: 1024
    },
    links: [{ label: "Play Stardate Valley", href: "/games/heartwood-valley" }]
  },
  "big-history-of-virginia": {
    slug: "big-history-of-virginia",
    category: "books",
    title: "Cradle of the Empire: A Big History of Virginia",
    pitch:
      "Cradle of the Empire is a big history of Virginia, tracing the land and its people from deep geological time through to the present.",
    summary:
      "A four-year history project spanning Virginia's geological formation, deep human history, and political development, published as a standalone book rather than software.",
    stack: ["Research", "Long-form writing", "Editing", "Self-publishing"],
    image: {
      src: "/cromblog/cradle-of-the-empire/cover.jpg",
      alt: "Cover art for Cradle of the Empire: A Big History of Virginia, showing a great oak on a riverbank with tall ships passing on the water beyond",
      width: 1792,
      height: 2688
    },
    links: [
      { label: "Order the ebook", href: "https://www.amazon.com/dp/B0H6VNH94K", external: true },
      { label: "Read the announcement", href: "/cromblog/cradle-of-the-empire" }
    ]
  },
  archivist: {
    slug: "archivist",
    category: "apps",
    title: "Archivist",
    pitch:
      "Archivist turns Cradle of the Empire into a source-grounded conversation with the complete substantive manuscript.",
    summary:
      "A full-stack RAG demonstration built around one published history: conversational follow-ups, premise and absence handling, edition-qualified citations, bounded public excerpts, cost controls, and selectable historiographical framing.",
    stack: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "OpenAI",
      "Chroma",
      "RAG evaluation"
    ],
    image: archivistArt.featured,
    links: [
      {
        label: "Open live demo",
        href: archivistDemoUrl,
        external: true
      },
      {
        label: "View GitHub repo",
        href: "https://github.com/mcrombie/archivist",
        external: true
      }
    ]
  },
  "doodle-lab": {
    slug: "doodle-lab",
    category: "art",
    title: "Doodle Lab",
    pitch:
      "Doodle Lab brings years of notebook drawings into a growing archive and new illustrated worlds.",
    summary:
      "A collection of extracted notebook drawings, from wildlife and botanical studies to imaginary creatures, alongside scenes, collages, and mosaics made with ImageGen from those drawings.",
    stack: ["Drawing", "Art direction", "Digital archiving", "ImageGen"],
    image: {
      src: "/cromblog/doodle-experiments/round-19/the-antler-clearing.png",
      alt: "An antlered deer lowers its head to a shaggy owl in a quiet snowy clearing, touching the offered tip of a wing.",
      width: 1672,
      height: 941
    },
    links: [
      { label: "Explore Doodle Lab", href: "/art" }
    ]
  },
  "crombot-one": {
    slug: "crombot-one",
    category: "apps",
    title: "Crombot One",
    pitch:
      "Crombot One is my first Arduino rover, built from a starter kit to learn the basics of robotics.",
    summary:
      "A hands-on introduction to robotics: a small Arduino rover that responds to infrared commands, ultrasonic echoes, and floor sensors. The project story follows what building and testing it has taught me, with narrated demos.",
    stack: ["Arduino", "Robotics", "Electronics", "Sensor experiments"],
    image: {
      src: "/cromblog/crombot-one/thumbnail-shell-drawing-v1.png",
      alt: "Graphite pencil drawing of Crombot One in his box shell, with an LED matrix, paired ultrasonic sensors, and two wheels",
      width: 1672,
      height: 941
    },
    links: [
      { label: "Read the project story", href: "/cromblog/crombot-one" },
      { label: "Watch the demo", href: "/cromblog/crombot-one/demo-short-landscape-v3.mp4" },
      { label: "View GitHub repo", href: "https://github.com/mcrombie/crombot", external: true }
    ]
  },
  clio: {
    slug: "clio",
    category: "games",
    title: "Clio",
    pitch:
      "Clio is a historical strategy prototype about guiding a small band of people through an unfolding history.",
    summary:
      "A Windows strategy prototype with a guided opening: lead a band of fifty, gather supplies, preview journeys on the map, and discover wildlife. The First Adviser introduces your story and narrates situation reports.",
    stack: ["Game design", "Historical strategy", "Windows desktop", "Prototype"],
    image: gameArt.clio,
    links: [
      { label: "Download Clio for Windows", href: "/games/clio/clio-sage-37-windows.zip" },
      { label: "Read the announcement", href: "/cromblog/clio" },
      { label: "Watch the original demo", href: "/cromblog/clio/clio-demo.mp4" },
      { label: "View GitHub repo", href: "https://github.com/mcrombie/clio", external: true }
    ]
  },
  cromonsters: {
    slug: "cromonsters",
    category: "games",
    title: "Cromonsters",
    pitch:
      "Cromonsters is a growing browser adventure about a farmhand on an imperial estate.",
    summary:
      "Play the estate prologue: learn the farming tasks, survive a goblin raid, and navigate the aftermath through conversations, looting, trade, and turn-based battles. The wider journey is still in development; the original post preserves the earliest playtests.",
    stack: ["TypeScript", "Game design", "Pixel art", "Browser prototype"],
    image: gameArt.cromonsters,
    links: [
      { label: "Play Cromonsters", href: "/games/cromonsters" },
      { label: "Read the development story", href: "/cromblog/cromonsters" },
      { label: "Watch the playtest", href: "/cromblog/cromonsters/cromonsters_test_2.mp4" },
      { label: "View GitHub repo", href: "https://github.com/mcrombie/cromonsters", external: true }
    ]
  },
  "clashvergence": {
    slug: "clashvergence",
    category: "apps",
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
      { label: "Open live demo", href: "/projects/clashvergence-demo" },
      { label: "View GitHub repo", href: "https://github.com/mcrombie/Clashvergence", external: true }
    ],
    blogSeries: "simulating-civilizations"
  },
  "phoneme-chart": {
    slug: "phoneme-chart",
    category: "apps",
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
    category: "apps",
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
    category: "games",
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
    category: "apps",
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
    category: "apps",
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
