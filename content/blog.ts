export type BlogSlug = "test-post";

export type BlogPost = {
  slug: BlogSlug;
  title: string;
  href: string;
  date: string;
  readTime: string;
  summary: string;
};

export const blogOrder: BlogSlug[] = ["test-post"];

export const blogPosts: Record<BlogSlug, BlogPost> = {
  "test-post": {
    slug: "test-post",
    title: "A Test Post for the New Cromblog",
    href: "/cromblog/test-post",
    date: "April 23, 2026",
    readTime: "4 min read",
    summary:
      "A placeholder entry to shape the layout, rhythm, and typography for future posts."
  }
};
