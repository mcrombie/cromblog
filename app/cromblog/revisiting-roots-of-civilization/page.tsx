import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["revisiting-roots-of-civilization"];

export const metadata: Metadata = {
  title: post.title
};

function Figure({
  src,
  alt,
  caption,
  width,
  height,
  unoptimized = false
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  unoptimized?: boolean;
}) {
  return (
    <figure className="m-0 content-flow">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized={unoptimized}
        className="block h-auto w-full rounded-xl border border-[color:var(--border)] shadow-md"
      />
      <figcaption className="text-center text-sm leading-7 text-[color:var(--muted)]">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function RevisitingRootsOfCivilizationPage() {
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
              Is it possible to simulate the rise and fall of civilizations and
              automatically generate their histories? Ever since playing{" "}
              <em>Civilization IV: Rhye&#8217;s and Fall of Civilization</em>,
              I have been curious about how computer simulations can be used to
              demonstrate historical processes.
            </p>

            <p>
              Years ago, on my first iteration of this blog, I wrote an
              interactive essay called{" "}
              <Link
                href="/projects/polity"
                className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                The Root of Civilization
              </Link>{" "}
              simulating how human populations growing around fresh water in
              temperate climates would multiply and develop cities. I programmed
              a system in Angular for displaying the phenomenon. You can see an
              example set in the Fertile Crescent below.
            </p>
          </div>

          <Figure
            src="/cromblog/revisiting-roots/polity-fertile-crescent.gif"
            alt="Animated Polity Fertile Crescent simulation showing bands developing into villages and town-like settlements along rivers"
            caption="A fresh run of the Polity Fertile Crescent simulation, showing mobile bands multiplying into villages and eventually town-like urban centers along river corridors."
            width={900}
            height={620}
            unoptimized
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Over the last few weeks, I revisited this idea, except this time
              around I was supercharged by Codex. This new system doesn&#8217;t
              just simulate population growth and the emergence of cities. It
              also simulates competing factions, expanding territories, and the
              emergence of complex political and economic structures.
            </p>

            <p>
              My initial careful planning gave way to rapid iteration as Codex
              began introducing features that would have taken weeks to build
              manually. Honestly, I did not expect to have such a powerful tool
              for coding in my lifetime. The remarkable thing is how well the
              program continued to function each iteration even as I piled on
              more complexity. You can see an example of the working display
              below.
            </p>
          </div>

          <Figure
            src="/cromblog/revisiting-roots/clashvergence-thirty-seven-ring-realms-framed.gif"
            alt="Animated Clashvergence simulation of a thirty-seven region ring map"
            caption="An atlas-mode Clashvergence playback from the thirty-seven-region ring scenario, run for 250 turns with four inland-start factions and realm labels enabled."
            width={900}
            height={900}
            unoptimized
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Instead of a single growth model,{" "}
              <a
                href="https://github.com/mcrombie/Clashvergence"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                Clashvergence
              </a>{" "}
              now produces interacting regions and factions, each evolving over
              time. The aim is not just to simulate systems, but to generate
              histories from them. Each region has its own history, economy, and
              politics.
            </p>
          </div>

          <Figure
            src="/cromblog/revisiting-roots/clashvergence-selected-region-event-framed.png"
            alt="Selected Clashvergence region with map highlight and regional economy statistics"
            caption="A selected mid-game region in atlas mode: settlement level, population, resources, taxable value, routes, and technology all exist as separate state."
            width={1400}
            height={821}
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              The same is true for factions. I am trying to replicate as much of
              human political economy as I can, with the eventual goal of having
              each simulation generate its own unique history.
            </p>
          </div>

          <Figure
            src="/cromblog/revisiting-roots/clashvergence-selected-faction-focused-framed.png"
            alt="Selected Clashvergence faction with map highlight and political economy statistics"
            caption="A selected late-game faction in atlas mode: territory, treasury, doctrine, capital, production chains, resources, and elite blocs are all part of the model."
            width={1400}
            height={866}
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Ultimately, the goal is for every simulation to produce a
              coherent, readable history written from the perspective of the
              winning factions, that is, those that survived to write their
              stories down.
            </p>

            <p>
              The old{" "}
              <a
                href="https://github.com/mcrombie/polity"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                Polity code
              </a>{" "}
              was about the first roots of settled life. Clashvergence is my
              attempt to see what grows after that.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
