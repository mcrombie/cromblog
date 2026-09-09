export type BlogSlug =
  | "clio"
  | "cromonsters"
  | "simulating-civilizations-iv"
  | "an-auspicious-august"
  | "archivist-iii-lowering-latency"
  | "evaluator-also-has-to-be-evaluated"
  | "archivist-elegant-context-window"
  | "primeproofing-beyond-vibe-coding"
  | "building-an-llm-from-scratch"
  | "revisiting-roots-of-civilization"
  | "ai-april"
  | "make-believe-may"
  | "simulating-civilizations-ii"
  | "interactive-phoneme-chart"
  | "simulating-civilizations-iii"
  | "cradle-of-the-empire";

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
  objectPosition?: string;
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
  "clio",
  "cromonsters",
  "simulating-civilizations-iv",
  "an-auspicious-august",
  "archivist-iii-lowering-latency",
  "evaluator-also-has-to-be-evaluated",
  "archivist-elegant-context-window",
  "primeproofing-beyond-vibe-coding",
  "building-an-llm-from-scratch",
  "cradle-of-the-empire",
  "simulating-civilizations-iii",
  "interactive-phoneme-chart",
  "simulating-civilizations-ii",
  "make-believe-may",
  "revisiting-roots-of-civilization",
  "ai-april"
];

