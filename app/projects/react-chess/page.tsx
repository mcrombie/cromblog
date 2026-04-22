import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/content/site";

const project = projects["react-chess"];
const ReactChessEmbed = dynamic(
  () => import("@/components/react-chess-embed"),
  {
    ssr: false,
    loading: () => (
      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
          Loading board
        </p>
        <p className="mt-3 text-base leading-8 text-pine-800">
          Preparing the interactive chess rebuild.
        </p>
      </section>
    )
  }
);

export const metadata: Metadata = {
  title: "React-Chess"
};

export default function ReactChessPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow={project.status}
        title={project.title}
        description={project.summary}
      />

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-card sm:p-8">
        <dl className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm uppercase tracking-[0.18em] text-pine-700">
                Project type
              </dt>
              <dd className="mt-2 text-lg text-ink">{project.type}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.18em] text-pine-700">
                Current focus
              </dt>
              <dd className="mt-2 text-lg leading-8 text-ink">{project.focus}</dd>
            </div>
          </div>
          {project.demoHref ? (
            <div className="rounded-3xl border border-[color:var(--border)] bg-white/70 p-4 lg:min-w-[18rem]">
              <dt className="text-sm uppercase tracking-[0.18em] text-pine-700">
                Full app
              </dt>
              <dd className="mt-3">
                {project.demoHref.startsWith("/") ? (
                  <Link
                    href={project.demoHref}
                    className="inline-flex w-full items-center justify-center rounded-full border border-pine-800 bg-pine-800 px-5 py-3 text-sm text-pine-50 transition hover:bg-pine-700"
                  >
                    {project.demoLabel ?? "Open standalone app"}
                  </Link>
                ) : (
                  <a
                    href={project.demoHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full border border-pine-800 bg-pine-800 px-5 py-3 text-sm text-pine-50 transition hover:bg-pine-700"
                  >
                    {project.demoLabel ?? "Open standalone app"}
                  </a>
                )}
              </dd>
              <p className="mt-3 text-sm leading-7 text-pine-700">
                The embedded board is meant for immediate play inside the post. Use
                this button to open a roomier full-page version hosted inside the site.
              </p>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="editorial-copy rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="content-flow">
          <p className="text-base leading-8 text-pine-800">
            This page is the first part of a larger comparison project. The plan
            is to place three versions of the same chess app side by side over
            time: the legacy original, a careful patch-up branch, and a full
            rebuild. This page hosts the rebuild first.
          </p>
          <p className="text-base leading-8 text-pine-800">
            The rebuilt version moves the game rules into a dedicated engine and
            lets the page act as a thin interface over typed game state. That
            shift matters because it changes the kinds of mistakes the project is
            likely to make: fewer UI-driven bugs, clearer legal move handling,
            and a codebase that can be tested without clicking through the board.
          </p>
          <p className="text-base leading-8 text-pine-800">
            Instead of talking about that separation abstractly, the article
            folds the game directly into the page. You can play immediately, read
            the framing around it, and later compare the experience against the
            earlier branches when they are wired into the same post.
          </p>
        </div>
      </section>

      <ReactChessEmbed />

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-[color:var(--border)] bg-white/70 p-6 shadow-card sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
            Why this rebuild matters
          </p>
          <div className="mt-4 content-flow editorial-copy">
            <p className="text-base leading-8 text-pine-800">
              The old app stored the board inside one large React component and
              mixed rules, DOM mutation, and rendering together. The rebuild
              turns those concerns into separate layers so the board can be
              reasoned about as data first and interface second.
            </p>
            <p className="text-base leading-8 text-pine-800">
              That does not make the project magically “finished,” but it does
              change the quality of future work. New rules and UI changes can be
              added from a much steadier foundation.
            </p>
          </div>
        </article>

        <article className="rounded-3xl border border-[color:var(--border)] bg-pine-50/70 p-6 shadow-card sm:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
            What comes next
          </p>
          <div className="mt-4 content-flow editorial-copy">
            <p className="text-base leading-8 text-pine-800">
              The next steps for the post are comparative rather than purely
              technical. The legacy branch and the patch-up branch can be mounted
              into this same slot later so the differences become visible in one
              place instead of being scattered across screenshots and code
              excerpts.
            </p>
            <p className="text-base leading-8 text-pine-800">
              That should make the blog post more honest. Readers will be able
              to feel the differences between repair and redesign instead of just
              reading a claim that they exist.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
