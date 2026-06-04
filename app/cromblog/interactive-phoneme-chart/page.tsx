import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["interactive-phoneme-chart"];

export const metadata: Metadata = {
  title: post.title
};

function Figure({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="m-0 content-flow mb-10">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block h-auto w-full rounded-xl border border-[color:var(--border)] shadow-md"
      />
      <figcaption className="text-center text-sm leading-7 text-[color:var(--muted)] mt-3">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function InteractivePhonemeChartPage() {
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
              I have rebuilt one of my early web projects&mdash; an{" "}
              <Link
                href="/projects/phoneme-chart"
                className="text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                interactive phoneme chart
              </Link>
              . It was a dark blue page full of IPA symbols, language buttons,
              category toggles, and audio clips. The idea was simple: select a
              language, click around the chart, and hear how its sounds are
              pronounced. It became a handy tool for identifying the distinct
              and shared phonemes of Mandarin Chinese and English.
            </p>
          </div>

          <Figure
            src="/cromblog/interactive-phoneme-chart/original-phoneme-chart.png"
            alt="Original Interactive Phoneme Chart interface with language controls, an IPA consonant table, and a speaker icon"
            width={1615}
            height={832}
            caption="Original Phoneme Chart"
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Looking back at it now, I can see that the interface was too
              dense. The table dominated the whole screen, the controls were
              vague, and the audio system was tied directly to the markup. The
              idea was still solid, though.
            </p>

            <p>
              To fix it up, I introduced a more elaborate control panel to the
              left of the full IPA chart. From there, users can access a second
              language-specific view built from background data about each
              language. I also cleaned up the data model by moving the phoneme
              and language information into TypeScript objects.
            </p>

            <p>
              I added seven real languages, along with historical context for
              each: Spanish, Arabic, Japanese, Hindi, Russian, German, and
              French. As part of my ongoing civilization simulation project, I
              also introduced five constructed languages from my Azhora project:
              Mittoli, Moreshi, Bouéni, West Pyrosi, and Central Grassic.
            </p>
          </div>

          <Figure
            src="/cromblog/interactive-phoneme-chart/upgraded-phoneme-chart.png"
            alt="Upgraded Interactive Phoneme Chart with IPA Atlas and Language View modes, a sidebar showing real and constructed languages, and a description panel"
            width={1400}
            height={860}
            caption="Upgraded Phoneme Chart"
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              The result is still simple, but it is now much closer to the kind
              of reusable linguistic tool I can connect to future worldbuilding
              and civilization-simulation projects.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
