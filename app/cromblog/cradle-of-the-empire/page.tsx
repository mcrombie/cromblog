import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["cradle-of-the-empire"];

export const metadata: Metadata = {
  title: post.title
};

function InlineLink({
  href,
  external,
  children
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const className =
    "text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function CradleOfTheEmpirePage() {
  return (
    <article className="content-flow">
      <Link
        href="/cromblog"
        className="inline-flex text-sm text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
      >
        Back to Cromblog
      </Link>

      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] px-6 py-10 shadow-card sm:px-8 sm:py-14">
        <div className="mx-auto max-w-[680px] content-flow">
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

          <figure className="m-0">
            <Image
              src="/cromblog/cradle-of-the-empire/cover.jpg"
              alt="Cover art for Cradle of the Empire: A Big History of Virginia, showing a great oak on a riverbank with tall ships passing on the water beyond"
              width={1792}
              height={2688}
              className="mx-auto block h-auto w-full max-w-[360px] rounded-xl border border-[color:var(--border)] shadow-md"
            />
            <figcaption className="mt-3 text-center text-sm leading-7 text-[color:var(--muted)]">
              Cover art for Cradle of the Empire: A Big History of Virginia.
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              I am happy to announce that the history book I have been working
              on for the last four years is complete. The ebook edition is
              ready to order on{" "}
              <InlineLink
                href="https://www.amazon.com/dp/B0H6VNH94K"
                external
              >
                Amazon
              </InlineLink>
              .
            </p>

            <p>
              I am still in the process of designing the cover file for the
              paperback and hardcover editions. Those I intend to have
              available by the end of the month. Until then, Amazon is
              showing the print length as 1,171 pages rather than the 594
              pages it should be once I finish submitting the print files. I
              am holding off on any broader announcement or marketing until
              those editions are ready.
            </p>

            <p>
              This book may seem out of place on a blog seemingly dedicated
              to software. To me, it is a passion project I felt I needed to
              get out of my head and onto paper before moving on with my
              career. I have loved books and history since I was a child, and
              for as long as I can remember I have wanted to one day write
              and publish my own. Today is that day.
            </p>

            <p>
              By some puzzling coincidence, or synchronicity, I happened to
              finish the final draft a couple of months ago and get it edited
              and typeset just in time for July 4th. This date carries
              significant symbolic weight: it commemorates the 250th
              anniversary of the United States, and 250 years has been
              proposed as a rough average lifespan for an empire.
              <sup id="fn1-ref">
                <a
                  href="#fn1"
                  className="text-pine-700 no-underline hover:text-pine-950"
                >
                  1
                </a>
              </sup>{" "}
              While I do not relish the prospective decline of my country, it
              is hard to resist taking advantage of this timing from an
              analytic and artistic perspective.
            </p>
          </div>

          <hr className="border-[color:var(--border)]" />

          <div className="text-sm leading-7 text-[color:var(--muted)]">
            <ol className="m-0 list-none space-y-2 p-0">
              <li id="fn1" className="flex gap-2">
                <span>1.</span>
                <span>
                  John Bagot Glubb, &#8220;The Fate of Empires and the Search
                  for Survival&#8221; (Edinburgh: William Blackwood &amp; Sons
                  Ltd., 1976), PDF, University of North Carolina Wilmington,{" "}
                  <a
                    href="https://people.uncw.edu/kozloffm/glubb.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
                  >
                    https://people.uncw.edu/kozloffm/glubb.pdf
                  </a>
                  .{" "}
                  <a
                    href="#fn1-ref"
                    className="text-pine-700 no-underline hover:text-pine-950"
                  >
                    &#8617;
                  </a>
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </article>
  );
}
