import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { blogPosts } from "@/content/blog";

const post = blogPosts["ai-april"];

export const metadata: Metadata = {
  title: post.title
};

export default function AiAprilPage() {
  return (
    <article className="content-flow">
      <Link
        href="/cromblog"
        className="inline-flex text-sm text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
      >
        Back to Cromblog
      </Link>

      <div className="content-flow rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <header className="content-flow">
          <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
            Cromblog
          </p>
          <h1 className="font-serif text-4xl text-ink sm:text-5xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-pine-700/80">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="article-prose">
          <p>
            This is the opening post for the revival of my blog, a site I
            started about seven years ago while learning web development. A lot
            has changed since. Back then, building a website meant writing
            everything manually with HTML, CSS, JavaScript. Now, I can generate
            a working application in minutes using natural language prompts with
            tools like OpenAI Codex.
          </p>

          <p>
            With my history manuscript finished and ready for an editor, I
            decided to spend a month returning to coding and exploring how Large
            Language Models (LLMs) have changed things. Its what I call
            &#8220;Artificial Intelligence April.&#8221;
          </p>

          <p>
            As an exercise, I revisited one of my earliest projects: a simple
            chess app built with React. Looking back at the code, a lot of
            problems now stand out: nearly all logic lived inside a single
            component, game state and UI were tightly coupled, move validation
            was inconsistent, and check and checkmate logic were often wrong.
            Back when I first wrote this code, I didn&#8217;t have the
            experience to recognize these issues.
          </p>

          <p>
            Next, I used Codex to refactor and patch the existing code, creating
            a representation of what the project might have looked like if I had
            taken the time to clean it up myself&#8212;better structure, fewer
            bugs, and more consistent logic. But this raised an unsettling
            question. If AI can fix broken code in seconds, is there still value
            in struggling through it manually?
          </p>

          <p>
            Finally, I tried one more approach. Instead of fixing the old code,
            I prompted Codex to rebuild the application from scratch based on
            the original chess app idea. With remarkable speed, this produced a
            much cleaner, more modern implementation with a clearer separation
            of concerns.
          </p>

          <figure className="not-prose my-8">
            <Image
              src="/chess-gameplay.gif"
              alt="Animated chess board showing the Ruy Lopez opening"
              width={480}
              height={480}
              unoptimized
              className="mx-auto rounded-xl shadow-lg"
            />
          </figure>

          <p>
            You can see the full app{" "}
            <Link
              href="/projects/react-chess"
              className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
            >
              here
            </Link>
            .
          </p>

          <p>
            These new tools appear to be nothing less than a revolutionary step
            forward in the power of software development. The challenge seems to
            be transitioning from writing code to knowing what to build,
            recognizing when there are issues, and guiding AI systems toward
            ever better solutions. In other words, AI doesn&#8217;t eliminate
            the need for developers; it changes our role. Though this shift is
            both exciting and alarming, for now, I&#8217;m going to lean into
            it. Otherwise, I feel I would be sailing against the wind.
          </p>
        </div>
      </div>
    </article>
  );
}
