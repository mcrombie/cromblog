import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isDraftPreviewRequest } from "@/app/cromblog/draft-preview";
import { blogPosts, isPublishedPost, type BlogPost } from "@/content/blog";

const post: BlogPost = blogPosts["interactive-phoneme-chart"];

export const metadata: Metadata = {
  title: post.title
};

function OriginalVersionFigure() {
  return (
    <figure className="m-0 content-flow">
      <Image
        src="/cromblog/interactive-phoneme-chart/original-phoneme-chart.png"
        alt="Original Interactive Phoneme Chart interface with language controls, an IPA consonant table, and a speaker icon"
        width={1615}
        height={832}
        className="block h-auto w-full rounded-xl border border-[color:var(--border)] shadow-md"
      />
      <figcaption className="text-center text-sm leading-7 text-[color:var(--muted)]">
        The original phoneme chart: dark blue interface, language controls, a
        dense consonant table, and audio-first interaction.
      </figcaption>
    </figure>
  );
}

type InteractivePhonemeChartPageProps = {
  searchParams?: {
    preview?: string;
  };
};

export default function InteractivePhonemeChartPage({
  searchParams
}: InteractivePhonemeChartPageProps) {
  const isPublished = isPublishedPost(post);

  if (!isPublished && !isDraftPreviewRequest(searchParams)) {
    notFound();
  }

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
              {isPublished ? post.date : "Draft"} &middot; {post.readTime}
            </p>
          </header>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              One of my early web projects was an interactive phoneme chart: a
              dark blue page full of IPA symbols, language buttons, category
              toggles, and audio clips. The idea was simple enough. Select a
              language or phoneme category, click around the chart, and hear what
              the sounds are supposed to do.
            </p>

            <p>
              Looking back at it now, I still like the instinct behind the
              project. Phonology can become abstract very quickly. A chart full
              of consonants and vowels is useful, but it is much more useful
              when the symbols are connected to sound, examples, and a little
              bit of explanation. The original version was trying to make the
              IPA tactile.
            </p>
          </div>

          <OriginalVersionFigure />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              The rough edges are also obvious. The interface is dense, the
              table dominates the whole screen, the controls read more like a
              prototype than a tool, and the audio system is tied directly to the
              markup. It works as evidence of enthusiasm, but not yet as a
              durable language-learning application.
            </p>

            <p>
              The next step is to fix and amplify it. By fix, I mean making the
              old project cleaner: less brittle markup, better responsive
              behavior, clearer interaction states, and a data model that can
              represent phonemes without scattering the logic across the page.
              By amplify, I mean letting the original idea grow into what it was
              gesturing toward: a more useful tool for exploring how languages
              organize sound.
            </p>

            <p>
              A stronger version could compare language inventories, show
              articulatory features in plain language, let users search by
              symbol or sound type, and make each click answer three questions:
              what is this sound, how is it produced, and where does it appear?
            </p>

            <p>
              This is only the draft before the rebuild. I want to preserve the
              original screenshot because it records the project at a useful
              stage: earnest, functional, overstuffed, and not yet aware of what
              it wants to become. That is often the best kind of old project to
              revisit. It has enough life in it to be worth saving, and enough
              awkwardness in it to show exactly where the next version should
              go.
            </p>

            <h2>Working Notes</h2>
            <ul>
              <li>Keep the chart audio-centered, since sound is the point.</li>
              <li>Move phoneme data into a structured source.</li>
              <li>Make English, Chinese, and IPA views feel like real modes.</li>
              <li>Add responsive layouts for small screens.</li>
              <li>Use the redesign to explain phonology, not just display it.</li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
