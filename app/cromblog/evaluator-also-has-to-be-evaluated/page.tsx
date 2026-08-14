import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["evaluator-also-has-to-be-evaluated"];

export const metadata: Metadata = {
  title: post.title
};

const retrievalMetrics = [
  {
    metric: "Raw Recall@5",
    dense: "24.71%",
    hybrid: "25.97%"
  },
  {
    metric: "Cardinality-only Recall@5 ceiling",
    footnote: "fn1-ref",
    dense: "49.08%",
    hybrid: "49.08%"
  },
  {
    metric: "Raw Recall@5 as share of ceiling",
    footnote: "fn1-ref2",
    dense: "50.3%",
    hybrid: "52.9%"
  },
  {
    metric: "Hit@5",
    dense: "90.91%",
    hybrid: "93.94%"
  },
  {
    metric: "Context recall",
    dense: "31.96%",
    hybrid: "33.74%"
  },
  {
    metric: "Essential-claim evidence coverage",
    dense: "44.98%",
    hybrid: "47.22%"
  }
] as const;

const answerRunResults = [
  {
    result: "Answers that passed generation and release checks",
    value: "35/37"
  },
  {
    result: "Citation references that resolved",
    value: "251/251"
  },
  {
    result: "Decomposition-instrument technical failures",
    value: "27/37"
  }
] as const;

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

function FootnoteRef({ id }: { id: string }) {
  return (
    <sup id={id}>
      <a href="#fn1" className="text-pine-700 no-underline hover:text-pine-950">
        1
      </a>
    </sup>
  );
}

