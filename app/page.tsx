import Image from "next/image";
import Link from "next/link";

import { VibeCycleButton } from "@/components/vibe-cycle-button";
import {
  blogPosts,
  publishedBlogOrder,
  type PublishedBlogPost
} from "@/content/blog";

const latestPost = blogPosts[publishedBlogOrder[0]] as PublishedBlogPost;

const homeHeroImages = [
  { vibe: "forest", src: "/home/forest-hero.png" },
  { vibe: "whimsical", src: "/home/cosmic-almanac-hero.png" },
  { vibe: "codex", src: "/home/illuminated-codex-still-life.png" },
  { vibe: "ember", src: "/home/ember-ink-hero.png" },
  { vibe: "ocean", src: "/home/tidal-archive-hero.png" }
] as const;

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        {homeHeroImages.map(({ vibe, src }) => (
          <Image
            key={vibe}
            src={src}
            alt=""
            fill
            sizes="(min-width: 1024px) calc(100vw - 19.25rem), 100vw"
            className={`home-hero-image home-hero-image-vibe home-hero-image-${vibe}`}
          />
        ))}

        <div className="home-hero-copy">
          <p className="home-kicker">Michael Crombie / Digital workshop</p>
          <h1 className="home-title">Cromblog</h1>
          <p className="home-lede">
            A portfolio and writing space for a software developer and writer
            exploring simulations, language, and history.
          </p>
          <div className="home-actions">
            <Link href="/cromblog" className="folio-button folio-button-primary">
              Browse the Blog
            </Link>
            <Link href="/projects" className="folio-button">
              View Projects
            </Link>
            <Link href="/about" className="folio-button">
              Contact the Developer
            </Link>
            <VibeCycleButton variant="inline" />
          </div>
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
          <span className="featured-project-status" aria-label="Coming soon">
            Soon...
          </span>
        </div>

        <article className="featured-project-card">
          <div className="featured-project-copy">
            <p className="featured-project-kicker">In development</p>
            <h3 className="featured-project-title">Archivist</h3>
            <p className="featured-project-summary" lang="la">
              Historia testis temporum, lux veritatis, vita memoriae, magistra
              vitae, nuntia vetustatis.
            </p>
          </div>

          <div className="featured-project-visual" aria-hidden="true">
            <span className="featured-project-monogram">A</span>
            <span className="featured-project-index">
              Project record forthcoming
            </span>
          </div>
        </article>
      </section>

      <div className="home-grid">
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

        <aside className="home-panel">
          <h2 className="home-panel-heading">Working materials</h2>
          <ul className="material-list">
            <li>Simulation systems</li>
            <li>Interactive tools</li>
            <li>Worldbuilding</li>
            <li>Language and history</li>
            <li>AI-assisted craft</li>
          </ul>
        </aside>
      </div>

      <section className="home-panel editorial-copy">
        <h2 className="home-panel-heading">The workshop</h2>
        <div className="content-flow" style={{ marginTop: "1rem" }}>
          <p>
            This site collects the projects I build and the writing I do around
            them. Some of it is technical — simulations, tools, rebuilt apps —
            and some of it is more reflective: essays about the ideas that
            motivated those projects in the first place.
          </p>
          <p>
            The best place to start is the Blog, where the newest field notes
            appear first, or the Projects page if you&apos;d rather go straight to
            the work.
          </p>
        </div>
      </section>
    </div>
  );
}
