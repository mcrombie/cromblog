import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/content/blog";
import { archivistDemoUrl } from "@/content/site";

const post = blogPosts["archivist-iii-lowering-latency"];

export const metadata: Metadata = {
  title: post.title
};

const pipelineStages = [
  {
    label: "Before",
    steps: [
      "retrieve evidence",
      "model writes prose and evidence ledgers",
      "local validation"
    ]
  },
  {
    label: "Now",
    steps: [
      "application assembles and validates evidence",
      "model writes the answer",
      "local validation"
    ]
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

export default function ArchivistIiiLoweringLatencyPage() {
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
                href="/cromblog/evaluator-also-has-to-be-evaluated"
                className="text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                My previous Archivist post
              </Link>{" "}
              ended with a problem that did not require any semantic evaluation
              to detect. In short, the application was much too slow.
            </p>

            <p>
              In a warm, sequential test of 33 manuscript-grounded requests, 29
              completed successfully. Among those successful responses, median
              server-side latency was 54.4 seconds. Four additional requests
              failed closed because the generated evidence relationships violated
              Archivist&rsquo;s release contract.
            </p>

            <p>
              The exact figure describes that particular server-side workload
              rather than the complete browser experience, but the larger
              conclusion did not require so much qualification. A whole minute
              was far too long to wait for an ordinary chat response.
            </p>

            <p>
              Those were the results when I first drafted the previous post.
              Since then, I have redesigned Archivist to favor lower-latency
              paths unless the question calls for a more complex response. So
              far, the results show significant improvement over previous
              versions.
            </p>

            <h2>Redesigning the Model Boundary</h2>

            <p>
              My first explanation for the latency was too simple. I assumed I
              was sending too much information to the OpenAI API and that making
              the request smaller would solve the problem.
            </p>

            <p>
              I did experiment with compacting the request, but I never completed
              the controlled paid comparison needed to prove that a smaller
              schema caused any particular speedup.
            </p>

            <p>
              The more important change was to Archivist&rsquo;s architecture.
            </p>

            <p>
              Previously, the model had to write the answer while also producing
              several mutually constrained ledgers describing the relationships
              among questions, requirements, evidence, sources, and answer units.
              Archivist would then validate that structure and reject the result
              if the bookkeeping did not line up. Making those ledgers
              dramatically slowed down response times; it was way too much effort
              for way too little reward.
            </p>

            <p>
              Archivist now assembles and validates a limited manuscript-evidence
              packet locally, and then sends the model that packet along with
              instructions per the selected character mode. With that, the API
              model is left with a much narrower task than before: just write the
              response.
            </p>

            <p>Here is roughly how it looks before and after:</p>
          </div>

          <div className="pipeline-compare">
            {pipelineStages.map((stage) => (
              <div key={stage.label} className="pipeline-stage">
                <p className="pipeline-stage-label">{stage.label}</p>
                <ol className="pipeline-steps">
                  {stage.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Importantly, this change does not mean the model is free to ignore
              citations or invent claims. It means Archivist handles more of the
              information organization itself rather than asking the API model to
              describe Archivist&rsquo;s internal evidence structure while also
              trying to write readable historical prose.
            </p>

            <p>
              I also noticed another place where Archivist was doing unnecessary
              work. Simple off-topic questions produced unnatural responses about
              failing to find relevant manuscript evidence.
            </p>

            <p>
              For example, if someone asks, &ldquo;How are you?&rdquo;, Archivist
              should answer appropriately and steer the conversation back toward
              the book. It should not perform a pointless retrieval operation and
              pretend the question was historical.
            </p>

            <p>
              Personal and social questions now take a separate conversational
              route. Those responses use the selected character voice and always
              end with a question leading the user back toward the manuscript.
              This also improves latency for such questions because the API model
              does not need to consider as much information.
            </p>

            <p>
              The current version also stops treating every historical question
              as though it requires the same amount of prose, which tended to
              make responses appear stunted or forced into a narrow window.
              Ordinary questions now receive a focused answer budget, while broad
              synthesis questions retain room for a longer response.
            </p>

            <p>
              The redesign therefore narrowed unnecessary work in three ways:
            </p>

            <ol>
              <li>Application code now handles the evidence bookkeeping,</li>
              <li>Social conversation bypasses manuscript retrieval,</li>
              <li>
                Simple historical questions no longer receive the same output
                budget as book-spanning ones.
              </li>
            </ol>

            <p>
              These changes produced measurements on two distinct
              routes&mdash;social and source-grounded. I am keeping them separate
              for now rather than combining them into one flattering percentage.
            </p>

            <h2>Separating Conversation from Research</h2>

            <p>
              The social conversation route produced the cleanest latency result
              so far.
            </p>

            <p>
              I tested 12 no-retry social turns across four character modes:
              Professional, Pretty Pink Princess, Baleful Black Baron, and
              Ruthless Red Realist. All 12 responses generated successfully{" "}
              <em>and</em> ended with a valid question leading the reader back
              toward the manuscript. There were no retries, fallbacks, or failed
              responses.
            </p>

            <p>
              Median latency was 3.59 seconds, with observed results ranging from
              2.74 to 4.17 seconds.
            </p>

            <p>
              That is a narrow but defensible result for short, in-character
              social responses across four modes. However, it does not measure
              the latency of a manuscript-grounded RAG answer. Those consistently
              take much longer.
            </p>

            <h2>Grounded Answers Are Still Slower</h2>

            <p>
              I later reran the same 37 evaluation questions against the
              redesigned grounded-authoring path. I had already inspected its
              earlier results and changed the system in response, making it a
              reused but still frozen development benchmark.
            </p>

            <p>
              The run produced 34 authored answers and three delivered evidence
              fallbacks. Across all 37 attempts, median latency at the authoring
              boundary was 19.3 seconds.
            </p>

            <p>
              I can&rsquo;t claim a formal percentage reduction from the earlier
              54.4-second production median, though. That old figure measured a
              warm public server endpoint. The 19.3-second figure measures the
              redesigned authoring boundary. The 3.59-second figure belongs to a
              separate social route. They point in an encouraging direction, but
              combining them into a single percentage would make the comparison
              look more controlled than it was.
            </p>

            <p>
              The redesign round also made the evaluator significantly more
              reliable. In the original run, only 10 of 37 claim-decomposition
              records survived validation. After redesigning the decomposition
              instrument, 35 of 37 produced valid outcomes.
            </p>

            <p>
              That is not evidence that Archivist&rsquo;s answers became more
              accurate, but it is evidence that the measuring instrument became
              less likely to fail while examining them. The distinction matters
              because a more reliable evaluator allows the next semantic analysis
              to cover nearly the full cohort, rather than drawing conclusions
              from the small fraction of records that happened to survive a
              broken instrument.
            </p>

            <h2>Faster Is Not Finished</h2>

            <p>
              Ultimately, this redesign&rsquo;s clearest result is a better
              division of labor: application code prepares the evidence, the
              model writes the answer, and casual conversation stays on a
              lightweight path.
            </p>

            <p>
              With 12 successful responses at a 3.59-second median,
              Archivist&rsquo;s social route is now fast enough to feel like a
              chat. Manuscript-grounded answers remain slower, with a
              19.3-second median.
            </p>

            <p>
              Those are some solid numbers for latency, but I still cannot reduce
              Archivist&rsquo;s answer quality to one accuracy percentage. I
              still need to work on the semantic evaluation system, which is a
              much more complicated task for a history book. To be thorough, the
              current version also needs a full fixed-benchmark run under one
              consistent timing boundary, followed by another public production
              measurement after deployment.
            </p>

            <p>
              After all, the evaluation did not certify Archivist as finished.
              Instead, it replaced a vague impression that the application was
              slow with specific measurements and a clearer idea of where the
              wasted effort occurred. That made the repairs easier.
            </p>

            <p>
              Faster may not mean finished, but Archivist no longer runs a whole
              research pipeline just to say hello, making it a useful application
              (for those few who want some interactive spark notes on my book)
              and a{" "}
              <ExternalLink href={archivistDemoUrl}>
                demo I am increasingly proud of
              </ExternalLink>
              .
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
