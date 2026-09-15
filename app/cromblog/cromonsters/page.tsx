import type { Metadata } from "next";
import Link from "next/link";

import { PromptPanel } from "@/components/prompt-panel";
import { blogPosts } from "@/content/blog";
import prompts from "@/content/cromonsters-prompts.json";

import styles from "./post.module.css";

const post = blogPosts["cromonsters"];
const media = "/cromblog/cromonsters";
// Keep the original announcement's social preview tied to its historical playtest.
const originalPreview = {
  src: `${media}/test-2-poster.jpg`,
  alt: "Cromonsters! gameplay with a muted four-shade palette and original pixel-art creatures"
};

export const metadata: Metadata = {
  title: post.title,
  description: post.summary,
  openGraph: {
    type: "article",
    title: post.title,
    description: post.summary,
    images: [{ url: originalPreview.src, width: 1280, height: 720, alt: originalPreview.alt }]
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.summary,
    images: [originalPreview.src]
  }
};

function PlaytestVideo({ revision }: { revision: 1 | 2 }) {
  const caption = `playtest-${revision}-caption`;
  return (
    <figure className={styles.videoFigure}>
      <video
        controls
        playsInline
        preload="metadata"
        width={1920}
        height={revision === 1 ? 938 : 1080}
        poster={`${media}/test-${revision}-poster.jpg`}
        aria-label={revision === 1 ? "Cromonsters first playtest" : "Cromonsters revised playtest"}
        aria-describedby={caption}
      >
        <source src={`${media}/cromonsters_test_${revision}.mp4`} type="video/mp4" />
        Your browser does not support embedded video. Use the video link below to watch.
      </video>
      <figcaption id={caption}>
        <span>
          {revision === 1
            ? "First build: exploring Latchleaf and trying the original battle interface. 1:28."
            : "Second build: a more restrained pixel-art style and a more familiar battle flow. 1:48."}
        </span>
        <a href={`${media}/cromonsters_test_${revision}.mp4`}>Open video</a>
      </figcaption>
    </figure>
  );
}

export default function CromonstersPage() {
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
            <p className="text-sm">
              <a
                href="https://github.com/mcrombie/cromonsters"
                className="text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                View Cromonsters! on GitHub
              </a>
            </p>
          </header>

          <aside className="rounded-2xl border border-[color:var(--border)] p-5">
            <p className="mb-3 text-sm text-pine-800">
              The latest prototype follows a farmhand through the estate prologue and a goblin raid’s aftermath.
              The post and videos below document the original September builds.
            </p>
            <Link href="/games/cromonsters" className="folio-button">Play the latest Cromonsters</Link>
          </aside>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>{"I was hiking with a friend yesterday and he mentioned there was a new Pokémon game coming out next year. I stopped following the franchise a long time ago, but I played the games and watched the show so much when I was a kid that to this day I could still pretty easily identify the 150 first-generation Pokémon."}</p>
            <p>{"It occurred to me while hiking how relatively simple the original Game Boy Pokémon game was and that it would probably be trivially easy to rebuild the mechanics with modern AI agent programming."}</p>
            <p>{"So I did."}</p>
            <p>{"Sort of."}</p>
            <p>{"I wrote a prompt to Codex (GPT-6 Astra) basically asking it to spoof Pokémon by creating a game called Cromon (I like making puns off my last name):"}</p>
          </div>

          <PromptPanel
            id="initial-prompt"
            title="The initial game-building prompt"
            prompt={prompts.initial}
            downloadHref={`${media}/initial-prompt.txt`}
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>{"It is extraordinary how, in about 30 minutes, Codex returned a game written in TypeScript and readily playable in the browser."}</p>
            <p>{"Here is a brief sample video:"}</p>
          </div>

          <PlaytestVideo revision={1} />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>{"I followed up with a loose, stream-of-consciousness prompt mainly concerned with improving the graphics and making the gameplay more familiar:"}</p>
          </div>

          <PromptPanel
            id="revision-prompt"
            title="The graphics and gameplay follow-up"
            prompt={prompts.revision}
            downloadHref={`${media}/revision-prompt.txt`}
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>{"After just over 40 more minutes, Codex revamped the graphics and made the combat portion almost an exact replica of the Pokémon gameplay."}</p>
            <p>{"Here is a brief sample video:"}</p>
          </div>

          <PlaytestVideo revision={2} />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>{"This little game is a proof of concept that I doubt I will flesh out into a full-blown game. I have enough ongoing projects already, which is why I time-boxed this experiment to the few hours I have before going into work this morning. The fact that I can create something like this so fast now still boggles my mind, even more so because of how GPT-6 Astra’s code looks."}</p>
            <p>{"My role as a developer is increasingly looking like one of high-level design through writing standard English instructions. The constraints to software development seem to have shifted from human coding ability and time to high-level designing ability and token availability. More often than not, my imagination is outrunning the remaining usage on my Codex and Claude subscriptions."}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
