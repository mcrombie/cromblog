"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  blogPosts,
  blogSeries,
  blogSeriesOrder,
  publishedBlogOrder,
  type BlogSeriesSlug,
  type PublishedBlogPost,
} from "@/content/blog";

type SortOrder = "newest" | "oldest";

function isBlogSeriesSlug(value: string | null): value is BlogSeriesSlug {
  return blogSeriesOrder.includes(value as BlogSeriesSlug);
}

function filterHref(series: BlogSeriesSlug | undefined, sort: SortOrder) {
  const params = new URLSearchParams();
  if (series) params.set("series", series);
  if (sort === "oldest") params.set("sort", sort);
  const query = params.toString();
  return query ? `/cromblog?${query}` : "/cromblog";
}

export function CromblogFilters() {
  const searchParams = useSearchParams();
  const seriesParam = searchParams.get("series");
  const selectedSeries = isBlogSeriesSlug(seriesParam) ? seriesParam : undefined;
  const sortOrder: SortOrder =
    searchParams.get("sort") === "oldest" ? "oldest" : "newest";

  const orderedPosts =
    sortOrder === "oldest"
      ? [...publishedBlogOrder].reverse()
      : [...publishedBlogOrder];

  const visiblePosts = selectedSeries
    ? orderedPosts.filter(
        (slug) => (blogPosts[slug] as PublishedBlogPost).series === selectedSeries
      )
    : orderedPosts;

  return (
    <>
      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="content-flow">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
              Series
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href={filterHref(undefined, sortOrder)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  selectedSeries
                    ? "border-[color:var(--border)] bg-white/60 text-pine-800 hover:bg-white"
                    : "border-pine-800 bg-pine-800 text-pine-50"
                }`}
              >
                All Posts
              </Link>
              {blogSeriesOrder.map((seriesSlug) => (
                <Link
                  key={seriesSlug}
                  href={filterHref(seriesSlug, sortOrder)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    selectedSeries === seriesSlug
                      ? "border-pine-800 bg-pine-800 text-pine-50"
                      : "border-[color:var(--border)] bg-white/60 text-pine-800 hover:bg-white"
                  }`}
                >
                  {blogSeries[seriesSlug].title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
              Sort
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {(["newest", "oldest"] as SortOrder[]).map((sort) => (
                <Link
                  key={sort}
                  href={filterHref(selectedSeries, sort)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    sortOrder === sort
                      ? "border-pine-800 bg-pine-800 text-pine-50"
                      : "border-[color:var(--border)] bg-white/60 text-pine-800 hover:bg-white"
                  }`}
                >
                  {sort === "newest" ? "Newest First" : "Oldest First"}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="content-flow">
          {visiblePosts.map((slug) => {
            const post = blogPosts[slug] as PublishedBlogPost;
            return (
              <article
                key={post.slug}
                className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/60 p-6 sm:p-7"
              >
                <div className="content-flow">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-pine-700/80">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                    {post.series ? (
                      <span>{blogSeries[post.series].title}</span>
                    ) : null}
                  </div>
                  <div className="content-flow">
                    <h2 className="font-serif text-2xl text-ink sm:text-3xl">
                      <Link
                        href={post.href}
                        className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="editorial-copy text-base leading-8 text-pine-800">
                      {post.summary}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
