export type BlogSlug =
  | "revisiting-roots-of-civilization"
  | "ai-april"
  | "make-believe-may"
  | "simulating-civilizations-ii"
  | "interactive-phoneme-chart"
  | "simulating-civilizations-iii";

export type BlogSeriesSlug = "rebuilding-old-apps" | "simulating-civilizations";

export type BlogSeries = {
  slug: BlogSeriesSlug;
  title: string;
};

export type BlogPostImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  unoptimized?: boolean;
};

export type BlogPostBase = {
  slug: BlogSlug;
  title: string;
  href: string;
  updateDates?: string[];
  readTime: string;
  summary: string;
  series?: BlogSeriesSlug;
  image?: BlogPostImage;
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
  "simulating-civilizations-iii",
  "interactive-phoneme-chart",
  "simulating-civilizations-ii",
  "make-believe-may",
  "revisiting-roots-of-civilization",
  "ai-april"
];

export const blogPosts = {
  "simulating-civilizations-iii": {
    slug: "simulating-civilizations-iii",
    title: "Simulating Civilizations III",
    href: "/cromblog/simulating-civilizations-iii",
    date: "June 30, 2026",
    readTime: "12 min read",
    series: "simulating-civilizations",
    summary:
      "Integrating Clashvergence and World Builder on the Azhora map, with Koppen climate and map-linked lore. Two example runs — one single-civilization, one staged eight-civilization arrival — show a reworked narrative generator that positions a Boueni-descended chronicler inside the world.",
    image: {
      src: "/cromblog/simulating-civilizations-iii/azhora-450-turn.png",
      alt: "World Builder simulation view showing Azhora at turn 450",
      width: 1920,
      height: 1080
    }
  },
  "interactive-phoneme-chart": {
    slug: "interactive-phoneme-chart",
    title: "Rebuilding an Interactive Phoneme Chart",
    href: "/cromblog/interactive-phoneme-chart",
    date: "June 4, 2026",
    readTime: "3 min read",
    series: "rebuilding-old-apps",
    summary:
      "Revisiting an early IPA chart: cleaning up the data model, adding seven real languages with historical context, and introducing five constructed languages from the Azhora worldbuilding project.",
    image: {
      src: "/cromblog/interactive-phoneme-chart/upgraded-phoneme-chart.png",
      alt: "The upgraded Interactive Phoneme Chart showing the IPA Atlas view with language sidebar",
      width: 1400,
      height: 860
    }
  },
  "simulating-civilizations-ii": {
    slug: "simulating-civilizations-ii",
    title: "Simulating Civilizations II",
    href: "/cromblog/simulating-civilizations-ii",
    date: "May 29, 2026",
    readTime: "4 min read",
    series: "simulating-civilizations",
    summary:
      "Building a hex-map World Builder app compatible with Clashvergence — giving each simulated history a more believable stage.",
    image: {
      src: "/cromblog/simulating-civilizations-ii/hex-simulation.gif",
      alt: "Animated hex map showing a Clashvergence simulation running on a World Builder map",
      width: 998,
      height: 612,
      unoptimized: true
    }
  },
  "make-believe-may": {
    slug: "make-believe-may",
    title: "Make-Believe May",
    href: "/cromblog/make-believe-may",
    date: "May 15, 2026",
    readTime: "5 min read",
    summary:
      "Pivoting from AI coding experiments to fiction writing and fantasy worldbuilding—and asking whether code and language models can help turn specific fictional premises into structured, believable worlds.",
    image: {
      src: "/cromblog/simulating-civilizations-ii/azhora-map.png",
      alt: "The Azhora continent map used for worldbuilding",
      width: 1916,
      height: 1050
    }
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
      "Returning to an old civilization-simulation idea with a new AI-assisted system for factions, territories, political economy, and generated histories.",
    image: {
      src: "/cromblog/revisiting-roots/polity-fertile-crescent.gif",
      alt: "Animated Root of Civilization simulation showing settlements forming along rivers",
      width: 900,
      height: 620,
      unoptimized: true
    }
  },
  "ai-april": {
    slug: "ai-april",
    title: "Rebuilding a Chess App in the Age of AI",
    href: "/cromblog/ai-april",
    date: "April 27, 2026",
    readTime: "2 min read",
    series: "rebuilding-old-apps",
    summary:
      "Revisiting an old chess app as an exercise in AI-assisted development, and asking what it means when a machine can do in seconds what uses to take days.",
    image: {
      src: "/chess-gameplay.gif",
      alt: "Animated chess gameplay on the rebuilt React chess board",
      width: 480,
      height: 480,
      unoptimized: true
    }
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
