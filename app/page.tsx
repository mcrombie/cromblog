import Image from "next/image";
import Link from "next/link";
import { DoodleHomeFigure, DoodleHomeNote } from "@/components/doodle-home-hero";
import { HomeLatestPost } from "@/components/home-discovery";
import { archivistDemoUrl, projects } from "@/content/site";
import "./home-discovery.css";
import "./home-diptych.css";

// Archived vibes keep their hero art; see ARCHIVED_VIBES in lib/vibes.ts.
const homeHeroImages = [
  { vibe: "forest", src: "/home/forest-hero.png" },
  { vibe: "ember", src: "/home/ember-ink-hero.png" }
] as const;

const archivistImage = {
  src: "/cromblog/archivist-elegant-context-window/thumbnail.png",
  alt: "Archivist's original blue-and-gold artwork: an open book beside a laptop showing a historical landscape."
};
const bookImage = projects["big-history-of-virginia"].image;

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero home-hero-band home-hero--balanced">
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

        <DoodleHomeFigure />

        <div className="home-hero-copy">
          <h1 className="home-title">Cromblog</h1>
          <p className="home-lede">
            Essays, software, and art by Michael Crombie.
          </p>
          <DoodleHomeNote />
        </div>

        <section className="home-feature home-diptych" aria-labelledby="featured-work-title">
          <header className="diptych-heading">
            <h2 id="featured-work-title">Featured Work</h2>
          </header>

          <div className="diptych-pages">
            <article className="diptych-page diptych-page--archivist" aria-labelledby="featured-archivist-title">
              <header className="diptych-intro">
                <p className="diptych-label">Software &amp; AI</p>
                <h3 id="featured-archivist-title" className="diptych-title">Archivist</h3>
              </header>
              <div className="diptych-media diptych-media--archivist">
                <Image
                  src={archivistImage.src}
                  alt={archivistImage.alt}
                  fill
                  preload
                  sizes="(max-width: 639px) 85vw, 416px"
                  className="diptych-image"
                />
              </div>
              <p className="diptych-summary">
                An AI application that answers questions about my history book
                using retrieved passages and citations.
              </p>
              <div className="diptych-endnote">
                <a
                  href={archivistDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diptych-action"
                >
                  Try Archivist <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </article>

            <article className="diptych-page diptych-page--book" aria-labelledby="featured-book-title">
              <div className="diptych-book-copy">
                <header className="diptych-intro">
                  <p className="diptych-label">History &amp; Writing</p>
                  <h3 id="featured-book-title" className="diptych-title">
                    Cradle of the Empire{" "}<span className="diptych-subtitle">A Big History of Virginia</span>
                  </h3>
                </header>
                <p className="diptych-summary">
                  An independently published history exploring Virginia&apos;s role
                  in the development of American power over four centuries.
                </p>
                <div className="diptych-endnote">
                  <Link href="/cromblog/cradle-of-the-empire-ii-the-paperback" className="diptych-action">
                    Explore the Book <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              <div className="diptych-media diptych-media--book">
                <div className="diptych-cover">
                  <Image
                    src={bookImage.src}
                    alt="Front cover of Cradle of the Empire: A Big History of Virginia, with an oak tree overlooking sailing ships."
                    fill
                    preload
                    sizes="(max-width: 639px) 320px, 640px"
                    className="diptych-image"
                  />
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>

      <HomeLatestPost />
    </div>
  );
}
