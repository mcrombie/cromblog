import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import {
  blogPosts,
  isPublishedPost,
  publishedBlogOrder,
  type BlogPost,
  type BlogSeriesSlug
} from "@/content/blog";
import { projectOrder, projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects"
};

function getBlogButton(series: BlogSeriesSlug | undefined) {
  if (!series) {
    return undefined;
  }

  const seriesPosts = publishedBlogOrder
    .map((slug): BlogPost => blogPosts[slug])
    .filter(isPublishedPost)
    .filter((post) => post.series === series);

  if (seriesPosts.length === 0) {
    return undefined;
  }

  if (seriesPosts.length === 1) {
    return {
      href: seriesPosts[0].href,
      label: "Read the Blog Post"
    };
  }

  return {
    href: `/cromblog?series=${series}`,
    label: "Read the Blog Posts"
  };
}

export default function ProjectsPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Projects"
        title="Projects"
        description="Current project list."
      />

      <section className="grid gap-5">
        {projectOrder.map((slug) => {
          const project = projects[slug];
          const blogButton = getBlogButton(project.blogSeries);

          return (
            <article
              key={slug}
              className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] shadow-card lg:h-[360px]"
            >
              <div className="grid h-full gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
                <div className="p-6 sm:p-8 lg:flex lg:h-full lg:flex-col lg:justify-between lg:gap-5">
                  <div className="content-flow">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
                        {project.stack.slice(0, 4).join(" / ")}
                      </p>
                      <h2 className="mt-2 font-serif text-3xl text-ink">
                        {project.title}
                      </h2>
                    </div>

                    <p className="text-base leading-8 text-pine-800">
                      {project.summary}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 lg:mt-0">
                    {project.links.map((link) =>
                      link.external ? (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-[color:var(--border)] bg-white/60 px-4 py-2 text-sm font-semibold text-pine-800 transition hover:bg-white"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="rounded-full border border-[color:var(--border)] bg-white/60 px-4 py-2 text-sm font-semibold text-pine-800 transition hover:bg-white"
                        >
                          {link.label}
                        </Link>
                      )
                    )}
                    {blogButton ? (
                      <Link
                        href={blogButton.href}
                        className="rounded-full border border-[color:var(--border)] bg-white/60 px-4 py-2 text-sm font-semibold text-pine-800 transition hover:bg-white"
                      >
                        {blogButton.label}
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="flex min-h-[240px] items-center justify-center overflow-hidden p-4 sm:p-5 lg:p-6">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    width={project.image.width}
                    height={project.image.height}
                    unoptimized={project.image.unoptimized}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
