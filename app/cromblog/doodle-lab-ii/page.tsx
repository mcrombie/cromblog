import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["doodle-lab-ii"];
const panelClass =
  "m-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm";
const captionClass =
  "border-t border-[color:var(--border)] px-5 py-3 font-serif text-sm italic leading-6 text-pine-900/80";

export const metadata: Metadata = {
  title: post.title,
  description: post.summary,
  alternates: { canonical: post.href },
  openGraph: {
    type: "article",
    title: post.title,
    description: post.summary,
    publishedTime: "2026-10-05",
    images: [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.image.alt }]
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.summary,
    images: [post.image.src]
  }
};

export default function DoodleLabIIPage() {
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
            <p className="font-serif text-xl italic text-pine-700 sm:text-2xl">{post.subtitle}</p>
            <p className="text-sm text-pine-700/80">{post.date} &middot; {post.readTime}</p>
          </header>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              A couple of days ago, just as I was preparing to share my portfolio
              with potential employers, my site went down.
            </p>
            <p>That is a bad look, but a good learning experience.</p>
            <p>
              At first I thought it had to do with the{" "}
              <Link href="/cromblog/azhora-game">Azhora game</Link> I started
              serving through <a href="https://render.com/">Render</a>. A few
              minutes of investigating quickly uncovered the real culprit — doodles!
            </p>
          </div>

          <figure className={panelClass}>
            <Image
              src="/views/cromblog/doodle-experiments/round-24/dog-with-a-wrench.webp"
              alt="One of my long-eared notebook dogs holding a wrench, ready to help with the repairs."
              width={1536}
              height={1024}
              unoptimized
              priority
              className="block h-auto w-full"
            />
            <figcaption className={captionClass}>
              A little help with the repairs. A new experiment in{" "}
              <Link href="/art?collection=character-studies#ai-experiments">Doodle Lab</Link>, based on one of my notebook dogs.
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              A few weeks ago I launched a fun project called{" "}
              <Link href="/art">Doodle Lab</Link> where I took five years of
              notebook drawings and turned them into an art gallery for my
              website. I also used them to generate 161 AI art experiments.
            </p>
            <p>
              Then I got an email from <a href="https://vercel.com/">Vercel</a>,
              the service I use to deploy my website, saying:
            </p>
            <blockquote>
              <p>
                “Your free team has used 126% of the included free tier usage for
                Image Optimization - Cache Writes (100,000 Writes). Upgrade to
                Pro to resume service for your projects or wait 30 days
                (November 02, 2026) for your account to unpause.”
              </p>
            </blockquote>
            <p>
              That surprised me at first. Everything else on the site was
              nowhere near its limits. I had used about 11 GB of my 100 GB of
              bandwidth for the month. Why the heck was my website doing so many
              cache writes for image optimization?
            </p>
            <p>
              With the default settings on Vercel, when a website shows a picture
              through Next.js’s Image component, it doesn’t just send the
              original file. Instead, it first asks Vercel for a copy resized and
              recompressed for the user’s screen: smaller for a phone, larger for
              a big monitor, and sharper for a high-density display. Vercel makes
              that copy and stores it in its cache. Then it sends the stored copy
              to the next person who needs the same version.
            </p>
            <p>
              The confusing part is that a “write” isn’t one picture. Vercel{" "}
              <a href="https://vercel.com/docs/image-optimization/limits-and-pricing#image-cache-writes">
                measures these writes in 8 KB units
              </a>, so a single 120 KB copy uses about 15 of them.
            </p>
            <p>
              That system works great so long as I limit my blog posts and
              projects to a few pictures, but when I created that gallery of
              almost two thousand drawings it soon exceeded the limit my free
              Vercel plan offered.
            </p>
            <p>Shucks!</p>
            <p>I asked Claude for a solution, then ran its plan by ChatGPT.</p>
            <p>
              Claude’s initial hypothesis was that the cached copies expired
              every minute and kept getting rewritten. In that case, fixing it
              might have been as simple as changing the cache settings.
            </p>
            <p>
              ChatGPT disagreed. It believed the issue was how many copies were
              being made, and how big they were, not how often. Claude then
              checked Vercel’s documentation, agreed, and corrected itself.
              Vercel says copies of local images can stay cached for{" "}
              <a href="https://vercel.com/docs/image-optimization#local-images-cache-key">
                up to 31 days
              </a>. Our investigation pointed toward the number and size of the
              copies, rather than a cache expiring every minute.
            </p>
            <p>
              Yet Claude did find something ChatGPT hadn’t brought up: Vercel{" "}
              <a href="https://vercel.com/changelog/exceeding-included-image-optimization-usage-no-longer-pauses-deployments">
                announced in 2023
              </a>{" "}
              that going over the free image limit should stop new images from
              being optimized without pausing the deployment. Its{" "}
              <a href="https://vercel.com/docs/image-optimization/limits-and-pricing#hobby">
                current documentation
              </a>{" "}
              describes the same behavior. My whole site got paused anyway.
            </p>
            <p>
              The solution was basically just to turn Vercel’s image optimizer
              off for Doodle Lab. Instead of asking Vercel to make copies of
              every drawing when a user looks at them, as I had been doing, I
              now make the smaller copies ahead of time and serve them as
              ordinary files.
            </p>
            <p>At least, I hope the solution is that straightforward :)</p>
            <p>
              I sent a message to Vercel support after pushing a fix to GitHub,
              and Vercel, quite graciously, immediately unblocked my account.
            </p>
            <p>I’ll be sure to monitor the site’s activity moving forward.</p>
            <p>
              Also, I cleaned up Doodle Lab a bit. It used to have three tabs
              (Showcase, Drawings and Experiments) and it was getting hard to find
              anything. Now there are two:
            </p>
            <ul style={{ marginTop: "1.35rem" }}>
              <li>
                <strong>Doodles:</strong> all the notebook drawings, sorted into
                themes: characters, creatures, birds, plants, landscapes, sky,
                objects, symbols and abstract.
              </li>
              <li>
                <strong>AI Experiments:</strong> scenic pieces, comics and
                character studies, with all the animated GIFs finally in one place.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </article>
  );
}
