import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { blogPosts } from "@/content/blog";
import { doodleAssets } from "@/content/doodles";

import { SunflowerBloom } from "./sunflower-bloom";

const post = blogPosts["an-auspicious-august"];
const owl = doodleAssets["owl-on-branch-01"];
const wren = {
  src: "/cromblog/doodles/carolina-wren-restored-01.png",
  image: { width: 2105, height: 1682 }
} as const;
const crombot = doodleAssets["crombot-1-01"];

const externalLinkClass =
  "font-medium text-pine-800 underline decoration-pine-400 underline-offset-4 transition hover:text-pine-950";

export const metadata: Metadata = {
  title: post.title,
  description: post.summary
};

export default function AnAuspiciousAugustPage() {
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
              {post.date} &middot; {post.readTime}
            </p>
          </header>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Last month, I set out to have myself an Auspicious August.
              Auspicious means “showing or suggesting future success is
              likely.”
            </p>

            <p>
              Following the etymological roots of my alliterative month design
              led me to the Latin word <em>auspex</em>. It means “bird seer” or
              “bird watcher.” Back in ancient Roman times, augurs would watch
              how birds flew and ate to discern signs from the gods. This is
              also the origin of the noun <em>auspice</em>—meaning a sign, omen,
              or prophetic token.
            </p>

            <p>
              At this time in my life, as I just start the search for a new job,
              I am hoping for favorable auspices, and I decided to take this
              alliteration as a sign to take up birdwatching—apparently a pretty
              common hobby for people to take up in their thirties anyway. Over
              the last month, I finally became aware of all the different
              species of birds around me and all their distinct sounds.
            </p>
          </div>

          <figure className="auspicious-media-panel m-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
            <Image
              src={owl.src}
              alt="Graphite doodle of a front-facing horned owl perched on a bent branch."
              width={owl.image.width}
              height={owl.image.height}
              loading="lazy"
              sizes="(max-width: 760px) 88vw, 680px"
              className="mx-auto block h-auto w-full max-w-[36rem] object-contain p-6 sm:p-9"
            />
            <figcaption className="border-t border-[color:var(--border)] px-5 py-3 font-serif text-sm italic leading-6 text-pine-900/80">
              From the August sketchbook: a horned owl perched on a bent
              branch.
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              I even started drawing a bird each day. The{" "}
              <a
                href="https://merlin.allaboutbirds.org/"
                target="_blank"
                rel="noreferrer"
                className={externalLinkClass}
              >
                Merlin Bird ID app
              </a>{" "}
              was particularly useful for identifying birds by their calls,
              revealing to me the common birds that have long been flying
              around me. After weeks of learning, I decided the Carolina Wren
              will be my favorite bird, the one that I particularly study going
              forward, because of the wren’s ties to good fortune and
              divination.
            </p>
          </div>

          <figure className="auspicious-media-panel m-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
            <Image
              src={wren.src}
              alt="Graphite drawing of a Carolina wren in profile with its tail raised."
              width={wren.image.width}
              height={wren.image.height}
              loading="lazy"
              sizes="(max-width: 760px) 88vw, 680px"
              className="mx-auto block h-auto w-full max-w-[39rem] object-contain p-6 sm:p-9"
            />
            <figcaption className="border-t border-[color:var(--border)] px-5 py-3 font-serif text-sm italic leading-6 text-pine-900/80">
              The Carolina Wren—the bird I chose to follow more closely.
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Interpreting last month’s auspices also led me to another wildly
              different hobby. While looking around for birds on my walk into
              work on August 1st, what do I see instead but a drone flying
              overhead. A curious sign. After thinking about it a couple weeks,
              I decided to take it as a call to build my own robot—{" "}
              <a
                href="https://github.com/mcrombie/crombot"
                target="_blank"
                rel="noreferrer"
                className={externalLinkClass}
              >
                Crombot 1.0
              </a>
              .
            </p>
          </div>

          <figure className="auspicious-media-panel m-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
            <Image
              src={crombot.src}
              alt={crombot.semantics.alt}
              width={crombot.image.width}
              height={crombot.image.height}
              loading="lazy"
              sizes="(max-width: 760px) 88vw, 680px"
              className="mx-auto block h-auto w-full max-w-[38rem] object-contain p-5 sm:p-8"
            />
            <figcaption className="border-t border-[color:var(--border)] px-5 py-3 font-serif text-sm italic leading-6 text-pine-900/80">
              Crombot 1.0, redrawn from the workshop photographs as a graphite
              field study.
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Basically, I am building Crombot to teach myself the basics of
              robotics and electronics. I am especially intrigued by the
              prospect of hooking him up to an AI API, but I am still working
              on refining autonomous locomotion at the moment.
            </p>

            <p>More on Crombot in an upcoming post.</p>

            <p>For now, I want to finish wrapping up my thoughts on August.</p>

            <p>
              There is a case to be made for calling it “Archivist August”
              rather than “Auspicious August” since that is the project I spent
              the most time on. I did multiple posts on it this month, and I am
              still working on the next phase—a video demo.
            </p>

            <p>
              I have decided to make this transition into creating video demos
              a theme of this month—Signal September. The idea is a month-long
              campaign to ship polished evidence of my work, broadcasting it to
              employers through my website with polished applications, demo
              videos, and blog posts.
            </p>

            <p>
              This is also the month where I want to clear my biggest blocker
              to my full-time job search: finishing publishing my history book.
              Just recently, I got positive feedback on{" "}
              <em>Cradle of the Empire</em> and decided to move forward with
              publishing the paperback. I had a proof paperback shipped to me
              by Amazon; however, it is currently delayed for an unexplained
              reason. I am still optimistic, though, and plan to write an
              announcement post that the paperback is available in the coming
              weeks. After all, one of the sunflowers I planted months ago
              finally bloomed.
            </p>
          </div>

          <figure className="auspicious-media-panel m-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-sm">
            <SunflowerBloom />
            <figcaption className="border-t border-[color:var(--border)] px-5 py-3 font-serif text-sm italic leading-6 text-pine-900/80">
              A late bloom: the sunflower opens from bud to full flower.
            </figcaption>
          </figure>
        </div>
      </div>
    </article>
  );
}
