import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, isDraftPost, type BlogPost } from "@/content/blog";
import { canPreviewDrafts } from "../draft-preview";

const post: BlogPost = blogPosts["azhora-iv"];
const hidden = isDraftPost(post) && !canPreviewDrafts();

export function generateMetadata(): Metadata {
  if (hidden) notFound();
  const image = post.image;
  return {
    title: isDraftPost(post) ? `${post.title} (draft)` : post.title,
    description: post.summary,
    robots: isDraftPost(post) ? { index: false, follow: false } : undefined,
    alternates: { canonical: post.href },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: isDraftPost(post) ? undefined : new Date(post.date).toISOString(),
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: image ? [image.src] : undefined
    }
  };
}

export default function AzhoraIVPage() {
  if (hidden) notFound();

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
            <p className="text-sm text-pine-700/80">
              {isDraftPost(post) ? "Draft · not published" : post.date} &middot; {post.readTime}
            </p>
          </header>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              In my <Link href="/cromblog/azhora-iii">last Azhora post</Link>, I described my decision to narrow the game’s development around the Lizeem War, with the goal of producing a coherent experience combining 3D adventure and grand strategy.
            </p>
            <p>
              Since then, I’ve kept making improvements to the game, but I’ve also decided that it’s time to put Azhora on the back burner and focus on finding full-time employment, but, before doing so, I wanted to make the project into a more presentable part of my software development portfolio.
            </p>

            <h2>Simplifying the Game</h2>

            <p>
              One problem that jumped out at me was that Azhora’s opening menu had become something of a developer’s workshop, offering different chapters, experimental scenarios, combat tests, and loading options that made sense to me while developing but weren’t necessarily good for a user encountering the game for the first time.
            </p>
            <p>
              To fix this, I used <a href="https://openai.com/codex/">Codex</a> to reorganize the public launcher around two choices:
            </p>
            <p>
              <strong>Story:</strong> Play through the opening of the Lizeemi War as Teresod, a wizard who can intervene in a larger military campaign that continues unfolding independently of him.
            </p>
            <p>
              <strong>Explore:</strong> Wander around the world freely, without participating in the war.
            </p>
            <p>
              The original developer options remain available separately, so I haven’t removed the experiments and unfinished chapters that I intend to return to later.
            </p>

            <h2>Preparing the Public Release</h2>

            <p>
              In the meantime, I had Codex conduct a more systematic examination of the project’s testing, documentation, loading performance, and deployment process.
            </p>
            <p>
              The results were good, even though they revealed some limitations. In particular, loading the world in Explore mode remains rather slow, sometimes taking around a minute. However, I decided against undertaking another extensive optimization project. Instead I improved the loading feedback and made Story the recommended starting point.
            </p>
            <p>
              I also integrated my latest development changes, including work on the Night Elves of Sevron, while preserving the existing save systems and campaign functionality.
            </p>
            <p>
              Finally, I verified that the version deployed to <a href="https://render.com/">Render</a> actually matched the version I’d tested locally.
            </p>

            <h2>Moving On</h2>

            <p>
              This process was yet another learning experience in using AI coding agents for software development. More than just asking Codex to implement features, I’ve increasingly been using it to investigate problems, run tests, document limitations, and prepare releases. That still leaves plenty of responsibility for me in deciding what to build, evaluating the results, and knowing when to stop.
            </p>
            <p>
              Speaking of stopping, Azhora remains an unfinished and sometimes unwieldy prototype. Nevertheless, I think it now demonstrates something interesting: a player-controlled 3D adventure operating within a larger strategic simulation whose armies, battles, and territorial changes have lives of their own.
            </p>
            <p>
              I’m sure I&apos;ll return to developing it, but for now, I&apos;m satisfied with leaving it here and turning my attention toward the next chapter.
            </p>
            <p>
              <Link href="/games/azhora">Play Azhora</Link>
              {" | "}
              <a href="https://www.youtube.com/watch?v=7-BWZjqXetg">Watch the latest demo</a>
              {" | "}
              <a href="https://github.com/mcrombie/azhora-game">View the source code</a>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
