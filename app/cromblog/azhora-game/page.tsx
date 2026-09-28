import type { Metadata } from "next";
import Link from "next/link";

import { PromptPanel } from "@/components/prompt-panel";
import { originalAzhoraPrompt } from "@/content/azhora-game-prompt";
import { blogPosts } from "@/content/blog";

import styles from "./post.module.css";

const post = blogPosts["azhora-game"];

export const metadata: Metadata = {
  title: post.title,
  description: post.summary,
  alternates: { canonical: post.href },
  openGraph: {
    type: "article",
    title: post.title,
    description: post.summary,
    publishedTime: "2026-09-28",
    images: [{ url: "/og.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.summary,
    images: ["/og.png"]
  }
};

export default function AzhoraGamePage() {
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
            <p className="text-xs uppercase tracking-[0.22em] text-pine-700">Cromblog</p>
            <h1 className="font-serif text-4xl text-ink sm:text-5xl">{post.title}</h1>
            <p className="text-sm text-pine-700/80">{post.date} &middot; {post.readTime}</p>
          </header>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <blockquote>
              <p>
                “All the drudgery of replicating and managing open source projects is
                evaporating at lightning speed, and we are left with the golden juicy
                parts, the bone marrow of software development, deciding what
                should this thing do and where should it go?”
              </p>
              <footer className={styles.quoteSource}>
                — David Heinemeier Hansson (DHH),{" "}
                <a href="https://lexfridman.com/dhh-2-transcript/">
                  Lex Fridman Podcast #501
                </a>{" "}
                · <a href="https://www.youtube.com/watch?v=NYFGCESmikA&t=2125">35:25</a>
              </footer>
            </blockquote>

            <p>
              I am still in awe of how true this feels and am letting myself
              indulge in a side project that is as fun as it is ambitious.
            </p>
            <p>
              I resisted making games for a while, but then, over the last few
              weeks, I used my ChatGPT Pro plan to go nuts. On September 14, I used up
              every last token in a frenzy of voice-to-text programming with
              Wispr, while Codex worked on at least four projects simultaneously:{" "}
              <Link href="/art">Doodle Lab</Link>,{" "}
              <Link href="/cromblog/clio">Clio</Link>,{" "}
              <Link href="/cromblog/cromonsters">Cromonsters</Link>, and a vast
              fourth project I am calling simply{" "}
              <a href="https://github.com/mcrombie/azhora-game">Azhora</a>.
            </p>
            <p>
              Looking back, when I was working on the{" "}
              <a href="https://github.com/mcrombie/world-builder/tree/main/azhora_lore">Azhora lore</a>, I was
              actually building the bones of this world I am now speaking to life.
            </p>

            <h2 id="voice-to-text">Voice to Text</h2>
            <p>
              Speaking Azhora into existence has blown my mind more than any of
              these other projects.
            </p>
          </div>

          <figure id="gameplay" className={styles.videoFigure}>
            <div className={styles.videoFrame}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/fiMvaI1lyjc?rel=0"
                title="Azhora Demo 1 — in-game footage"
                aria-describedby="azhora-gameplay-caption"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <figcaption id="azhora-gameplay-caption">
              <span>Azhora Demo 1 — in-game footage</span>
              <a href="https://www.youtube.com/watch?v=fiMvaI1lyjc">Watch on YouTube</a>
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Creating a game by simply speaking a loose stream of consciousness
              about how you want it to work is almost as fun as playing it.
            </p>
            <p>
              I am amazed at how many words I can produce so quickly while
              speaking. In a couple of hours, I churned out about 10,000 words
              describing what I wanted Azhora to be.
            </p>
            <p>
              Here is that full prompt, with the voice-to-text mistakes and
              wandering ideas intact. It describes a much bigger game than the
              prototype I have built so far, including planned story spoilers.
            </p>
          </div>

          <PromptPanel
            id="original-prompt"
            title="The Azhora voice-to-text development prompt"
            prompt={originalAzhoraPrompt}
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <h2 id="ai-coding-models">AI Coding Models</h2>
            <p>
              I recorded that massive prompt after I ran out of usage with
              Codex. The plan seemed like an incredible deal. It makes me wonder
              how OpenAI will balance its subscriptions with developers like me
              who have an insatiable desire for more tokens.
            </p>
            <p>So I decided to switch to Claude’s Max plan for September.</p>
            <p>
              For this project, that meant the somewhat awkward step of handing
              it over from GPT-6 Astra in Codex to Claude Fable, using Claude
              Code’s{" "}
              <a href="https://claude.com/blog/introducing-dynamic-workflows-in-claude-code">
                ultracode setting
              </a>.
              I was curious to see how they would work differently. Since the
              game’s core design was already laid out, I expected Fable to be
              able to pick up where Codex left off.
            </p>

            <h2 id="conclusion">Conclusion</h2>
            <p>
              I was amazed that I could have the basis for a 3D adventure game
              in a few hours. After a couple of weeks of development, I have
              fleshed it out a lot more, but there is still a lot of work to do
              before it is a full game.
            </p>
            <p>
              Still, I figured I would write an introductory post because there
              will be more to come. This project has really gotten me sidetracked
              over the last week. I have found making it even more fun than
              Cromonsters or Clio, partly because it will bring together some
              of my favorite ideas from both games.
            </p>
          </div>

        </div>
      </div>
    </article>
  );
}
