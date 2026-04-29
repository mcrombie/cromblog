export type BlogSlug = "revisiting-roots-of-civilization" | "ai-april";

export type BlogPost = {
  slug: BlogSlug;
  title: string;
  href: string;
  date: string;
  readTime: string;
  summary: string;
};

export const blogOrder: BlogSlug[] = [
  "revisiting-roots-of-civilization",
  "ai-april"
];

export const blogPosts: Record<BlogSlug, BlogPost> = {
  "revisiting-roots-of-civilization": {
    slug: "revisiting-roots-of-civilization",
    title: "Revisiting the Roots of Civilization",
    href: "/cromblog/revisiting-roots-of-civilization",
    date: "April 29, 2026",
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
