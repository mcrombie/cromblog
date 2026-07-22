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
    href: seriesPosts[0].href,
    label: "Read the Latest Blog Post"
  };
}

export default function ProjectsPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Projects"
        title="Projects"
        description="A cabinet of simulations, interactive tools, experiments, and long-form work."
      />

      <section className="projects-grid">
        {projectOrder.map((slug) => {
          const project = projects[slug];
          const blogButton = getBlogButton(project.blogSeries);

          return (
            <article key={slug} className="project-card">
              <div className="project-card-grid">
                <div className="project-copy">
                  <p className="project-kicker">
                    {project.stack.slice(0, 4).join(" / ")}
                  </p>
                  <h2 className="project-title">{project.title}</h2>
                  <p className="project-summary">{project.summary}</p>

                  <div className="project-actions">
                    {project.links.map((link) =>
                      link.external ? (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="folio-button"
                          aria-label={`${link.label} for ${project.title} (opens in a new tab)`}
                        >
                          {link.label}
                          <span className="external-link-mark" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      ) : (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="folio-button"
                        >
                          {link.label}
                        </Link>
                      )
                    )}
                    {blogButton ? (
                      <Link
                        href={blogButton.href}
                        className="folio-button"
                      >
                        {blogButton.label}
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="project-image-bay">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    width={project.image.width}
                    height={project.image.height}
                    unoptimized={project.image.unoptimized}
                    className="project-image"
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
