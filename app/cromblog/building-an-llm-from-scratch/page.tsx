import type { Metadata } from "next";
import Link from "next/link";

import { blogPosts } from "@/content/blog";

const post = blogPosts["building-an-llm-from-scratch"];

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

export default function BuildingAnLlmFromScratchPage() {
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
              A little under three months ago, I bought{" "}
              <InlineLink
                href="https://www.amazon.com/Build-Large-Language-Model-Scratch/dp/1633437167"
                external
              >
                Sebastian Raschka&#8217;s{" "}
                <em>Build a Large Language Model (From Scratch)</em>
              </InlineLink>{" "}
              and set out to learn more about artificial intelligence by
              building a model.
            </p>

            <p>
              <em>Build a Large Language Model (From Scratch)</em> lays out
              exactly what code is needed so that the reader can follow along
              by copying it and running it themselves. By doing about one
              section or subunit every day or so, I was able to complete the
              book in under three months.
            </p>

            <p>
              The result was a learning repository of Python code. &#8220;From
              scratch&#8221; does not mean &#8220;from bare metal.&#8221; The
              project still relies heavily on PyTorch. However, it does mean
              building the main pieces directly enough to see how tokenization,
              embeddings, attention, training, and fine-tuning fit together.
            </p>

            <p>
              I uploaded the code to{" "}
              <InlineLink
                href="https://github.com/mcrombie/llm-from-scratch"
                external
              >
                GitHub
              </InlineLink>
              .
            </p>

            <p>
              I did not do this expecting to become an LLM researcher. I did it
              because I dove back into coding in April, immersed myself in the
              new agentic AI tools, and found myself stunned by how powerful
              they had become. Software development is being reshaped by tools
              that feel dramatically more capable than what I remembered from a
              few years ago, and I wanted a clearer sense of what was going on
              under the hood.
            </p>

            <p>
              Building this LLM from scratch made me realize these models are
              actually much more mechanically recognizable than they first
              appear. Ultimately, they boil down to file paths, tensor shapes,
              tokenizer assumptions, hardware limits, random seeds, download
              URLs, and long-running scripts.
            </p>

            <p>
              Among the key insights was that text stops being text pretty early
              in these systems through tokenization. The AI thinks
              (metaphorically speaking) in numbers within vectors in a manner
              that I suspect better approximates human intuition than human
              logic.
            </p>

            <p>
              Simplistically, the model is trained to predict the next token.
              That was relatively easy for me to wrap my head around. It is
              still remarkable to see what behavior can emerge when you do that
              at scale. What is harder to understand is how the model keeps all
              the other contextual information from the prompt in mind without
              letting one piece send it on a wild tangent.
            </p>

            <p>
              Attention started to make more sense when I stopped treating it as
              a vague metaphor and started seeing it as an operation on
              structured data. The model is not simply reading words in a line;
              it is moving tensors through dimensions such as batch size,
              sequence length, and embedding size. Within that structure,
              attention lets each token representation weigh its relationship to
              other token representations. Multi-head attention repeats that
              process in parallel, allowing different heads to notice different
              kinds of relationships. This is where the almost magical
              resemblance to human thinking seems to emerge. However, some of
              the exercises made the fragility of this modeling concrete. If you
              add or remove the wrong dimension, the model does not become
              slightly off, it breaks entirely into a confused mess.
            </p>

            <p>
              Training these models also reveals how mundane the process can be:
              running and rerunning a function to iteratively adjust numbers by
              small amounts because a loss function judged the previous numbers
              were less useful. There is no singularly impressive moment where
              the lights turned on and intelligence awakened. Instead, it is a
              gradual process of batches, losses, optimizer steps, validation
              checking, and checkpoint files.
            </p>

            <p>
              Fine-tuning is the step that takes the pretrained model and asks
              it to behave in a particular way, reframing the same underlying
              model for a narrower task or behavior. Instead of just asking it
              what token should come next from this prompt, fine-tuning can
              adapt the model to produce a classification output. For example,
              the lesson in the book starts with spam classification.
            </p>

            <p>
              The final step in the book was to use{" "}
              <InlineLink href="https://ollama.com/" external>
                Ollama
              </InlineLink>{" "}
              to evaluate the fine-tuned LLM by assigning scores to its
              answers. This is a little strange to think about at first because
              you are essentially asking another model to score the responses of
              another model. It ends up being quite powerful though because it
              also demonstrates how AI models can interact with one another. One
              model can be assigned the developer role, while another is
              assigned the QA role, and another assigned the nontechnical client
              role, and so on and so forth. This way, one can use AI to model
              parts of a team rather than single intelligences.
            </p>

            <p>
              Taking the time to code this model linearly was helpful because
              the concepts were introduced in their natural order:
            </p>

            <p>
              <code>
                tokenization -&gt; embeddings -&gt; attention -&gt; GPT model
                -&gt; training -&gt; fine-tuning -&gt; evaluation
              </code>
            </p>

            <p>
              Of course, writing it all as one script made it messy and
              cumbersome toward the end. In hindsight, I should have done a lot
              more separation of functions and classes midway through, but since
              this was not a deliverable project I allowed myself to be rather
              lazy. I did not refactor it until I finished the last unit of the
              book. In the end, I did not write an LLM library, I wrote a map
              charting the process of developing an LLM and one I can return to
              in the future without starting over.
            </p>

            <p>
              The experience has already given me a few ideas for my other
              projects, particularly regarding using training to optimize
              simulations. Right now the{" "}
              <InlineLink
                href="https://github.com/mcrombie/Clashvergence"
                external
              >
                Clashvergence
              </InlineLink>{" "}
              simulation already boils down to numbers that serve as the metrics
              that influence the game behavior: rate of population growth, base
              combat strength, etc. Those numbers are currently somewhat
              arbitrary. I wonder if I can perform something akin to fine-tuning
              on them so as to nudge results closer to realistic-seeming
              outcomes. I intend to explore this topic in a future simulation
              post.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
