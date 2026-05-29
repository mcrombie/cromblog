import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["simulating-civilizations-ii"];

export const metadata: Metadata = {
  title: post.title
};

function Figure({
  src,
  alt,
  caption,
  width,
  height,
  unoptimized = false,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  unoptimized?: boolean;
}) {
  return (
    <figure className="m-0 content-flow mb-10">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized={unoptimized}
        className="block h-auto w-full rounded-xl border border-[color:var(--border)] shadow-md"
      />
      <figcaption className="text-center text-sm leading-7 text-[color:var(--muted)] mt-3">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function SimulatingCivilizationsIIPage() {
  return (
    <article className="content-flow">
      <Link
        href="/cromblog"
        className="inline-flex text-sm text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
      >
        Back to Cromblog
      </Link>

      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] px-6 py-10 shadow-card sm:px-8 sm:py-14">
        <div className="mx-auto max-w-[760px] content-flow">

          <header className="content-flow">
            <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
              Cromblog
            </p>
            <h1 className="font-serif text-4xl text-ink sm:text-5xl">
              {post.title}
            </h1>
            <p className="text-sm text-pine-700/80">
              {post.date} &middot; {post.readTime}
            </p>
          </header>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Last month, I developed{" "}
              <Link
                href="/projects"
                className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                Clashvergence
              </Link>{" "}
              as a Python-based simulation of how human polities develop. Most of
              the effort went into making the system&#8217;s logic plausible: having
              countries make reasonable choices about whether to develop, expand,
              trade, make war, and so on.
            </p>
            <p>
              The UI prototype I was using generated a web page to display the
              simulation. It worked reasonably well for showing a crude map and
              presenting simulation details in a way I could reference easily
              while developing.
            </p>
            <p>
              In this post, I am taking a break from simulation logic to focus on
              the aesthetics of the world. I deliberately built Clashvergence so
              the simulation could unfold without depending on a particular UI. In
              theory, the same simulation could run through many different visual
              interfaces. In an attempt to create more visually appealing and
              informative maps, I have developed a{" "}
              <Link
                href="/projects"
                className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                World Builder
              </Link>{" "}
              app that is compatible with Clashvergence. This doesn&#8217;t just make
              the simulation prettier; it gives each simulated history a more
              believable stage.
            </p>
            <p>
              World Builder is inspired by the map-editing mode in Civilization
              games. It is composed of a hexagonal grid where hexes have distinct
              terrain types and climates. Users can generate random maps based on
              a set of design metrics.
            </p>
          </div>

          <Figure
            src="/cromblog/simulating-civilizations-ii/generator-settings.png"
            alt="The random map generator settings panel in World Builder"
            caption="The random map generator settings screen"
            width={780}
            height={820}
          />

          <Figure
            src="/cromblog/simulating-civilizations-ii/generated-map.png"
            alt="A randomly generated Province-scale map in World Builder"
            caption="A randomly generated map in World Builder"
            width={1456}
            height={818}
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              The app also allows users to make their own maps from scratch. As
              an example, I took a fantasy world map I drew by hand years ago and
              used the underlay feature to create a World Builder version.
            </p>
          </div>

          <Figure
            src="/cromblog/simulating-civilizations-ii/azhora-map.png"
            alt="A custom map of the fictional continent of Azhora in World Builder"
            caption="Custom map of the fictional continent of Azhora"
            width={1456}
            height={818}
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              I plan on returning to this map in the future because I would like
              to use it as a prototype for developing a fictional world with rich
              lore built on a foundation of unique languages.
            </p>
            <p>
              First, I want to keep developing Clashvergence as a
              history-generating engine, so I have made World Builder compatible
              with it as the next step toward creating a richer UI. In short,
              World Builder is the map-editor interface, Clashvergence is the game
              engine that runs the actual simulation, and the two separate programs
              are bridged by a script that translates World Builder regions into
              Clashvergence regions.
            </p>
            <p>
              The World Builder app can thus call upon Clashvergence to add
              history simulations to its maps.
            </p>
          </div>

          <Figure
            src="/cromblog/simulating-civilizations-ii/hex-simulation.gif"
            alt="An animated map showing 50 turns of a Clashvergence simulation on a randomly generated World Builder map"
            caption="The first 50 turns of a simulation on a small randomly generated map"
            width={996}
            height={560}
            unoptimized
          />

        </div>
      </div>
    </article>
  );
}
