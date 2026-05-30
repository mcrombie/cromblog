import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isDraftPreviewRequest } from "@/app/cromblog/draft-preview";
import { blogPosts, isPublishedPost, type BlogPost } from "@/content/blog";

const post: BlogPost = blogPosts["pomodoro-clock"];

export const metadata: Metadata = {
  title: post.title
};

type PomodoroClockPageProps = {
  searchParams?: {
    preview?: string;
  };
};

function OriginalVersionFigure() {
  return (
    <figure className="m-0 content-flow">
      <Image
        src="/cromblog/pomodoro-clock/original-pomodoro-clock.png"
        alt="Original Pomodoro Clock interface with break length, session length, timer, start, pause, and reset controls"
        width={1534}
        height={596}
        className="block h-auto w-full rounded-xl border border-[color:var(--border)] shadow-md"
      />
      <figcaption className="text-center text-sm leading-7 text-[color:var(--muted)]">
        The original Pomodoro clock: two duration controls, a central session
        timer, and a playful oversized visual layout.
      </figcaption>
    </figure>
  );
}

export default function PomodoroClockPage({
  searchParams
}: PomodoroClockPageProps) {
  const isPublished = isPublishedPost(post);

  if (!isPublished && !isDraftPreviewRequest(searchParams)) {
    notFound();
  }

  return (
    <article className="content-flow">
      <Link
        href="/cromblog?status=drafts"
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
              One of my old FreeCodeCamp projects was a Pomodoro clock: a
              React app with break and session length controls, a start/pause
              button, a reset button, and a timer that switches between focused
              work and rest. It is small, but it has the familiar shape of a
              real application. It takes input, tracks state over time, and has
              to behave correctly when the user changes settings midstream.
            </p>

            <p>
              Looking back at it now, I still like the directness of the idea.
              A timer is easy to underestimate because the interface is simple,
              but the logic underneath is full of tiny promises: a second should
              be a second, reset should really reset, pause should not create
              another hidden interval, and the display should always tell the
              truth about what the app is doing.
            </p>
          </div>

          <OriginalVersionFigure />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              The rough edges are clear too. The original version is an older
              Create React App project with a class component, manual method
              bindings, direct DOM manipulation for icon sizing, and an audio
              element wired to a remote sound file. Even getting it running
              again exposed the age of the stack: modern Node needs an OpenSSL
              compatibility flag for the old webpack toolchain.
            </p>

            <p>
              The next step is to fix and amplify it. By fix, I mean turning
              the timer into a more explicit state machine, cleaning up interval
              lifecycle behavior, making pause and reset reliable, and moving
              styling away from accidental geometry into a deliberate responsive
              layout. By amplify, I mean letting the project become a better
              example of product thinking: a small focused tool that feels calm,
              legible, and trustworthy.
            </p>

            <p>
              A stronger version could include keyboard-friendly controls,
              saved duration presets, local audio, browser notifications, a
              small session history, and tests for the timer transitions. The
              core app does not need to become large. It needs to become precise.
            </p>

            <p>
              This is only the draft before the rebuild. I want to keep the
              original screenshot because it captures the project at the moment
              where it is functional but fragile: enough of an app to care
              about, and enough of an old app to show exactly what a rebuild can
              improve.
            </p>

            <h2>Working Notes</h2>
            <ul>
              <li>Replace implicit timer behavior with explicit timer states.</li>
              <li>Clean up interval creation and teardown.</li>
              <li>Remove direct DOM manipulation from React state changes.</li>
              <li>Make controls accessible and predictable.</li>
              <li>Use the rebuild to show disciplined small-app architecture.</li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
