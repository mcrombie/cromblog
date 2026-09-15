import Image from "next/image";
import Link from "next/link";
import { DoodleHomeHero } from "@/components/doodle-home-hero";
import { HomeLatestPost } from "@/components/home-discovery";
import { archivistDemoUrl } from "@/content/site";
import { archivistArt } from "@/content/archivist-art";
import "./home-discovery.css";

// Archived vibes keep their hero art; see ARCHIVED_VIBES in lib/vibes.ts.
const homeHeroImages = [
  { vibe: "forest", src: "/home/forest-hero.png" },
  { vibe: "ember", src: "/home/ember-ink-hero.png" }
] as const;

const archivistImage = archivistArt.featured;

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
            sizes="(min-width: 1024px) calc(100vw - 19.25rem), 100vw"
            className={`home-hero-image home-hero-image-vibe home-hero-image-${vibe}`}
          />
        ))}

        <div className="home-hero-copy">
          <h1 className="home-title">Cromblog</h1>
          <p className="home-lede">
            Essays, software, and art by Michael Crombie.
          </p>
        </div>

        <article className="home-feature" aria-labelledby="home-feature-title">
          <div className="home-feature-media">
            <Image
              src={archivistImage.src}
              alt={archivistImage.alt}
              fill
              priority
              sizes="(max-width: 719px) 92vw, 46vw"
              className="home-feature-image"
              style={{ objectPosition: archivistImage.objectPosition }}
            />
          </div>
          <div className="home-feature-copy">
            <p className="home-feature-kicker">Featured project</p>
            <h2 id="home-feature-title" className="home-feature-title">Archivist</h2>
            <p className="home-feature-summary">
              Ask a specialized chat bot about my book —{" "}
              <em>Cradle of the Empire</em>. Archivist reads the manuscript then
              cites and summarizes what the book says.
            </p>
            <div className="home-feature-actions">
              <a
                href={archivistDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="home-feature-link"
              >
                Try Archivist <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <Link href="/cromblog/archivist-elegant-context-window" className="home-feature-secondary">
                How I built it
              </Link>
            </div>
          </div>
        </article>

        <DoodleHomeHero />
      </section>

      <HomeLatestPost />
    </div>
  );
}
