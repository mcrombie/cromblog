import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["primeproofing-beyond-vibe-coding"];

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

export default function PrimeproofingBeyondVibeCodingPage() {
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
              I am guilty of vibe coding—vaguely prompting AI to generate code
              without quality checking the results—on my{" "}
              <ExternalLink href="https://github.com/mcrombie/Clashvergence">
                Clashvergence
              </ExternalLink>{" "}
              simulation project. I got carried away in the temptation to add
              more complexity to Clashvergence in order to create a more
              believable simulator, but in the process I lost track of what was
              going on under the hood. That is what motivated me to look for a
              better process and what this project is meant to correct.
            </p>

            <p>
              Context engineering and output validation seem to be terms
              emerging that represent the best practice of software development
              in this new age. Context engineering involves curating the whole
              information environment from conventions to what dependencies to
              use, to relevant files, to what a finished product entails. Output
              validation is basically quality checking the generated code by
              reading the diff, manually writing tests against it, and
              ultimately accepting or rejecting it.
            </p>

            <p>
              While vibe coding has emerged as the term for the bad practice, it
              does not seem like the industry has settled on a single term that
              encompasses better practices like context engineering and output
              validation.
            </p>

            <p>
              For the clarity of my own personal coding process, I am going to
              call the combined process of context engineering and output
              validation primeproofing. The point of fusing them is that
              skipping either half can cause the process to fail.
            </p>

            <p>
              Priming is already a similar verb to what context engineering
              entails. Proofing already involves checking for accuracy which is
              quite similar to output validation. Compounding the two words into
              one is a satisfactory tentative term for now.
            </p>

            <p>
              I decided to do a very simple project in order to test this
              workflow by creating a simplified command line tool—grep. The tool
              already exists on my computer, which makes testing it very easy.
              All I have to do is run the real grep in bash and compare it to my
              custom script—
              <ExternalLink href="https://github.com/mcrombie/mygrep">
                mygrep.py
              </ExternalLink>
              . Keeping the project’s scope small also freed me to focus on
              practicing clean context engineering and output validation.
            </p>

            <p>
              I ran two rounds, each with their own “brief” (detailed prompt)
              sent to Codex to implement, and then I logged every defect. There
              were six such defects across the two briefs.
            </p>

            <p>
              Two defects were due to the model. Once it reported the task done
              without running the verification I had explicitly specified. Once
              it changed a line I had not asked it to touch.
            </p>

            <p>
              Three defects were my fault. They were due to gaps in my briefs. I
              had not said what should happen when the file doesn’t exist, or
              when the arguments are wrong, or where two sections of the same
              brief actually contradicted each other. Another was a process
              failure; I marked a defect fixed in the log before I had actually
              committed the fix.
            </p>

            <p>
              Then perhaps the biggest result was not that the AI was
              unreliable. It is more so that I was. Rather than the model’s
              code, most of the defects traced to my specification and my
              process. It seems like the skill I am cultivating is less about
              getting the AI to write good code and more about specifying
              clearly and checking the results honestly.
            </p>

            <p>There were also a few procedural takeaways for me.</p>

            <p>
              Including an AGENTS.md file as a sort of README for coding agents
              is a brilliantly simple optimization that I suspect will become as
              common a convention as the README itself. AGENTS.md contains the
              extra detailed context agents often need but might read as
              excessive in READMEs designed for human readability.
            </p>

            <p>
              Another major takeaway was the potential of writing and recording
              elaborate briefs rather than spontaneously writing prompts for the
              AI to implement without recording what the prompts were. Here I
              created brief files and asked Codex to implement them. This seems
              like the key practical shift between vibe coding and context
              engineering. Instead of haphazardly prompting, I spend a
              significant amount of time writing a single file that contains the
              prompt along with its specific constraints, run command, scope,
              and completion criteria. This is a practice I intend to keep
              refining in the coming months.
            </p>

            <p>
              Including a defect log for a project this small felt excessive,
              however, it did produce the only finding here I could not have
              gotten otherwise. For a project this small my instinct was to fix
              the little errors and move on without documenting them, but,
              without counting, there would have been no pattern. I would have
              just fixed the spec gaps and never noticed that many of my defects
              were from my own briefs rather than the model’s code. For my
              larger simulation projects, where feature behavior drifts over
              time in ways too subtle to catch in the moment, I am starting to
              think that history is going to be critical.
            </p>

            <p>
              There is also a caveat I want to mention: this is a post about
              validating AI output, and I validated a good deal of it with help
              from Claude Opus 4.8, including catching one of the two model
              defects above, so the line between what I caught myself and what
              surfaced with assistance is not as clean as I would like since I
              was using two different AI models, one to write the code and
              another to review it.
            </p>

            <p>I am trying to build the skills to catch such defects unaided.</p>

            <p>
              In that spirit, I decided to also explore this primeproofing
              concept by tinkering with simulating civilizations. I created a
              new project called{" "}
              <ExternalLink href="https://github.com/mcrombie/clio">
                Clio
              </ExternalLink>
              , which is meant to generate a plausible thousand-year history of
              a fictional continent. This time, instead of prompting Codex to
              start generating code right away, I spent (perhaps too much time)
              designing what I want the simulation to do in a collection of{" "}
              <ExternalLink href="https://github.com/mcrombie/clio/commit/c4e932dde3f81f56299b782f64d16949aa760e70">
                context files
              </ExternalLink>{" "}
              following a similar structure to the one I used for the mygrep
              exercise. Because the scale of this project is much vaster, these
              files ended up being much more elaborate.
            </p>

            <p>
              I had Codex implement the first and smallest brief, the core loop
              that starts with one population spreading across a small map, no
              cultures, no politics, nothing else. Clio is also a harder test
              than grep because there are no correct answers to check against.
              This time, I have to create the validation system rather than
              borrow it. The acceptance criteria passed, but a major flaw
              quickly arose. When I actually looked at the numbers I found every
              run was reporting over a hundred abandoned settlements. It seems
              people found settlements, but then would just die off, which is
              not what I was going for. Two rules, each correct on their own,
              seem to have come together to cause this issue. I will add a test
              for this in the criteria and think of how to mitigate this
              failure. I am sure I will have to do the same for a lot more
              unexpected failures as I inch my way toward something “realistic”.
            </p>

            <p>
              A faulty start is to be expected of course. This project will take
              a lot more iteration and testing. I plan to build on it in the
              coming months. I don’t intend to abandon{" "}
              <ExternalLink href="https://github.com/mcrombie/Clashvergence">
                Clashvergence
              </ExternalLink>{" "}
              either. Instead, I want to compare and contrast the two.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
