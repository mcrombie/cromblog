import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, isDraftPost, type BlogPost } from "@/content/blog";
import { canPreviewDrafts } from "../draft-preview";

import styles from "./post.module.css";

const post: BlogPost = blogPosts["azhora-iii"];
const hidden = isDraftPost(post) && !canPreviewDrafts();

export function generateMetadata(): Metadata {
  if (hidden) return {};
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

export default function AzhoraIIIPage() {
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
              {isDraftPost(post) ? <span className="post-draft-badge">Draft · not published</span> : post.date}
              {" "}&middot; {post.readTime}
            </p>
          </header>

          <hr className="border-[color:var(--border)]" />

          <figure id="azhora-demo-7" className={styles.videoFigure}>
            <div className={styles.videoFrame}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/7-BWZjqXetg?rel=0"
                title="Azhora Demo 7"
                aria-describedby="azhora-demo-7-caption"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <figcaption id="azhora-demo-7-caption">
              <span>Azhora Demo 7</span>
              <a href="https://www.youtube.com/watch?v=7-BWZjqXetg">Watch on YouTube</a>
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              As I mentioned in my <Link href="/cromblog/azhora-ii">last post on this game</Link>, I got kinda carried away with fantasies of an “everything game.” I am now focusing on the Lizeem War as a first coherent campaign and proof of concept, putting the more ambitious skill systems and broader cast of world characters on hold.
            </p>
            <p>
              The idea is a fusion of two of my favorite kinds of games: 3D role-playing adventures and 4X grand strategy campaigns.
            </p>
            <p>
              I want the player to be a hero in a larger, dynamic war that unfolds around them whether they intervene or not. Armies march, battles resolve, and territory changes hands. The player can influence those events, but the campaign has a life of its own. My longer-term idea is for the larger game to build toward an epic Ragnarök-like climax, where the player’s alliance must confront a powerful invading army. Developing that endgame is still a ways off, though.
            </p>
            <p>
              Even finishing this one opening scenario — the Lizeem War — to my satisfaction leaves me with more design decisions and world building than I have the bandwidth for now. It has given me a clearer idea of what I want the game mechanics to be and what I am working toward, but to really do this game well I would need to make it my main project for at least a few months. For now, I am comfortable keeping it as a side project for fun and learning.
            </p>
            <p>
              The development experience itself remains strange. Virtually all of my time goes toward design decisions and managing AI usage. I spend surprisingly little of it reading or writing code. In a sense, this is more fun, but it is also more overwhelming. Writing code by hand forces me to concentrate on the logic of a small problem. Working with agents lets me move quickly between ideas, which makes it very easy to keep expanding the project; however, I find myself tempted to add new features when I really should be refining existing ones.
            </p>
            <p>
              I have also developed an insatiable desire for more tokens. Last month I ended up buying both ChatGPT’s and Claude’s $200 plans. Claude and Claude Code had become my preferred tools for a while, but since GPT-6 Astra arrived, I have turned to it for most of the development. Deciding how much usage to spend has become part of deciding what to build next.
            </p>
            <p>
              Part of managing that usage is understanding what the different reasoning settings actually do. According to <a href="https://developers.openai.com/api/docs/guides/reasoning">OpenAI’s reasoning guide</a>, higher settings such as High, Extra High, and Max enable more reasoning on difficult problems, generally at the cost of more time and tokens. <a href="https://learn.chatgpt.com/docs/models">Ultra</a> is distinct in that it uses additional agents to work on separate parts of a task in parallel. This means developers must ask ourselves before every prompt: how much computational effort does this particular problem actually need?
            </p>
            <p>
              What continues to baffle me is how little of the implementation I seem to need to understand. I find myself wondering whether someone who couldn’t explain a for loop could have developed this. Perhaps having less sense of what should constrain them would even help.
            </p>
            <p>
              This has raised the question in my mind: does knowing how to code make me better at this, or just less afraid to try?
            </p>
            <p>I don’t know.</p>
            <p>
              I do know that my ChatGPT Pro subscription expires today (my Claude Max subscription expired a week ago), and I don’t plan on renewing this month.
            </p>
            <p>I need a break from coding agents.</p>
            <p>
              I spent the last month trying to get as much out of these subscriptions as I could, and I think I derived a heck of a lot of value, but I also feel burnt out.
            </p>
            <p>
              Beyond this game and my other software experiments, I found ChatGPT Astra in particular immensely helpful with giving me editorial feedback and even expertly typesetting my book. That has been my focus this last week, and I intend for my next post to be an announcement that the paperback is ready. Once that is done, it will be time for a significant break and recalibration as I prepare to look for a new job.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
