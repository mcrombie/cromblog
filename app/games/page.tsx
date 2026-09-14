import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { doodleVibeMarks } from "@/content/doodle-vibe";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Explore Cromb Coo Coo, an illustrated browser adventure, alongside Clio and Cromonsters. Play, watch prototypes, and follow these worlds as they grow."
};

export default function GamesPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        doodle={doodleVibeMarks.games}
        eyebrow="Playable worlds"
        title="Games"
        description="Illustrated adventures, unfolding histories, and small worlds of creatures to discover. Play an opening chapter or follow a world in the making."
      />

      <section className="projects-grid" aria-label="Games in development">
        <article
          id="cromb-coo-coo"
          className="project-card"
          aria-labelledby="cromb-coo-coo-title"
        >
          <div className="project-card-grid">
            <div className="project-copy">
              <div>
                <p className="project-kicker">Illustrated narrative adventure</p>
                <h2 id="cromb-coo-coo-title" className="project-title">Cromb Coo Coo</h2>
                <p className="project-summary">
                  An unfamiliar terrace, a very patient turtle, and an island
                  just out of reach. Explore a world grown from my doodles,
                  listen to its inhabitants, and help them bring the roots
                  together in The First Crossing.
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Format</dt>
                    <dd className="mt-1 text-pine-800">Browser adventure</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Stage</dt>
                    <dd className="mt-1 text-pine-800">Playable opening</dd>
                  </div>
                </dl>
              </div>
              <div className="project-actions">
                <Link href="/games/cromb-coo-coo" className="folio-button">
                  Play The First Crossing
                </Link>
              </div>
            </div>
            <div className="project-image-bay">
              <Image
                src="/cromblog/doodle-experiments/round-21/at-the-center-of-cromb-coo-coo.png"
                alt="The Visitor, a trumpet turtle, and an orb juggler beneath the immense woodgrain bird in a floating forest"
                width={1672}
                height={941}
                sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
                className="project-image"
              />
            </div>
          </div>
        </article>

        <article id="clio" className="project-card" aria-labelledby="clio-title">
          <div className="project-card-grid">
            <div className="project-copy">
              <div>
                <p className="project-kicker">Historical strategy</p>
                <h2 id="clio-title" className="project-title">Clio</h2>
                <p className="project-summary">
                  Guide a band of fifty with the First Adviser. Gather food,
                  wood and salt, preview journeys across the map, and discover
                  wildlife as your people’s story begins. The latest Windows
                  build adds a guided opening and spoken situation reports.
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
                <a href="/games/clio/clio-sage-37-windows.zip" className="folio-button" download>
                  Download Clio for Windows · 16.8 MB
                </a>
                <Link href="/cromblog/clio" className="folio-button">
                  Read the announcement
                </Link>
                <a href="/cromblog/clio/clio-demo.mp4" className="folio-button">
                  Watch the original demo
                  <span className="sr-only"> of Clio</span>
                </a>
                <a href="https://github.com/mcrombie/clio" className="folio-button">
                  View the source
                  <span className="sr-only"> for Clio on GitHub</span>
                </a>
              </div>
              <p className="mt-4 text-sm text-pine-700">
                Windows 10 or 11 with .NET Framework 4.x. Extract the ZIP, then open Clio.exe.
              </p>
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
                <p className="project-kicker">Adventure RPG</p>
                <h2 id="cromonsters-title" className="project-title">Cromonsters</h2>
                <p className="project-summary">
                  Arrive as a farmhand on an imperial estate. Learn the farming
                  tasks, survive a goblin raid, and navigate its aftermath
                  through conversations, looting, trade, and turn-based battles.
                  The wider journey is still in development.
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Format</dt>
                    <dd className="mt-1 text-pine-800">Browser game</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Stage</dt>
                    <dd className="mt-1 text-pine-800">Playable prototype in development</dd>
                  </div>
                </dl>
              </div>
              <div className="project-actions">
                <Link href="/games/cromonsters" className="folio-button">
                  Play Cromonsters
                </Link>
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
