import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, isDraftPost, type BlogPost } from "@/content/blog";
import { canPreviewDrafts } from "../draft-preview";

const post: BlogPost = blogPosts["trying-linux-again"];
const hidden = isDraftPost(post) && !canPreviewDrafts();

export function generateMetadata(): Metadata {
  if (hidden) return {};
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

export default function TryingLinuxAgainPage() {
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

          {post.image && (
            <figure className="m-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-sm">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width={post.image.width}
                height={post.image.height}
                unoptimized={post.image.unoptimized}
                priority
                className="block h-auto w-full"
              />
              <figcaption className="border-t border-[color:var(--border)] px-5 py-3 font-serif text-sm italic leading-6 text-pine-900/80">
                A little laptop for writing, tinkering, and trying Linux again. AI-generated illustration.
              </figcaption>
            </figure>
          )}

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              For years I have been interested in Linux — a free and open-source
              family of operating systems built around the Linux kernel — but
              have always been discouraged by the learning curve. About a decade
              ago, I tried installing Ubuntu alongside Windows on my old laptop.
              The experiment turned into a mess, and within a week I was back to
              using Windows exclusively. Since then, Linux has remained an
              intriguing but seemingly impractical idea.
            </p>
            <p>
              Then I listened to a{" "}
              <a href="https://www.youtube.com/watch?v=NYFGCESmikA">podcast interview</a>{" "}
              with David Heinemeier Hansson (better known as DHH), and he
              convinced me to try{" "}
              <a href="https://omarchy.org/#install">Omarchy</a>, the Linux
              distribution he created based on Arch Linux. I bought a refurbished
              Acer laptop for $100 specifically for the experiment so that I
              wouldn’t risk interfering with my current Windows desktop’s
              familiar setup.
            </p>
            <p>
              The installation process was not exactly reassuring. I made a
              bootable USB stick, figured out how to start the laptop from it,
              and worked through the installer, only for it to trip over the
              existing Windows partitions. I had to open the command line, wipe
              those partitions, reboot, and enter my information again. This was
              already more troubleshooting than I would expect most people to
              tolerate when setting up a computer.
            </p>
            <p>But then it worked!</p>
            <p>
              First off, I love the retro aesthetic. More challenging is the
              keyboard-first approach. Omarchy encourages you to launch
              applications and manage windows through shortcuts rather than
              constantly reaching for the mouse. Fortunately,{" "}
              <a href="https://omarchy.org/manual/hotkeys/">Super + K opens a list of keybindings</a>,
              so there is at least one shortcut that helps you learn the others.
            </p>
            <p>
              I can see how this could become fast and comfortable once the
              regular commands become second nature. And yet that’s the rub:
              right now, I am still looking them up often, and an unfamiliar
              shortcut is not faster than a familiar click.
            </p>
            <p>
              Some benefits are more immediate.{" "}
              <a href="https://hypr.land/">Hyprland</a>, the Wayland compositor
              that handles Omarchy’s window arrangement, automatically tiles
              windows rather than leaving me to resize and position everything
              myself. As I write this post, I have my writing window on one side
              and the <a href="https://omarchy.org/manual/">Omarchy manual</a> on
              the other. It is a small convenience, but one I can appreciate
              immediately, without needing weeks of practice.
            </p>
            <p>
              The most exciting (and concerning) difference from my usual Windows
              workflow is Omarchy’s <a href="https://omarchy.org/manual/ai/">embrace of AI agents</a>.
              It invited me to configure an agent as part of getting started,
              treating it as something that could help me understand and modify
              the computer itself. I chose Codex and gave it an immediate
              assignment: investigate why the default dictation setup would not
              work with my CPU. It diagnosed the problem and found a compatible
              prerelease of <a href="https://voxtype.io/">Voxtype</a> to use
              instead. It was a more compelling introduction than another
              demonstration of generating code.
            </p>
            <p>
              I am also curious about programs such as{" "}
              <a href="https://github.com/jesseduffield/lazygit">Lazygit</a>, a
              terminal interface for Git that offers an alternative to the
              GitHub Desktop application I currently use. I am beginning to
              appreciate how much more there is to working in a terminal than
              typing individual commands.
            </p>
            <p>
              After two weeks, though, I am still using Windows for my usual
              writing and development work. I have been giving Omarchy about
              twenty minutes a day while concentrating on other projects, which
              is enough to discover possibilities, but hardly a fair test of
              whether a different workflow could replace habits I have practiced
              for years. Also, learning Omarchy’s particular interface is not
              the same thing as learning everything Linux has to offer.
            </p>
            <p>
              For now, I am not ready to switch my main computer. But I am finding
              something useful between abandoning Windows and abandoning the
              experiment: a little laptop for writing, tinkering, and gradually
              getting comfortable with a different way of working.
            </p>
            <p>
              This time, at least, I am still using Linux after the first week.
              We will see if I am still using it after a couple of months.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
