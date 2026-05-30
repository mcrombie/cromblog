export type BlogSlug =
  | "pomodoro-clock"
  | "revisiting-roots-of-civilization"
  | "ai-april"
  | "make-believe-may"
  | "simulating-civilizations-ii"
  | "interactive-phoneme-chart";

export type BlogSeriesSlug = "rebuilding-old-apps" | "simulating-civilizations";

export type BlogSeries = {
  slug: BlogSeriesSlug;
  title: string;
};

export type BlogPostBase = {
  slug: BlogSlug;
  title: string;
  href: string;
  updateDates?: string[];
  readTime: string;
  summary: string;
  series?: BlogSeriesSlug;
};

export type PublishedBlogPost = BlogPostBase & {
  status?: "published";
  date: string;
};

export type DraftBlogPost = BlogPostBase & {
  status: "draft";
};

export type BlogPost = PublishedBlogPost | DraftBlogPost;

export const blogSeriesOrder: BlogSeriesSlug[] = [
  "rebuilding-old-apps",
  "simulating-civilizations"
];

export const blogSeries: Record<BlogSeriesSlug, BlogSeries> = {
  "rebuilding-old-apps": {
    slug: "rebuilding-old-apps",
    title: "Rebuilding Old Apps"
  },
  "simulating-civilizations": {
    slug: "simulating-civilizations",
    title: "Simulating Civilizations"
  }
};

export const blogOrder: BlogSlug[] = [
  "pomodoro-clock",
  "interactive-phoneme-chart",
  "simulating-civilizations-ii",
  "make-believe-may",
  "revisiting-roots-of-civilization",
  "ai-april"
];

export const blogPosts = {
  "pomodoro-clock": {
    slug: "pomodoro-clock",
    title: "Rebuilding a Pomodoro Clock",
    href: "/cromblog/pomodoro-clock",
    status: "draft",
    readTime: "3 min read",
    series: "rebuilding-old-apps",
    summary:
      "A draft on revisiting an old FreeCodeCamp Pomodoro timer: preserving the charm of the original clock, naming the technical debt, and preparing a cleaner rebuild."
  },
  "interactive-phoneme-chart": {
    slug: "interactive-phoneme-chart",
    title: "Rebuilding an Interactive Phoneme Chart",
    href: "/cromblog/interactive-phoneme-chart",
    status: "draft",
    readTime: "3 min read",
    series: "rebuilding-old-apps",
    summary:
      "A draft on revisiting an early IPA chart project: preserving the original idea, naming its rough edges, and preparing to turn it into a better language-learning tool."
  },
  "simulating-civilizations-ii": {
    slug: "simulating-civilizations-ii",
    title: "Simulating Civilizations II",
    href: "/cromblog/simulating-civilizations-ii",
    date: "May 29, 2026",
    readTime: "4 min read",
    series: "simulating-civilizations",
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
    series: "simulating-civilizations",
    summary:
      "Returning to an old civilization-simulation idea with a new AI-assisted system for factions, territories, political economy, and generated histories."
  },
  "ai-april": {
    slug: "ai-april",
    title: "Rebuilding a Chess App in the Age of AI",
    href: "/cromblog/ai-april",
    date: "April 27, 2026",
    readTime: "2 min read",
    series: "rebuilding-old-apps",
    summary:
      "Revisiting an old chess app as an exercise in AI-assisted development, and asking what it means when a machine can do in seconds what used to take days."
  }
} satisfies Record<BlogSlug, BlogPost>;

export function isPublishedPost(post: BlogPost): post is PublishedBlogPost {
  return post.status !== "draft";
}

export function isDraftPost(post: BlogPost): post is DraftBlogPost {
  return post.status === "draft";
}

export const publishedBlogOrder: BlogSlug[] = blogOrder.filter((slug) =>
  isPublishedPost(blogPosts[slug])
);

export const draftBlogOrder: BlogSlug[] = blogOrder.filter((slug) =>
  isDraftPost(blogPosts[slug])
);
