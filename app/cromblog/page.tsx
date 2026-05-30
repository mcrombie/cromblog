import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { canPreviewDrafts, draftPreviewHref } from "@/app/cromblog/draft-preview";
import {
  blogPosts,
  blogSeries,
  blogSeriesOrder,
  draftBlogOrder,
  isDraftPost,
  isPublishedPost,
  publishedBlogOrder,
  type BlogPost,
  type BlogSeriesSlug
} from "@/content/blog";

export const metadata: Metadata = {
  title: "Cromblog"
};

type SortOrder = "newest" | "oldest";
type StatusFilter = "published" | "draft";

type CromblogPageProps = {
  searchParams?: {
    series?: string;
    sort?: string;
    status?: string;
  };
};

function isBlogSeriesSlug(value: string | undefined): value is BlogSeriesSlug {
  return blogSeriesOrder.includes(value as BlogSeriesSlug);
}

function filterHref(
  series: BlogSeriesSlug | undefined,
  sort: SortOrder,
  status: StatusFilter
) {
  const params = new URLSearchParams();

  if (series) {
    params.set("series", series);
  }

  if (status === "draft") {
    params.set("status", "drafts");
  }

  if (sort === "oldest") {
    params.set("sort", sort);
  }

  const query = params.toString();
  return query ? `/cromblog?${query}` : "/cromblog";
}

export default function CromblogPage({ searchParams }: CromblogPageProps) {
  const draftPreviewEnabled = canPreviewDrafts();
  const seriesParam = searchParams?.series;
  const selectedSeries = isBlogSeriesSlug(seriesParam) ? seriesParam : undefined;
  const sortOrder: SortOrder = searchParams?.sort === "oldest" ? "oldest" : "newest";
  const statusFilter: StatusFilter =
    draftPreviewEnabled && searchParams?.status === "drafts"
      ? "draft"
      : "published";
  const postOrder =
    statusFilter === "draft" ? draftBlogOrder : publishedBlogOrder;
  const orderedPosts =
    sortOrder === "oldest"
      ? [...postOrder].reverse()
      : [...postOrder];
  const visiblePosts = selectedSeries
    ? orderedPosts.filter((slug) => {
        const post: BlogPost = blogPosts[slug];
        return post.series === selectedSeries;
      })
    : orderedPosts;

  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Cromblog"
        title="Cromblog"
        description="Posts appear here by date and can be filtered by series."
      />

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="content-flow">
          {draftPreviewEnabled ? (
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
                Status
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {(["published", "draft"] as StatusFilter[]).map((status) => (
                  <Link
                    key={status}
                    href={filterHref(selectedSeries, sortOrder, status)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      statusFilter === status
                        ? "border-pine-800 bg-pine-800 text-pine-50"
                        : "border-[color:var(--border)] bg-white/60 text-pine-800 hover:bg-white"
                    }`}
                  >
                    {status === "published" ? "Published" : "Drafts"}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
              Series
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href={filterHref(undefined, sortOrder, statusFilter)}
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
                  href={filterHref(seriesSlug, sortOrder, statusFilter)}
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
                  href={filterHref(selectedSeries, sort, statusFilter)}
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
            const post: BlogPost = blogPosts[slug];
            const isPublished = isPublishedPost(post);
            const isDraft = isDraftPost(post);

            if (statusFilter === "published" && !isPublished) {
              return null;
            }

            if (statusFilter === "draft" && !isDraft) {
              return null;
            }

            const href = isDraft ? draftPreviewHref(post.href) : post.href;

            return (
              <article
                key={post.slug}
                className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/60 p-6 sm:p-7"
              >
                <div className="content-flow">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-pine-700/80">
                    <span>{isPublished ? post.date : "Draft"}</span>
                    <span>{post.readTime}</span>
                    {post.series ? (
                      <span>{blogSeries[post.series].title}</span>
                    ) : null}
                  </div>
                  <div className="content-flow">
                    <h2 className="font-serif text-2xl text-ink sm:text-3xl">
                      <Link
                        href={href}
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
    </div>
  );
}
