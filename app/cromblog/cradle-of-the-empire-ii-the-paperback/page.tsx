import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, isDraftPost, type BlogPost } from "@/content/blog";
import { canPreviewDrafts } from "../draft-preview";

const post: BlogPost = blogPosts["cradle-of-the-empire-ii-the-paperback"];
const hidden = isDraftPost(post) && !canPreviewDrafts();

export function generateMetadata(): Metadata {
  // Reject production requests before rendering or streaming the page.
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

export default function CradleOfTheEmpirePaperbackPage() {
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

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              The paperback edition of <a
              href="https://www.amazon.com/Cradle-Empire-Big-History-Virginia/dp/B0HPCQGLPM/ref=tmm_pap_swatch_0?_encoding=UTF8"><em>Cradle
              of the Empire: A Big History of Virginia</em></a> is finally available!
            </p>

            <p>
              When I announced the ebook back in July, I thought I was nearly finished with the publishing
              process. Instead, the paperback became something of a side project as I got distracted by other
              endeavors, some tangentially related to the book, like <Link
              href="/cromblog/archivist-iv-demo">Archivist</Link>, and others not at all, like <Link
              href="/cromblog/azhora-iii">Azhora</Link>.
            </p>

            <p>
              Over the past few months, I’ve been intermittently revising the book’s physical design, ordering
              proofs, experimenting with illustrations, and making some last-minute editorial corrections. Now,
              after about four years of work, I’m finally ready to call this project finished.
            </p>

            <h2>Designing the Cover</h2>

            <p>
              Even after finishing the ebook, I found there was more to publishing the print edition. The first
              major obstacle was creating the cover. Making an illustration is not the same as designing a cover,
              nor is the cover file for an ebook the equivalent of the cover file for a paperback or hardcover
              book.
            </p>

            {post.image && (
              <figure className="m-0 overflow-hidden rounded-2xl border border-[color:var(--border)] shadow-sm">
                <a href={post.image.src} target="_blank" rel="noreferrer" aria-label="View the full wraparound cover at full size">
                  <Image
                    src={post.image.src}
                    alt={post.image.alt}
                    width={post.image.width}
                    height={post.image.height}
                    unoptimized={post.image.unoptimized}
                    className="block h-auto w-full"
                  />
                </a>
                <figcaption className="border-t border-[color:var(--border)] px-5 py-3 font-serif text-sm italic leading-6 text-[color:var(--muted)]">
                  The full wraparound paperback cover: back cover, spine, and front cover.
                </figcaption>
              </figure>
            )}

            <p>
              For years I’ve used <a href="https://paint.net/">Paint.NET</a> as my standard tool for editing
              images because it is free and familiar. When I set about designing my own book cover, I was
              pleasantly surprised to discover that <a href="https://www.affinity.studio/">Affinity</a> — a
              powerful graphic design application now owned by Canva — is free. Only the integrated AI features
              require a premium subscription.
            </p>

            <p>
              After getting over the initial hump of learning unfamiliar software, I became immersed in using
              Affinity to create my cover. By turning to Claude’s Opus 4.8 model with questions whenever I ran
              into difficulty, I was able to complete the design in approximately five hours of work, starting
              from zero familiarity with the application.
            </p>

            <p>
              There were a few techniques that are apparently pretty standard in graphic design that I had never
              applied myself before. For example, a scrim is a semi-transparent layer used to visually push
              content into the background so that another element, in this case text, stands out. Applying a scrim
              was key to making the subtitle visible. Otherwise, the bright clouds in the illustration would have
              clashed with the subtitle’s color.
            </p>

            <p>
              I also wanted the cover design to match the style of nineteenth-century illustrated publications,
              particularly the engravings of Harper’s Weekly, in order to evoke the more blunt rhetoric
              surrounding imperialism in that period. It seemed a particularly appropriate aesthetic for this
              history book.
            </p>

            <p>
              Ultimately, I am glad I made my own cover instead of hiring someone to do it. The learning
              experience and result were well worth the time. This reflects a common theme in my work nowadays:
              I’m increasingly inclined to use AI to help me accomplish tasks for which I would once have sought
              professional assistance. Not only can this save me considerable time and money, but I also come away
              having learned something new.
            </p>

            <h2>Designing the Paperback</h2>

            <p>
              Amazon allows authors to purchase physical proofs of their books before releasing them for sale to
              the public. I ended up buying about fourteen proofs before settling on a 6 × 9-inch paperback with
              cream-colored pages.
            </p>

            <p>
              While fourteen proofs sounds excessive, and probably is, I plan to give the extras away as gifts to
              relatives. Besides, the accessibility of print-on-demand technology made it possible to experiment
              with different physical versions without committing to a large printing run. I could order a single
              copy, examine it, make adjustments, and order another.
            </p>

            <p>
              Thank you print on demand!
            </p>

            <p>
              Beyond size and paper color, I kept ordering proofs to test different illustrations. When ChatGPT
              Astra came out, I soon realized its image-generation abilities were on another level. Essentially,
              it became what I had wanted Midjourney to be.
            </p>

            <p>
              In particular, I found Astra better at generating images that looked plausible for their historical
              settings while maintaining a consistent artistic style across illustrations. I wanted the book’s
              images to resemble historical engravings rather than a collection of unrelated AI-generated artwork,
              and I was finally able to achieve something much closer to that vision.
            </p>

            <p>
              This is the sort of capability that writers of illustrated history could only have dreamed of for
              centuries, and suddenly it was available to me just in time to make changes before publication.
            </p>

            <p>
              What a windfall!
            </p>

            <p>
              Fortunately, replacing the illustrations didn’t require me to disrupt the typesetting because I
              could simply generate the new images at the same dimensions as the old ones. I did, however, have to
              update the Note on Illustrations and the section on Illustration Credits and Generation Notes to
              document the changes.
            </p>

            <p>
              I thought that would be the last major revision.
            </p>

            <p>
              And yet, it was not.
            </p>

            <h2>One Last AI-Assisted Fact-Check</h2>

            <p>
              Just as I was preparing to publish the paperback, I decided to give the manuscript to the AI models
              for one last editorial review, as I had done three months earlier.
            </p>

            <p>
              This time, I got significantly different results.
            </p>

            <p>
              Back in July, I wasn’t using the more expensive plans that provided access to the most capable
              models. Nor were July’s models as powerful as those available in October.
            </p>

            <p>
              I found that ChatGPT’s Astra and Claude’s Fable models were capable of producing far more
              comprehensive editorial reviews and identifying potential factual errors that previous reviews had
              missed.
            </p>

            <p>
              While I think the book’s core argument and structure held up well, the models identified enough
              factual issues to warrant another editing pass. Many were chronology problems, minor historical
              inaccuracies, or issues with the formatting of the Works Consulted.
            </p>

            <p>
              For example, one useful catch concerned the Corwin Amendment — an unsuccessful proposal to protect
              slavery in the states. I had placed it before South Carolina’s secession, which made it sound as
              though the state had considered and rejected that particular compromise before leaving the Union. In
              fact, the amendment came afterward. I kept the discussion of the amendment but moved it into its
              proper chronological position, a small change in placement that corrected a misleading sequence of
              events.
            </p>

            <p>
              None of this fundamentally undermined the book’s argument, but it did leave me with an uncomfortable
              question: How many more errors might still be lurking in a manuscript I thought was finished?
            </p>

            <p>
              I went through the models’ recommendations one by one, distinguishing factual errors from
              interpretive disagreements and stylistic preferences. Many suggestions I rejected or deferred to a
              potential second edition because they were essentially matters of interpretation rather than
              demonstrable mistakes. Others were legitimate corrections that I decided were worth making before
              publication.
            </p>

            <p>
              The problem was that making textual changes meant disrupting the typesetting.
            </p>

            <p>
              This was something I had been reluctant to do because my editor had handled the typesetting and I
              had little experience with it myself. However, I found that the AI models could help me make precise
              changes to the typeset manuscript, allowing me to revise the text while preserving the formatting,
              provided I carefully checked the results.
            </p>

            <p>
              That revelation made the decision to perform one last edit much easier.
            </p>

            <p>
              It also illustrated a peculiar problem with modern AI-assisted editing. The technology makes it
              increasingly easy to identify possible errors, but it also makes it tempting to keep reviewing and
              revising indefinitely. Each new editorial pass can uncover another set of potential issues, and not
              all of them are necessarily genuine errors.
            </p>

            <p>
              Eventually, the author has to decide that the book is ready. It seems, if you keep asking for
              editorial feedback, the models will go on making corrections indefinitely, even to the point of
              second guessing their own prior recommendations.
            </p>

            <p>
              After a couple of weeks of editing, I decided that the corrections worth making for the first
              edition had been made, and that any remaining minor issues could wait for a future edition.
            </p>

            <p>
              Unlike an ebook, a physical book cannot be updated after someone purchases it. That made me
              particularly concerned with getting the paperback right before releasing it.
            </p>

            <p>
              I also incorporated the corrections into the ebook, which was updated on October 26. Anyone
              purchasing it now will receive the revised first-edition text. Earlier purchasers may also receive
              the update automatically, depending on their Kindle settings.
            </p>

            <h2>Conclusion</h2>

            <p>
              This post marks the conclusion of approximately four years of work on Cradle of the Empire. The vast
              majority of that time was spent reading, thinking, writing, and editing.
            </p>

            <p>
              These final six months, however, have been quite a different animal. Getting professional editorial
              feedback, designing the cover, experimenting with illustrations, typesetting, and publishing have
              brought me back into the world of technology and deploying projects.
            </p>

            <p>
              In many ways, making the physical book has been an entirely different undertaking from writing it. I
              found myself learning graphic design, experimenting with software, working with AI tools, and
              troubleshooting production problems that had little to do with the historical subject I originally
              set out to explore.
            </p>

            <p>
              However, I enjoyed much of this work precisely because it gave me the opportunity to learn new
              things and take greater ownership of the finished product.
            </p>

            <p>
              Perhaps the most difficult lesson has been knowing when to stop. With modern technology,
              particularly AI, there always seems to be another improvement one could make, another editorial
              review to request, another illustration to regenerate, or another design to experiment with.
            </p>

            <p>
              Yet a book cannot remain a work in progress forever.
            </p>

            <p>
              After four years, I’m ready to put Cradle of the Empire out into the world and move on to the next
              chapter.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
