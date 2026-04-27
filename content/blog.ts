export type BlogSlug = "ai-april";

export type BlogPost = {
  slug: BlogSlug;
  title: string;
  href: string;
  date: string;
  readTime: string;
  summary: string;
};

export const blogOrder: BlogSlug[] = ["ai-april"];

export const blogPosts: Record<BlogSlug, BlogPost> = {
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
