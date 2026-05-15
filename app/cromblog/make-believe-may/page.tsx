import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["make-believe-may"];

export const metadata: Metadata = {
  title: post.title
};

export default function MakeBelieveMayPage() {
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
              Last month, I focused on learning to code with AI tools. I spent
              the first week of this month doing a final polish of my history
              manuscript and then sent it to my editor. He will be working on it
              for the next few weeks, so for now it is out of my hands.
            </p>

            <p>
              In the meantime, I am pivoting back to the fiction draft I have
              been chipping away at over the last year. In that spirit, I am
              calling this month Make-Believe May. My primary focus will be
              fiction writing. My secondary focus will be experimenting with
              content-generation systems: AI-assisted tools for creating worlds,
              cultures, languages, colonies, and simulated histories.
            </p>

            <p>
              While this may seem like an escapist, even childish, detour, I
              think the opposite is true. Fiction has a salutary effect upon
              adults, even though many of us are reluctant to admit our craving
              for wonder. The seriousness of adult life often makes us embarrassed
              by that desire. As Tolkien said:
            </p>

            <blockquote>
              <p>
                &#8220;Let us not divide the human race into Eloi and Morlocks:
                pretty children&#8212;&#8220;elves&#8221; as the eighteenth
                century often idiotically called them&#8212;with their fairytales
                (carefully pruned), and dark Morlocks tending their machines. If
                fairy-story as a kind is worth reading at all it is worthy to be
                written for and read by adults. They will, of course, put more in
                and get more out than children can.&#8221;
              </p>
              <footer>
                Tolkien,{" "}
                <a
                  href="https://coolcalvary.com/wp-content/uploads/2018/10/on-fairy-stories1.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
                >
                  &#8220;On Fairy Stories&#8221;
                </a>
              </footer>
            </blockquote>

            <p>
              Out of fiction I think we can derive recovery from the dullness
              created by our practical habits and routines. It revives our
              deadened perspectives. For such life to return, escape is required,
              and that is a good thing, assuming the story holds to the
              &#8220;eucatastrophic&#8221; principle of happy endings. It is not
              about denying reality but about refreshing your perspective, about
              consoling us when we have gone through the inevitable hard times
              life has in store for all of us. It is a way for us to resist
              cynicism by reconnecting to mythic thinking and enlarging our
              emotional and spiritual worlds.
            </p>

            <p>
              In the spirit of make-believe, I am using AI tools to tinker with
              content-generation by revisiting a fantasy world I have been
              constructing since high school. It has mostly lived in half-baked
              document folders where I would start stories but never finish them.
              The maps I have drawn over the years were more complete and have,
              over time, converged on a pretty consistent geography. I am using
              this geography as a basis for{" "}
              <a
                href="https://github.com/mcrombie/azhora"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                building out a whole fictional world
              </a>
              .
            </p>

            <p>
              My method is to give big picture directives to Claude Code (and
              when I run out of usage to Codex) so that it fleshes out details of
              regions. For example, I know that there is a peninsula called Suval
              with multiple city states with different economies and values, but I
              only have so much detail to provide it. I allow the AI to fill in
              gaps. If I don&#8217;t like anything it writes, I can modify it
              later. This allows me to move fast. It is also remarkable at
              building realistic languages so that right now my primary continent
              has five language groups. This lays the foundation for a rich
              history full of cultural nuances.
            </p>

            <p>
              I am also working on{" "}
              <a
                href="https://github.com/mcrombie/colony-agent"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                another project
              </a>{" "}
              that operates on a much smaller scale than Azhora or Clashvergence.
              It is a simulation of a single colony where each individual
              ultimately has their own name and profile. I see this as a more
              granular exercise in content generation.
            </p>

            <p>
              I am trying to make it agentic by having it call the OpenAI API
              each time it runs. The AI is called upon twice so as to make one
              decision about what event affects the colony that day. Then it is
              called separately to decide how the colonists should respond to the
              event, or, if there is no significant event, what they should do
              that day. Over time, this is building a miniature improvised history
              full of accidents, conflicts, shortages, deaths, and surprising
              decisions.
            </p>

            <p>
              The theme I am circling around with these make-believe coding
              projects is content generation. I am not especially interested in
              asking AI to &#8220;write me a fantasy kingdom.&#8221; That is too
              vague and usually too bland. What interests me is whether AI tools
              can help turn specific fictional premises into structured worlds:
              regions, peoples, languages, political histories, economies, myths,
              and conflicts.
            </p>

            <p>
              This connects directly to{" "}
              <a
                href="https://github.com/mcrombie/Clashvergence"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
              >
                Clashvergence
              </a>
              , where I am trying to develop more realistic history generation
              from simulation data. But it also applies to fantasy worldbuilding.
              The goal is not to outsource imagination. The goal is to use code
              and AI systems to give imagination a machine it can run through.
            </p>

            <p>
              This calls for more specific prompting that provides specific names
              and details to add texture and direction. For example,
              &#8220;Following the coast southwest of Nylon and the south of the
              Lizeem River is the peninsula called Ascarth. There are many small
              cities and towns on this peninsula, but Aevis is by far the largest
              and most powerful and often unites the whole peninsula as the
              Kingdom of Ascarth. The Avites are a warlike people who love to
              build with bronze.&#8221;
            </p>

            <p>
              While this is remarkably good for generating boilerplate lore that
              would be tedious to expand on in such detail manually, I have
              noticed Claude Code and Codex are quite terrible at making maps out
              of pictures I provide them. They often get confused about the
              geography, mixing up directions, and generally seem to have a poor
              awareness of the hypothetical physical dimensions of this world.
            </p>

            <p>
              Yet my primary focus is that which I will write least
              of&#8212;my fantasy book. At some point in the process of writing
              the history book, my brain seemed to start spewing a fairy story. I
              don&#8217;t claim to have done it intentionally. The ideas simply
              came over me. I have been working on it occasionally for over two
              years now, and I have made my overarching goal of this month, while
              I anxiously await feedback from my editor about my history book, to
              finish the first draft of this fantasy tale. By first draft I mean
              to turn it from a collection of vignettes into a comprehensive whole
              with a clear story structure and ending. It is not to be the last
              draft though. I will still need to step away once more to refresh my
              mind and then reread and meditate upon what I have created.
            </p>

            <p>
              Whether these projects ultimately become games, simulations, novels,
              or simply auto-didactic experiments, they all seem to revolve around
              this question: how can I make believable imaginary worlds and
              stories? That is what I am exploring this month, both through
              writing fiction and writing code. Perhaps through well-done
              make-believe we can learn to see reality more clearly.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
