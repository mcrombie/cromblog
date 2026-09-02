import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["simulating-civilizations-iv"];

export const metadata: Metadata = {
  title: post.title,
  description: post.summary
};

export default function SimulatingCivilizationsIVPage() {
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
              For the first in what I hope will be a series of about half a
              dozen project-update posts this month, I am revisiting the
              Clashvergence project.
            </p>

            <p>
              In my{" "}
              <Link
                href="/cromblog/simulating-civilizations-iii"
                className="text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                last related post
              </Link>
              , I ran a couple of different Clashvergence scenarios on the same
              map. I got more than a little distracted by my fondness for the
              custom Azhora map, which caused me to overlook some problems.
              First, the map was very large and therefore slow. Second, I was
              trying to encourage a specific narrative pattern rather than
              simply allowing one to emerge from the simulation.
            </p>

            <p>
              For the{" "}
              <Link
                href="/projects/clashvergence-demo"
                className="text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                live demo
              </Link>
              , I left Azhora on the bench and used smaller, automatically
              generated maps. The factions receive no scripted agendas,
              advantages, or favored outcomes, although geography still gives
              them different circumstances. This makes the simulation faster
              and its results easier to inspect.
            </p>

            <p>The goals for this version were:</p>

            <ol>
              <li>Build and publish a live demo.</li>
              <li>Improve narrative generation.</li>
              <li>Evaluate the simulation&rsquo;s objective behavior.</li>
            </ol>

            <h2>Live Demo</h2>

            <p>
              Previously, there was no browser-based way to try Clashvergence
              outside my development environment. I have now added a{" "}
              <Link
                href="/projects/clashvergence-demo"
                className="text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                live demo
              </Link>
              .
            </p>

            <p>
              The demo begins in World Builder, where the user can generate a map
              with one click or modify the settings first. The defaults produce a
              relatively small town-sized map with four factions and a 25-year
              stopping point, allowing the user to experience the complete
              process reasonably quickly. The interface warns users when their
              choices are likely to produce a slow simulation and prevents maps
              beyond the demo&rsquo;s hard limits.
            </p>

            <p>
              Once the map has been generated, the simulation begins
              automatically and advances one year at a time. The user can pause
              it, advance a single turn manually, or request a history after at
              least one turn has been completed. If the simulation is still
              running when a history is requested, it finishes the current turn
              before stopping. When it reaches the selected target year, it
              pauses and generates the first history automatically. The
              simulation can then be resumed for another block of turns.
            </p>

            <p>
              The demo is observational, not playable like a game. The user does
              not control a faction. Instead, they watch the factions develop
              and select one as the focal culture for the generated history.
            </p>

            <h2>Narrative Generation</h2>

            <p>
              Each completed turn records annual facts for every faction,
              including important metrics and events. When the user requests a
              history, Clashvergence selects a bounded set of those annual
              records, adds the faction&rsquo;s final condition and a limited
              amount of world context, and sends that material to the OpenAI API.
            </p>

            <p>
              The prompt asks the model to write as a learned historian belonging
              to the selected culture&mdash;or to its surviving historical
              tradition&mdash;at the date when the simulation stopped. It is
              instructed to remain grounded in the supplied records rather than
              inventing wars, rulers, or other events that did not occur.
            </p>

            <p>
              The user can choose the desired length. The default abridged
              history is approximately 500 to 750 words, keeping the demo
              reasonably fast and inexpensive. Each generated history requires
              one API request; the simulation itself does not call the language
              model every turn.
            </p>

            <p>
              The intended experience is straightforward: generate a custom
              world, watch its geopolitics unfold in real time, and then receive
              an AI-written history interpreting what happened.
            </p>

            <h2>Evaluation</h2>

            <p>
              After setting up the live version, I decided to evaluate
              Clashvergence as I had previously evaluated Archivist. However, it
              could not be the same kind of evaluation. Archivist works from an
              existing historical manuscript that provides a reference source.
              Clashvergence generates its history through simulation, so there
              is no externally correct sequence of events against which a run can
              be scored for accuracy.
            </p>

            <p>
              I limited the evaluation to objectively checkable properties rather
              than judging whether a simulated history was &ldquo;good.&rdquo;
              Determinism passed: across five seeds, 40 executions, and 180
              artifact comparisons, identical seeds and configurations produced
              byte-identical output. Conservation was promising but incomplete.
              The 7,000 fully audited turns contained no population, territory,
              resource, trade, or treasury accounting violations, but the
              planned denominator was 10,000 turns, so the result is officially
              invalid rather than a pass. The performance and narrative-cost
              measurements were never reached and therefore produced no results.
            </p>

            <p>
              The evaluation took so long largely because I made the mistake of
              retaining Azhora as a stress test. Some 1,000-turn runs took between
              four and seven hours and generated more than eight gigabytes of
              audit data apiece. Interrupted runs could not resume from internal
              checkpoints, and the evidence eventually consumed well over 100 GB
              before compression!
            </p>

            <p>Whoops.</p>

            <p>
              That is way too much for the relatively simple evaluation I had
              envisioned. It seems I am still paying for my fascination with my
              own custom map.
            </p>

            <p>
              In a future evaluation, I would like to start with representative
              pilot runs, separate the normal test suite from large-world
              endurance testing, compress evidence as it is produced, and allow
              long runs to resume from exact checkpoints.
            </p>

            <p>
              The conclusion, at least, shows a way forward: Clashvergence was
              deterministic under the tested conditions, showed no conservation
              defects in the completed evidence, and still needs a smaller,
              better-designed evaluation of performance and narrative-generation
              costs.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
