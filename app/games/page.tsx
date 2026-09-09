import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Clio, an early-human strategy game, and Cromonsters, a monster-catching experiment. Follow their development and watch the prototypes in action."
};

export default function GamesPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Playable worlds"
        title="Games"
        description="Two experiments in making games: a people's unfolding history and a small world of creatures to discover."
      />

      <section className="projects-grid" aria-label="Games in development">
        <article id="clio" className="project-card" aria-labelledby="clio-title">
          <div className="project-card-grid">
            <div className="project-copy">
              <div>
                <p className="project-kicker">Historical strategy</p>
                <h2 id="clio-title" className="project-title">Clio</h2>
                <p className="project-summary">
                  Guide a people from their first wandering bands. Find food and
                  salt, explore a hex world, and watch languages, relationships
                  and independent peoples emerge. Give individual orders or
                  guide the bands through story decisions, or watch them play automatically.
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Format</dt>
                    <dd className="mt-1 text-pine-800">Windows desktop</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Stage</dt>
                    <dd className="mt-1 text-pine-800">Prototype in development</dd>
                  </div>
                </dl>
              </div>
              <div className="project-actions">
                <Link href="/cromblog/clio" className="folio-button">
                  Read the announcement
                </Link>
                <a href="/cromblog/clio/clio-demo.mp4" className="folio-button">
                  Watch the demo
                  <span className="sr-only"> of Clio</span>
                </a>
                <a href="https://github.com/mcrombie/clio" className="folio-button">
                  View the source
                  <span className="sr-only"> for Clio on GitHub</span>
                </a>
              </div>
            </div>
            <div className="project-image-bay">
              <Image
                src="/cromblog/clio/clio-demo-poster.jpg"
                alt="Clio's hex map and strategy interface"
                width={1920}
                height={1080}
                sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
                className="project-image"
              />
            </div>
          </div>
        </article>

        <article
          id="cromonsters"
          className="project-card"
          aria-labelledby="cromonsters-title"
        >
          <div className="project-card-grid">
            <div className="project-copy">
              <div>
                <p className="project-kicker">Monster-catching RPG</p>
                <h2 id="cromonsters-title" className="project-title">Cromonsters</h2>
                <p className="project-summary">
                  A small browser game inspired by the original monster-catching
                  adventures. Explore Latchleaf, encounter creatures and try
                  turn-based battles. The development post follows two rapid
                  iterations, from the first build to revised pixel art and combat.
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Format</dt>
                    <dd className="mt-1 text-pine-800">Browser game</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Stage</dt>
                    <dd className="mt-1 text-pine-800">Proof of concept</dd>
                  </div>
                </dl>
              </div>
              <div className="project-actions">
                <Link href="/cromblog/cromonsters" className="folio-button">
                  Read the development story
                </Link>
                <a
                  href="https://github.com/mcrombie/cromonsters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="folio-button"
                  aria-label="View Cromonsters source code on GitHub (opens in a new tab)"
                >
                  View source code
                  <span className="external-link-mark" aria-hidden="true">&#8599;</span>
                </a>
              </div>
            </div>
            <div className="project-image-bay">
              <Image
                src="/cromblog/cromonsters/test-2-poster.jpg"
                alt="Cromonsters gameplay from its second playtest"
                width={1920}
                height={1080}
                sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
                className="project-image"
              />
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
