import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["test-post"];

export const metadata: Metadata = {
  title: post.title
};

export default function TestPostPage() {
  return (
    <article className="content-flow">
      <Link
        href="/cromblog"
        className="inline-flex text-sm text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
      >
        Back to Cromblog
      </Link>

      <header className="content-flow rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
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
        <p className="editorial-copy text-lg leading-8 text-pine-800">
          This is a placeholder entry meant to test the reading experience,
          establish a visual rhythm, and leave behind a clean template for the
          first real post.
        </p>
      </header>

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="article-prose">
          <p>
            A blog usually tells you what it wants to be before it tells you
            what it has to say. Layout, spacing, type scale, and pacing all
            make promises. This post exists to make sure Cromblog can hold a
            long thought without getting noisy or cramped.
          </p>

          <p>
            The goal here is simple: give future writing a stable frame. That
            means a headline that can breathe, metadata that is visible without
            stealing attention, paragraph spacing that feels calm, and enough
            structure to support sections, lists, and pull quotes when a piece
            needs them.
          </p>

          <h2>What This Post Is Testing</h2>

          <p>
            This sample entry is mainly here to prove out a few practical
            things:
          </p>

          <ul>
            <li>a readable article width</li>
            <li>clear hierarchy between title, metadata, and body</li>
            <li>pleasant spacing for paragraphs and subheads</li>
            <li>a blog index that can grow without looking cluttered</li>
          </ul>

          <blockquote>
            Good formatting disappears at exactly the moment good writing needs
            the room.
          </blockquote>

          <h2>Room for the Real Thing</h2>

          <p>
            Once the first real post is ready, this page can disappear without
            much ceremony. The useful part is the structure it leaves behind:
            a list page that can hold multiple entries and a post page that
            already knows how to handle intros, sections, quotes, and links.
          </p>

          <p>
            That should make the next step pleasantly boring. Write the piece,
            drop it in, and let the page get out of the way.
          </p>
        </div>
      </section>
    </article>
  );
}
