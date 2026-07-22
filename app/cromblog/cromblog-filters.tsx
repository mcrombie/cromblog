"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  blogPosts,
  blogSeries,
  publishedBlogOrder,
  type PublishedBlogPost,
} from "@/content/blog";

type SortOrder = "newest" | "oldest";

function sortHref(sort: SortOrder) {
  return sort === "oldest" ? "/cromblog?sort=oldest" : "/cromblog";
}

export function CromblogFilters() {
  const searchParams = useSearchParams();
  const sortOrder: SortOrder =
    searchParams.get("sort") === "oldest" ? "oldest" : "newest";

  const orderedPosts =
    sortOrder === "oldest"
      ? [...publishedBlogOrder].reverse()
      : [...publishedBlogOrder];

  return (
    <>
      <nav className="archive-sort" aria-label="Sort blog posts">
        <span className="archive-sort-label">Order</span>
        {(["newest", "oldest"] as SortOrder[]).map((sort) => {
          const active = sortOrder === sort;

          return (
            <Link
              key={sort}
              href={sortHref(sort)}
              className={`archive-sort-link${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {sort === "newest" ? "Newest" : "Oldest"}
            </Link>
          );
        })}
      </nav>

      <section
        className="post-archive surface-panel"
        aria-labelledby="blog-results-heading"
      >
        <h2 id="blog-results-heading" className="sr-only">
          Blog posts
        </h2>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {orderedPosts.length} {orderedPosts.length === 1 ? "post" : "posts"}
          {` shown, sorted ${sortOrder} first`}
        </p>
        <div className="post-list">
          {orderedPosts.map((slug) => {
            const post = blogPosts[slug] as PublishedBlogPost;
            return (
              <article key={post.slug} className="post-card">
                <div
                  className={`post-card-grid${post.image ? " has-image" : ""}`}
                >
                  <div className="post-card-copy">
                    <div className="post-meta">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                      {post.series ? (
                        <span>{blogSeries[post.series].title}</span>
                      ) : null}
                    </div>
                    <h2 className="post-title">
                      <Link href={post.href} className="post-title-link">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="post-summary">{post.summary}</p>
                  </div>
                  {post.image && (
                    <div className="post-thumbnail">
                      <Image
                        src={post.image.src}
                        alt={post.image.alt}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 220px, 260px"
                        unoptimized={post.image.unoptimized}
                        className="post-thumbnail-image"
                      />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
