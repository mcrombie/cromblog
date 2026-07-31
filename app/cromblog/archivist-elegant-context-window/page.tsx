import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["archivist-elegant-context-window"];

export const metadata: Metadata = {
  title: post.title
};

function ExternalLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
    >
      {children}
    </a>
  );
}

export default function ArchivistElegantContextWindowPage() {
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

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              A few months ago, while still finishing{" "}
              <Link
                href="/cromblog/cradle-of-the-empire"
                className="text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                Cradle of the Empire
              </Link>
              , I began tinkering with a program that could answer questions
              about the manuscript. It started as a command-line system for
              semantic search over the book. It has since evolved into
              Archivist: a public, source-grounded conversation interface
              dedicated to this one book, as well as a prototype for a potential
              multi-manuscript version.
            </p>

            <p>
              In its original and still-default mode, Archivist does not send
              the complete 594-page manuscript to a large language model and ask
              it to figure everything out. Instead, it divides the book into
              stable passages, searches those passages, assembles a small packet
              of relevant evidence, and asks the model to answer from that
              packet. The answer cites what it was shown, and the public
              interface maps those citations back to pages in the typeset
              edition.
            </p>

            <p>
              That description makes the system sound simpler than it actually
              is. The visible answer is only the final layer of a more
              complicated process.
            </p>

            <h2>Crafting an elegant context window</h2>

            <p>
              I have come to think of designing this RAG
              (retrieval-augmented generation) system as crafting an elegant
              context window for discussing a book with an AI model. Before the
              model can write anything, the application has to decide what
              belongs in the searchable material, how arguments should be
              divided without destroying their context, how semantic and literal
              search should interact, how much evidence can fit into one
              response, what to do when a question contains a false premise, and
              how to distinguish a retrieval failure from a subject the book
              genuinely does not cover.
            </p>

            <p>
              The model therefore does not receive the complete book whenever it
              prepares to answer a question. Archivist instead composes a small
              reading packet from which the answer must be derived.
            </p>

            <p>
              This process can be broken into several stages. Ingestion
              determines which parts of the manuscript belong in the searchable
              corpus and converts them into stable, addressable passages.
              Chunking determines which paragraphs must remain together.
              Retrieval uses semantic and literal search to decide which chunks
              deserve the limited context budget. Neighbor expansion can restore
              the setup or consequence that falls just across an imperfect chunk
              boundary. Conversation resolution preserves what the reader meant
              without allowing the model&rsquo;s earlier prose to become
              historical evidence. Citations preserve the route from a generated
              claim back to the passages admitted into context. Validation then
              checks whether those citations actually resolve and whether a
              structurally well-formed response has answered the complete
              question rather than merely part of it.
            </p>

            <h2>Turning a prototype into a public product</h2>

            <p>
              My local development version exposes the complete manuscript
              corpus, internal diagnostics, file paths, and detailed cost data to
              me as the developer. The public product is much more opaque.
            </p>

            <p>
              Archivist uses FastAPI for its backend and React for its frontend.
              The public-facing version runs as a separate service on Render,
              which I mapped to a subdomain of my website:{" "}
              <ExternalLink href="https://archivist.mcrombie.com/">
                archivist.mcrombie.com
              </ExternalLink>
              .
            </p>

            <p>
              The public version searches the complete substantive manuscript,
              but the browser never receives that complete corpus. It receives
              the generated answer, edition-qualified page locations for the
              cited sources, and a small number of bounded excerpts. The
              underlying retrieval corpus was prepared from the authoritative
              manuscript, while the current page locators are mapped
              specifically to a typeset PDF edition. Future paperback,
              hardcover, and ebook editions will require their own locator
              profiles.
            </p>

            <p>
              Putting Archivist online also required controls that mattered
              little when I was its only user: request-size limits, per-reader
              and global rate limits, concurrency controls, a server-enforced
              monthly API budget, sanitized errors, and separate liveness and
              readiness checks.
            </p>

            <p>
              Most of these features do not improve the quality of an individual
              answer. Rather, they make it possible to operate the application
              publicly without exposing the full manuscript or surrendering
              control of the API bill.
            </p>

            <h2>What Archivist still gets wrong</h2>

            <p>
              I am not claiming that Archivist is accurate in some general,
              numerical sense. My current ten-question suite has been useful for
              finding defects and showing me where the system fails, but those
              questions cannot honestly tell me how well a finished version
              performs on questions it has never seen. That will require a new
              gold set of questions written and locked before Archivist
              encounters them.
            </p>

            <p>
              A more fundamental design question arose from the test question
              that has resisted the most repairs:
            </p>

            <blockquote>
              <p>
                How does the book treat war as an engine of federal and central
                power?
              </p>
            </blockquote>

            <p>
              The obvious suspect was Archivist&rsquo;s limited context. This
              question touches the manuscript in hundreds of places, while the
              RAG system ultimately gives the model only eight passages from
              which to construct its answer. Perhaps a small reading packet was
              inevitably losing the book&rsquo;s larger argument.
            </p>

            <p>That raised a challenge to the foundation of the application:</p>

            <blockquote>
              <p>
                Does the RAG system actually produce better answers than the
                model would produce if I simply gave it the complete manuscript?
              </p>
            </blockquote>

            <p>
              To explore that question, I recently built a second mode that
              hands the model the entire eligible substantive manuscript instead
              of a curated packet.
            </p>

            <p>
              I have only just begun testing it, but on the war-and-central-power
              question, the two modes scored identically under my existing
              development rubric. Each captured one of the seven points I
              expected. Each reached four of the five regions of the book I was
              looking for. However, they did not fail in the same way. The
              retrieval path skipped the Civil War chapter, while the full-book
              path skipped the Epilogue, so a single score concealed two
              unrelated failures.
            </p>

            <p>
              The full-book answer was fluent. It cited fourteen passages and
              moved cleanly from Jamestown through the Civil War to the forever
              war, identifying no gaps and reporting itself complete. Yet it had
              been shown the entire eligible substantive manuscript and still
              omitted six of the seven points I was looking for.
            </p>

            <p>
              The answer produced from eight retrieved passages was, if
              anything, more candid about what it had failed to establish. In
              this one comparison, my local cost ledger also estimated that the
              RAG path cost about one-fifth as much.
            </p>

            <p>
              This experiment indicates that a context window can fail in
              different ways. The narrower RAG can exclude important evidence
              before the model ever sees it. The broader full context can place
              the important evidence inside such a large body of material that
              the model still fails to recognize or use key pieces.
            </p>

            <p>
              At present, both modes have strengths and weaknesses. It will take
              considerably more testing before I can determine where each works
              best. I suspect that some form of hybrid approach has the greatest
              potential&mdash;perhaps using retrieval to identify the structure
              of the answer while allowing the model to inspect a wider body of
              surrounding evidence&mdash;but that is still an untested
              hypothesis.
            </p>

            <p>
              More on that in a future post, which will be less about what
              Archivist can display than what it can prove with detailed
              diagnostics.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
