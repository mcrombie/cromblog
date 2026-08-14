import Image from "next/image";
import Link from "next/link";

import {
  blogPosts,
  publishedBlogOrder,
  type PublishedBlogPost
} from "@/content/blog";
import { archivistDemoUrl } from "@/content/site";

const latestPost = blogPosts[publishedBlogOrder[0]] as PublishedBlogPost;

const homeHeroImages = [
  { vibe: "forest", src: "/home/forest-hero.png" },
  { vibe: "whimsical", src: "/home/cosmic-almanac-hero.png" },
  { vibe: "codex", src: "/home/illuminated-codex-still-life.png" },
  { vibe: "ember", src: "/home/ember-ink-hero.png" },
  { vibe: "ocean", src: "/home/tidal-archive-hero.png" }
] as const;

const archivistImage = {
  src: "/home/archivist-featured.svg",
  alt:
    "Engraved open book beneath a constellation, its text rising as a plume of glowing marks while two lines of citation return into the pages",
  width: 720,
  height: 440
};

function ArchivistTitleLink() {
  return (
    <a href={archivistDemoUrl} target="_blank" rel="noopener noreferrer">
      Archivist
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero home-hero-band">
        {homeHeroImages.map(({ vibe, src }) => (
          <Image
            key={vibe}
            src={src}
            alt=""
            fill
            priority={vibe === "forest"}
            sizes="(min-width: 1024px) calc(100vw - 19.25rem), 100vw"
            className={`home-hero-image home-hero-image-vibe home-hero-image-${vibe}`}
          />
        ))}

        <div className="home-hero-copy">
          <h1 className="home-title">Cromblog</h1>
          <p className="home-lede">
            A collection of software and writing by Michael Crombie.
          </p>
        </div>
      </section>

      <section
        className="home-panel featured-project"
        aria-labelledby="featured-project-heading"
      >
        <div className="featured-project-header">
          <h2 className="home-panel-heading" id="featured-project-heading">
            Featured project
          </h2>
          <span className="featured-project-status is-live">Live demo</span>
        </div>

        <article className="featured-project-card">
          <div className="featured-project-visual">
            <Image
              src={archivistImage.src}
              alt={archivistImage.alt}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 35vw, 28vw"
              unoptimized
              className="featured-project-image"
            />
          </div>
          <div className="featured-project-copy">
            <p className="featured-project-kicker">Book-grounded AI</p>
            <h3 className="featured-project-title">
              <ArchivistTitleLink />
            </h3>
            <p className="featured-project-summary">
              Ask a specialized chat bot about my book —{" "}
              <em>Cradle of the Empire</em>. Archivist reads the manuscript then
              cites and summarizes what the book says.
            </p>
          </div>
        </article>
      </section>

      <section className="home-panel">
        <h2 className="home-panel-heading">Latest post</h2>
        <article className="latest-dispatch">
          {latestPost.image ? (
            <div className="latest-dispatch-image">
              <Image
                src={latestPost.image.src}
                alt={latestPost.image.alt}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 35vw, 28vw"
                unoptimized={latestPost.image.unoptimized}
              />
            </div>
          ) : null}
          <div>
            <div className="latest-dispatch-meta">
              <span>{latestPost.date}</span>
              <span>{latestPost.readTime}</span>
            </div>
            <h3 className="latest-dispatch-title">
              <Link href={latestPost.href}>{latestPost.title}</Link>
            </h3>
            <p className="latest-dispatch-summary">{latestPost.summary}</p>
          </div>
        </article>
      </section>
    </div>
  );
}
