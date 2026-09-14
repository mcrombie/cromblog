import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { doodleVibeMarks } from "@/content/doodle-vibe";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Play Stardate Valley, a Stardew-inspired farming and romance spoof, alongside Cromb Coo Coo, Clio, and Cromonsters. Explore original worlds in your browser."
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
        <article id="heartwood-valley" className="project-card" aria-labelledby="heartwood-valley-title">
          <div className="project-card-grid">
            <div className="project-copy">
              <div>
                <p className="project-kicker">A farm-life dating spoof</p>
                <h2 id="heartwood-valley-title" className="project-title">Stardate Valley</h2>
                <p className="project-summary">
                  You inherited a farm. The entire town inherited a crush on you.
                  Grow turnips, fish, and date all seven adult neighbors in this
                  Stardew-inspired spoof, complete with pixel tools, heart
                  events, a foul-mouthed goblin lord, and a very ambitious polycule potluck.
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Format</dt>
                    <dd className="mt-1 text-pine-800">Browser game</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Stage</dt>
                    <dd className="mt-1 text-pine-800">Playable farming &amp; romance demo</dd>
                  </div>
                </dl>
              </div>
              <div className="project-actions">
                <Link href="/games/heartwood-valley" className="folio-button">Play Stardate Valley</Link>
              </div>
              <p className="mt-4 text-sm text-pine-700">
                For a quick tour, open Grandpa’s letter and choose “Skip to the flirting.”
              </p>
            </div>
            <div className="project-image-bay">
              <Image
                src="/games/heartwood-valley/assets/village-map.png"
                alt="Stardate Valley: a pixel-art farm, cottages, flower gardens, and a wooden bridge over a turquoise river"
                width={1536}
                height={1024}
                sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
                className="project-image"
              />
            </div>
          </div>
        </article>

        <article
          id="cromb-coo-coo"
          className="project-card"
          aria-labelledby="cromb-coo-coo-title"
        >
          <div className="project-card-grid">
            <div className="project-copy">
              <div>
                <p className="project-kicker">Animated 3D adventure</p>
                <h2 id="cromb-coo-coo-title" className="project-title">Cromb Coo Coo</h2>
                <p className="project-summary">
                  Say hello to the frog, then follow the path onward.
                  Explore five animated 3D islands grown from my doodles,
                  with a new place and a new friend at every crossing —
                  from a quiet clearing to a lantern-lit archive.
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Format</dt>
                    <dd className="mt-1 text-pine-800">Browser adventure</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-pine-700">Stage</dt>
                    <dd className="mt-1 text-pine-800">Five playable islands</dd>
                  </div>
                </dl>
              </div>
              <div className="project-actions">
                <Link href="/games/cromb-coo-coo" className="folio-button">
                  Begin the island journey
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