export const blogPosts = {
  "clio": {
    slug: "clio",
    title: "Clio: Playing History",
    href: "/cromblog/clio",
    date: "September 9, 2026",
    readTime: "2 min read · plus the original prompt and demo",
    summary:
      "After Cromonsters, another game-making experiment: Clio, a strategy prototype about guiding a small band of people through history, inspired by Civilization, Humankind and Total War.",
    image: {
      src: "/cromblog/clio/clio-demo-poster.jpg",
      alt: "Clio's hex map, with bands and neighboring peoples exploring a wooded landscape",
      width: 1920,
      height: 1080
    }
  },
  "cromonsters": {
    slug: "cromonsters",
    title: "Cromonsters!",
    href: "/cromblog/cromonsters",
    date: "September 7, 2026",
    readTime: "3 min read · plus prompts and videos",
    summary:
      "It occurred to me while hiking how relatively simple the original Game Boy Pokémon game was and that it would probably be trivially easy to rebuild the mechanics with modern AI agent programming.",
    image: {
      src: "/cromblog/cromonsters/test-2-poster.jpg",
      alt: "Cromonsters! gameplay with a muted four-shade palette and original pixel-art creatures",
      width: 1280,
      height: 720
    }
  },
  "simulating-civilizations-iv": {
    slug: "simulating-civilizations-iv",
    title: "Simulating Civilizations IV",
    href: "/cromblog/simulating-civilizations-iv",
    date: "September 2, 2026",
    readTime: "4 min read",
    series: "simulating-civilizations",
    summary:
      "A live Clashvergence demo, a more grounded narrative generator, and an evaluation that established determinism while exposing the cost of auditing large simulated worlds.",
    image: {
      src: "/clashvergence/og.png",
      alt: "Clashvergence Live artwork showing a colored hex-map world beside an open historical chronicle",
      width: 1731,
      height: 909
    }
  },
  "an-auspicious-august": {
    slug: "an-auspicious-august",
    title: "An Auspicious August",
    href: "/cromblog/an-auspicious-august",
    date: "September 1, 2026",
    readTime: "4 min read",
    summary:
      "Following August’s auspices from Roman bird signs to birdwatching, Crombot 1.0, Signal September, and a late-blooming sunflower.",
    image: {
      src: "/cromblog/auspicious-august-and-a-signal-september/sunflower-bloom-only-poster.png",
      alt: "Hand-tinted nineteenth-century botanical engraving of a fully open sunflower",
      width: 1024,
      height: 1024,
      objectPosition: "50% 36%"
    }
  },
  "archivist-iii-lowering-latency": {
    slug: "archivist-iii-lowering-latency",
    title: "Archivist III: Lowering Latency",
    href: "/cromblog/archivist-iii-lowering-latency",
    date: "August 15, 2026",
    readTime: "6 min read",
    summary:
      "Archivist's first evaluation left it with a 54.4-second median latency. Moving the evidence bookkeeping out of the model and into application code — and routing social questions away from retrieval entirely — brought casual replies to a 3.59-second median and grounded answers to 19.3 seconds.",
    image: {
      src: "/cromblog/archivist-elegant-context-window/thumbnail.png",
      alt:
        "Engraving-style illustration of a large open book on a desk, its text rising as a column of glowing golden code beside a laptop displaying an engraved river landscape",
      width: 1456,
      height: 816
    }
  },
  "evaluator-also-has-to-be-evaluated": {
    slug: "evaluator-also-has-to-be-evaluated",
    title: "Archivist II: Evaluating the RAG...and the Evaluator",
    href: "/cromblog/evaluator-also-has-to-be-evaluated",
    date: "August 14, 2026",
    readTime: "7 min read",
    summary:
      "Archivist's first frozen evaluation ran against a held-out gold set of 37 questions. Retrieval almost always found something relevant but rarely found everything an answer needed — and the decomposition instrument meant to score those answers returned invalid results for 27 of 37 of them.",
    image: {
      src: "/cromblog/archivist-elegant-context-window/thumbnail.png",
      alt:
        "Engraving-style illustration of a large open book on a desk, its text rising as a column of glowing golden code beside a laptop displaying an engraved river landscape",
      width: 1456,
      height: 816
    }
  },
  "archivist-elegant-context-window": {
    slug: "archivist-elegant-context-window",
    title: "Archivist: Crafting an Elegant Context Window",
    href: "/cromblog/archivist-elegant-context-window",
    date: "July 30, 2026",
    readTime: "6 min read",
    summary:
      "Archivist answers questions about Cradle of the Empire from the book itself, citing passages back to the typeset edition. Building it meant deciding what belongs in a context window — and then testing that decision against a mode that simply hands the model the whole manuscript.",
    image: {
      src: "/cromblog/archivist-elegant-context-window/thumbnail.png",
      alt:
        "Engraving-style illustration of a large open book on a desk, its text rising as a column of glowing golden code beside a laptop displaying an engraved river landscape",
      width: 1456,
      height: 816
    }
  },
  "primeproofing-beyond-vibe-coding": {
    slug: "primeproofing-beyond-vibe-coding",
    title: "Primeproofing: Beyond Vibe Coding",
    href: "/cromblog/primeproofing-beyond-vibe-coding",
    date: "July 22, 2026",
    readTime: "6 min read",
    summary:
      "Moving beyond vibe coding through primeproofing: combining context engineering with output validation, then testing the process with mygrep and the Clio civilization simulation.",
    image: {
      src: "/cromblog/primeproofing-beyond-vibe-coding/thumbnail.jpg",
      alt: "Engraving-style illustration of a cartographer drawing a glowing blue map by candlelight",
      width: 1200,
      height: 672
    }
  },
  "building-an-llm-from-scratch": {
    slug: "building-an-llm-from-scratch",
    title: "Building an LLM from Scratch",
    href: "/cromblog/building-an-llm-from-scratch",
    date: "July 9, 2026",
    readTime: "5 min read",
    summary:
      "Working through Sebastian Raschka's book turned LLMs from something magical into something mechanical: tokenizers, tensor shapes, training loops, fine-tuning, evaluation, and a codebase that became a map.",
    image: {
      src: "/cromblog/building-an-llm-from-scratch/llm-from-scratch.jpg",
      alt: "Wood engraving of hands stitching glowing thread between a mechanical brain and an anatomical brain",
      width: 1600,
      height: 896
    }
  },
  "cradle-of-the-empire": {
    slug: "cradle-of-the-empire",
    title: "Cradle of the Empire: A Big History of Virginia",
    href: "/cromblog/cradle-of-the-empire",
    date: "July 4, 2026",
    readTime: "2 min read",
    summary:
      "After four years of work, the history book I have wanted to write since childhood is complete, and the ebook edition is ready to order. Print and hardcover editions are on the way.",
    image: {
      src: "/cromblog/cradle-of-the-empire/cover.jpg",
      alt: "Cover art for Cradle of the Empire: A Big History of Virginia, showing a great oak on a riverbank with tall ships passing on the water beyond",
      width: 1792,
      height: 2688
    }
  },
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
