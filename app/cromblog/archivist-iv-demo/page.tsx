import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

import styles from "./post.module.css";
import { YouTubeDemo } from "./youtube-demo";

const post = blogPosts["archivist-iv-demo"];
const youtubeVideoId = "K7eqp6rh_tQ";

const linkClass =
  "text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950";

export const metadata: Metadata = {
  title: post.title,
  description: post.summary,
  openGraph: {
    type: "article",
    title: post.title,
    description: post.summary,
    images: [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.image.alt }]
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.summary,
    images: [post.image.src]
  }
};

export default function ArchivistIvDemoPage() {
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
              {post.date} &middot; {post.readTime}
            </p>
          </header>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Last month, I wrote about how I{" "}
              <Link href="/cromblog/evaluator-also-has-to-be-evaluated" className={linkClass}>
                evaluated the RAG system
              </Link>{" "}
              in my Archivist project, and then I followed up with another post on{" "}
              <Link href="/cromblog/archivist-iii-lowering-latency" className={linkClass}>
                how I reduced latency
              </Link>
              .
            </p>
            <p>
              In this post, I am finally getting around to showing off what
              Archivist can do and how fast. Since that last post I have also
              made some tweaks to the application’s UI, mostly to make the screen
              less busy and more intuitive for users. This time around, now that I
              am generally satisfied with functionality, I am focusing on
              presentation.
            </p>
          </div>

          <figure className={styles.videoFigure}>
            <YouTubeDemo
              videoId={youtubeVideoId}
              title="Archivist Demo"
              poster={post.image}
              captionId="archivist-demo-caption"
            />
            <figcaption id="archivist-demo-caption">
              <span>
                Archivist answers what Cradle of the Empire is about, what it says
                about John Smith, and a GDP question the manuscript cannot answer.
                1:51.
              </span>
              <a href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}>Watch on YouTube</a>
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              I may rerecord this short demo in the coming weeks as I refine my
              video performance and editing skills. I am also considering
              recording a longer demo that goes more into the technical details of
              the application as well as the nuances involved in my manuscript, a
              sort of long-form demo-discussion mixing software developer and
              historian perspectives.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
