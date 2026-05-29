export type BlogSlug = "revisiting-roots-of-civilization" | "ai-april" | "make-believe-may" | "simulating-civilizations-ii";

export type BlogPost = {
  slug: BlogSlug;
  title: string;
  href: string;
  date: string;
  updateDates?: string[];
  readTime: string;
  summary: string;
};

export const blogOrder: BlogSlug[] = [
  "simulating-civilizations-ii",
  "make-believe-may",
  "revisiting-roots-of-civilization",
  "ai-april"
];

export const blogPosts: Record<BlogSlug, BlogPost> = {
  "simulating-civilizations-ii": {
    slug: "simulating-civilizations-ii",
    title: "Simulating Civilizations II",
    href: "/cromblog/simulating-civilizations-ii",
    date: "May 29, 2026",
    readTime: "4 min read",
    summary:
      "Building a hex-map World Builder app compatible with Clashvergence — giving each simulated history a more believable stage."
  },
  "make-believe-may": {
    slug: "make-believe-may",
    title: "Make-Believe May",
    href: "/cromblog/make-believe-may",
    date: "May 15, 2026",
    readTime: "5 min read",
    summary:
      "Pivoting from AI coding experiments to fiction writing and fantasy worldbuilding—and asking whether code and language models can help turn specific fictional premises into structured, believable worlds."
  },
  "revisiting-roots-of-civilization": {
    slug: "revisiting-roots-of-civilization",
    title: "Simulating Civilizations",
    href: "/cromblog/revisiting-roots-of-civilization",
    date: "April 29, 2026",
    updateDates: ["April 30th, 2026"],
    readTime: "3 min read",
    summary:
      "Returning to an old civilization-simulation idea with a new AI-assisted system for factions, territories, political economy, and generated histories."
  },
  "ai-april": {
    slug: "ai-april",
    title: "Rebuilding a Chess App in the Age of AI",
    href: "/cromblog/ai-april",
    date: "April 27, 2026",
    readTime: "2 min read",
    summary:
      "Revisiting an old chess app as an exercise in AI-assisted development, and asking what it means when a machine can do in seconds what used to take days."
  }
};
