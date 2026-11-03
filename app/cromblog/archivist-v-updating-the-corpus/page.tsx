import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, isDraftPost, type BlogPost } from "@/content/blog";
import { canPreviewDrafts } from "../draft-preview";

const post: BlogPost = blogPosts["archivist-v-updating-the-corpus"];
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

export default function ArchivistVUpdatingTheCorpusPage() {
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
              With the paperback edition of <a href="https://www.amazon.com/dp/B0HPCQGLPM"><em>Cradle
              of the Empire</em></a> finally published, I wanted to return to <a
              href="https://archivist.mcrombie.com">Archivist</a>, the AI-powered application I developed
              to answer questions about the book, and bring it up to date.
            </p>

            <p>
              Archivist isn’t just storing a copy of the manuscript. It uses a prepared text corpus,
              search embeddings, and page references to the typeset edition. All three need to agree,
              and since the manuscript underwent substantial revisions between my <Link
              href="/cromblog/archivist-elegant-context-window">original development of Archivist</Link> and
              the publication of the first edition, just replacing the manuscript file would leave the
              application with potentially outdated passages and inaccurate citations.
            </p>

            <p>
              I decided to use <a href="https://openai.com/codex/">OpenAI Codex</a> to update Archivist so
              that it would reflect the actual published first edition of the book. I supplied Codex with
              the exact PDF I had uploaded for publication and asked it to begin with a read-only audit
              of the existing application. The objective was to replace the old manuscript with the
              published text, rebuild the necessary data, verify the results, and deploy the update
              without introducing new features or otherwise redesigning the application.
            </p>

            <p>
              It turned out the most difficult part wasn’t rebuilding the search embeddings but
              extracting the text accurately from the PDF. Archivist’s original ingestion pipeline was
              designed around a Word document, which preserves paragraph structure and footnotes much
              more conveniently than a typeset PDF. The published book, however, contains 630 PDF pages
              filled with line breaks, hyphenated words, running headers, footnotes, and other formatting
              that complicates text extraction. I had Codex reconstruct the paragraphs, distinguish
              genuine hyphens from words broken across lines, and correctly associate hundreds of
              footnotes with their references.
            </p>

            <p>
              This required developing a new PDF ingestion process with checks to ensure that the
              extracted text actually matched the published book. Codex ultimately reconstructed
              twenty-eight substantive sections, including the Introduction, Prologue, twenty chapters,
              Epilogue, Afterword, and four appendices. These were divided into 480 searchable chunks,
              each linked to the appropriate pages in the published edition.
            </p>

            <p>
              With the text prepared, Codex rebuilt the embeddings using OpenAI’s <a
              href="https://developers.openai.com/api/docs/models/text-embedding-3-small">text-embedding-3-small</a> model.
              This was actually one of the easiest and cheapest parts of the entire process.
              Re-embedding the book required just over 216,000 tokens and cost less than half a cent.
              The real work was in preparing and validating the text rather than paying for the AI to
              process it.
            </p>

            <p>
              Codex then ran the application’s automated tests, prepared a new deployment bundle, and
              updated the live application on <a href="https://render.com/">Render</a>. Throughout the
              process, I also had Codex preserve the previous corpus and evaluation records, maintain
              the existing API usage ledger, and prepare a rollback procedure in case the deployment
              failed.
            </p>

            <p>
              Finally, I tested Archivist by asking it about the geological formation of Virginia’s
              landscape. The application successfully retrieved material from the published Prologue,
              generated a coherent answer, and cited the correct pages of the first edition. The answer
              wasn’t perfectly comprehensive, but the system proved to be functioning as intended.
            </p>

            <p>
              Thus, Archivist is now synchronized with the book that readers can actually purchase,
              rather than an outdated version, and I accomplished the update without getting carried
              away with additional features or optimization experiments.
            </p>

            <p>
              The updated application is available at <a
              href="https://archivist.mcrombie.com">archivist.mcrombie.com</a>.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