export default function EvaluatorAlsoHasToBeEvaluatedPage() {
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
              <Link
                href="/cromblog/archivist-elegant-context-window"
                className="text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                My last post
              </Link>{" "}
              introduced the{" "}
              <ExternalLink href="https://archivist.mcrombie.com/">
                Archivist project
              </ExternalLink>
              . I said the next update would be less about what Archivist could
              display than what it could prove after a detailed evaluation.
            </p>

            <p>
              Since then, I have spent a good deal of time trying to build and
              run that evaluation. It turns out that evaluating a
              retrieval-augmented generation system may be harder than building
              one.
            </p>

            <p>
              This is the big boring part: quality assurance. I now understand
              why this is where enthusiasm for RAG often dies. As one writer
              explains in{" "}
              <ExternalLink href="https://medium.com/@manisuec/how-to-evaluate-a-rag-system-and-why-most-teams-dont-2abb9eec2f5f">
                &ldquo;How to Evaluate a RAG System (And Why Most Teams
                Don&rsquo;t)&rdquo;
              </ExternalLink>
              , retrieval and generation can fail separately, while a poorly
              designed evaluation can blur those failures together.
            </p>

            <h2>Writing the Evaluation</h2>

            <p>
              I initially tested Archivist with ten questions. That set exposed
              useful defects, but it gradually became part of the development
              process. Once I had inspected its results and changed Archivist in
              response, those questions could no longer tell me how the system
              performed on material it had not already helped me study. They had
              become a development set.
            </p>

            <p>
              To see what I might be missing, I wrote 37 new questions and froze
              the current version of Archivist before running them. This became
              the held-out gold set: a fixed reference against which the frozen
              system could be measured without changing the rules afterward.
            </p>

            <p>
              The set includes focused, analytical, conceptual, and book-spanning
              questions, along with questionable premises and four questions
              whose answers do not exist in the manuscript. I did not make every
              question perfectly clear because real users will ask compound,
              vague, or partially mistaken questions. A useful evaluation should
              test those cases rather than rewrite them into questions the
              application would prefer to answer.
            </p>

            <p>
              For each question, I manually identified the claims I expected a
              good answer to include and the regions of the manuscript that could
              support them. This took considerably more work than I expected and
              consumed most of the time I spent on Archivist over the previous
              two weeks. It also forced me to decide what I actually meant by a
              good answer before seeing the model&rsquo;s prose, rather than
              judging that prose by instinct afterward.
            </p>

            <p>
              I was particularly well positioned to do this because Archivist is
              built around a manuscript I wrote myself.
            </p>

            <p>
              By the end of it, I could see why most people would rather keep
              tweaking the application than stop and build a proper test for it,
              especially since that test can fail in its own isolated ways.
            </p>

            <p>
              I drew one line before starting: every number in this post is
              either mechanical&mdash;did a citation resolve, or was a labeled
              chunk retrieved?&mdash;or measured against locations I identified
              myself. The model did not decide whether its own answer was
              correct.
            </p>

            <p>
              Archivist&rsquo;s harness also includes an automatic judge for
              semantic scoring, but that part remains deliberately unfinished.
              Before I let any of its verdicts count, it has to agree with my own
              labels, use a different model from the one generating the answers,
              and remain separate from any model used to help format the gold
              set.
            </p>

            <h2>What the First Evaluation Run Found</h2>

            <p>
              The frozen retrieval diagnostic and answer-quality baseline were
              separate measurements of the same version. In both, the labels and
              rules were fixed before the questions ran. No failed answer was
              quietly replaced with a better rerun.
            </p>

            <p>
              The clearest pattern was that Archivist usually found something
              relevant but rarely found everything the answer needed.
            </p>

            <p>For the 33 answerable questions, the retrieval results were:</p>
          </div>

          <div
            className="arrival-table-wrap"
            role="region"
            aria-labelledby="retrieval-table-caption"
            tabIndex={0}
          >
            <table className="arrival-table">
              <caption id="retrieval-table-caption" className="sr-only">
                Frozen retrieval diagnostic results across the 33 answerable
                questions
              </caption>
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  <th scope="col">Dense retrieval</th>
                  <th scope="col">Hybrid retrieval</th>
                </tr>
              </thead>
              <tbody>
                {retrievalMetrics.map((row) => (
                  <tr key={row.metric}>
                    <td>
                      {row.metric}
                      {"footnote" in row ? <FootnoteRef id={row.footnote} /> : null}
                    </td>
                    <td>{row.dense}</td>
                    <td>{row.hybrid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Dense retrieval searches by meaning, allowing a question and a
              manuscript passage to use different words while remaining
              semantically similar. Hybrid retrieval combines semantic search
              with literal word-and-phrase search, then merges the rankings.
            </p>

            <p>
              Hit@5 asks a modest question: did at least one relevant passage
              appear among the first five results? Hybrid retrieval did that for
              93.94% of the answerable questions.
            </p>

            <p>
              Raw Recall@5 asks a harder one: what share of all labeled
              manuscript locations appeared among those five results? Hybrid
              retrieval found 25.97%.
            </p>

            <p>
              Because a five-result list could achieve only 49.08% macro recall
              against this gold set on result count alone, that raw result
              represented 52.9% of the cardinality-only ceiling.
            </p>

            <p>
              Put together, those numbers exposed the real problem. Archivist was
              highly likely to find one useful passage and captured about half of
              what five results could theoretically contain. But it still left
              out substantial evidence that a complete answer required.
            </p>

            <p>
              Hybrid retrieval improved 11 questions, left 13 unchanged, and
              worsened nine. Its gains also varied by question type. That made it
              worth keeping, but not worth treating as a universal cure.
            </p>

            <p>
              I initially wrote about Recall@5 as though 100% were attainable. It
              was not. That made the raw 25.97% result look worse than the
              retrieval policy could possibly allow.
            </p>

            <p>
              A coverage figure whose maximum is unstated invites everyone,
              including its author, to misread it.
            </p>

            <p>
              The correction did not rescue the system. Archivist still omitted
              substantial labeled evidence at every measured stage. My gold labels
              and retrieval budget disagreed about how much evidence a complete
              answer needed. Resolving that disagreement would require more than
              tuning the retriever.
            </p>

            <h2>The Answers Passed More Tests Than the Evaluator Did</h2>

            <p>The frozen answer run produced another set of results:</p>
          </div>

          <div
            className="arrival-table-wrap"
            role="region"
            aria-labelledby="answer-table-caption"
            tabIndex={0}
          >
            <table className="arrival-table">
              <caption id="answer-table-caption" className="sr-only">
                Frozen answer-run results across the 37 gold-set questions
              </caption>
              <thead>
                <tr>
                  <th scope="col">Frozen answer-run result</th>
                  <th scope="col">Observed value</th>
                </tr>
              </thead>
              <tbody>
                {answerRunResults.map((row) => (
                  <tr key={row.result}>
                    <td>{row.result}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Thirty-five completed answers is a delivery result, not an accuracy
              score. It means those answers passed Archivist&rsquo;s structural
              and release checks. It does not mean every answer was complete or
              correct.
            </p>

            <p>
              Likewise, 251 of 251 citation references resolving is a useful but
              narrow success. It proves that every rendered source number pointed
              to an existing source entry. It does not prove that the source
              supported the neighboring claim. Citation resolvability is
              mechanical integrity, not semantic faithfulness.
            </p>

            <p>Then the evaluator failed.</p>

            <p>
              To score answer-level properties, I first needed to break each
              response into individual claims that could be checked. The
              decomposition instrument returned technically invalid results for
              27 of the 37 answers. Twenty-six failures came from exact-span
              mismatches, and one came from an incomplete response.
            </p>

            <p>
              Those were failures of the measuring tool, not evidence that
              Archivist had answered badly.
            </p>

            <p>
              Only ten decomposition records survived validation, and only eight
              represented substantive released answers. That was far too little
              coverage to turn the semantic results into an honest accuracy
              percentage.
            </p>

            <p>
              That may have been the most useful result of the whole exercise.
              Building an evaluation pipeline does not automatically make its
              measurements trustworthy. Evaluation models, schemas, and
              validators have assumptions and failure modes of their own.
            </p>

            <p>
              <strong>
                In short, the evaluator itself also has to be evaluated.
              </strong>
            </p>

            <h2>Conclusion</h2>

            <p>
              The first evaluation did not give me the neat answer-quality score
              I had hoped to publish. What it gave me instead was a clearer map
              of four different problems: finding some relevant evidence, finding
              enough evidence, delivering citations that mechanically work, and
              measuring whether the final answer is actually faithful and
              complete.
            </p>

            <p>
              There was another failure that required no semantic judge to
              detect: Archivist was much too slow to feel like a conversation.
              That became the next engineering target&mdash;and the subject of
              the next post.
            </p>
          </div>

          <hr className="border-[color:var(--border)]" />

          <div className="text-sm leading-7 text-[color:var(--muted)]">
            <ol className="m-0 list-none space-y-2 p-0">
              <li id="fn1" className="flex gap-2">
                <span>1.</span>
                <span>
                  Retrieval returns at most five results, so 100% Recall@5 was
                  impossible for questions with more than five labeled locations.
                  Averaging the result-count maximum for each question produced a
                  cardinality-only macro ceiling of 49.08%. The table&rsquo;s
                  ceiling-relative row divides raw macro Recall@5 by that
                  ceiling: dense retrieval&rsquo;s 24.71% equals 50.3% of the
                  bound, while hybrid retrieval&rsquo;s 25.97% equals 52.9%.
                  These figures do not mean that the systems retrieved 50.3% or
                  52.9% of all relevant locations. They show how much of the
                  result-count-limited maximum each system reached. Filtering and
                  diversity rules may reduce the practical ceiling further.{" "}
                  <a
                    href="#fn1-ref"
                    className="text-pine-700 no-underline hover:text-pine-950"
                  >
                    &#8617;
                  </a>{" "}
                  <a
                    href="#fn1-ref2"
                    className="text-pine-700 no-underline hover:text-pine-950"
                  >
                    &#8617;<sup>2</sup>
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
