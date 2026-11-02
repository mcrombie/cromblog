import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, isDraftPost, type BlogPost } from "@/content/blog";
import { canPreviewDrafts } from "../draft-preview";

const post: BlogPost = blogPosts["site-security-i"];
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

export default function SiteSecurityIPage() {
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
                AI-generated illustration.
              </figcaption>
            </figure>
          )}

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Having spent considerable time developing this website and the various
              applications hosted on it, I decided it was time to give some attention
              to cybersecurity.
            </p>
            <p>
              I&apos;ve been using OpenAI Codex extensively for software development,
              but I wanted to see how effectively it could help me assess and improve
              the security of an existing application. Rather than give Codex an
              open-ended instruction to secure my website, I decided to make this a
              one-day project, with a maximum budget of approximately eight hours for
              the review, remediation, testing, and writing this post.
            </p>
            <p>
              That time limit was important because there is essentially no end to
              the improvements I could make to this website, and I am trying to pivot
              to devoting more of my time to finding full-time employment. Right now,
              I don’t need to get carried away with yet another software development
              side project. Instead, I intend this to be the first in a series of
              site security posts.
            </p>

            <h2>Investigating the Website</h2>
            <p>
              I began by asking Codex to conduct a read-only inspection of the
              CromBlog repository to establish its architecture and identify any
              potential security issues.
            </p>
            <p>
              CromBlog is built primarily with Next.js, React, and TypeScript, and
              deployed through Vercel. Most of its content consists of static pages,
              but it also hosts several interactive applications and includes an API
              proxy that connects my Clashvergence simulation to a separate backend.
            </p>
            <p>
              That distinction matters from a security perspective. While a static
              blog has relatively few opportunities for visitors to interact with
              server-side code, an application that accepts inputs and makes requests
              to another service presents considerably more risks.
            </p>
            <p>
              After figuring out the architecture, I had Codex examine the project’s
              dependencies, configuration, API routes, input handling, and external
              integrations, following established cybersecurity practices, including
              guidance from <a href="https://owasp.org/">OWASP</a>.
            </p>
            <p>
              One of the first and most substantial things we discovered was that my
              site was running an outdated version of Next.js. An npm audit also
              reported twenty-six dependency vulnerability entries. There was one
              critical as well as ten high-severity findings.
            </p>
            <p>
              At first, those results seemed alarming, but a dependency containing a
              known vulnerability does not necessarily mean that vulnerability can be
              exploited in a particular application. Some findings concerned
              development tools rather than code running on the production website,
              while others depended on specific functionality or deployment
              conditions.
            </p>
            <p>
              The next step was to distinguish actual weaknesses from potential
              risks and decide which deserved attention immediately.
            </p>

            <h2>Making Improvements</h2>
            <p>
              Codex identified several opportunities for improvement, but, for this
              initial review, I focused on just two.
            </p>
            <p>
              The more substantial concerned the API proxy connecting CromBlog to
              Clashvergence. It already included several security measures like
              request-size restrictions, timeouts, and rate limiting. Yet it also
              permitted a broader range of requests to the backend than the browser
              application actually needed.
            </p>
            <p>
              To fix this, we narrowed the proxy to the five operations used by
              Clashvergence and added stricter validation of incoming requests, which
              reduced the exposed interface without requiring changes to the
              underlying simulation.
            </p>
            <p>
              The second improvement was more straightforward: my Git configuration
              did not adequately exclude certain local environment and credential
              files, so we expanded <code>.gitignore</code> to reduce the possibility
              of accidentally committing sensitive files to the repository.
            </p>
            <p>
              Neither of these fixes was a major architectural change. That is fine
              for this stage because, for this first security post, I wanted
              improvements that could be understood relatively easily, implemented
              without major cost, and verified within the allotted time.
            </p>

            <h2>Testing the Changes</h2>
            <p>
              To make sure these security fixes didn’t break my working site, and
              because my main working directory contained extensive unfinished
              development work, Codex created a separate Git worktree for these
              security updates, allowing us to work from the deployed version of the
              website without disturbing everything else.
            </p>
            <p>
              Codex also developed a focused test suite for the modified API proxy,
              and all twelve test groups passed, covering the intended operations,
              malformed requests, request restrictions, and error handling.
            </p>
            <p>
              We even performed a small amount of mutation testing, temporarily
              disabling three security checks in memory to see whether the tests
              would catch the resulting weaknesses. The tests successfully detected
              all three.
            </p>
            <p>
              After reviewing the changes, I ran a complete Next.js production build,
              and that compiled successfully. We then deployed the security branch
              to a protected Vercel Preview environment, deliberately withholding the
              backend configuration so that testing could not accidentally interact
              with the live simulation service.
            </p>
            <p>
              The preview behaved as expected. Ordinary pages and images loaded
              correctly, and the Clashvergence proxy returned a controlled error when
              the unavailable backend was requested. I also verified that an
              unauthenticated visitor could not access the preview by opening the
              preview in an incognito window.
            </p>
            <p>
              Lastly, we merged the changes through a GitHub pull request, deployed
              them to production, and completed a final smoke test of the live
              website.
            </p>

            <h2>What Remains</h2>
            <p>
              The review did not establish that CromBlog is secure against every
              conceivable attack.
            </p>
            <p>Far from it.</p>
            <p>
              The outdated Next.js framework remains the most important unresolved
              maintenance issue. There are also additional questions concerning
              dependency vulnerabilities, external JavaScript, browser security
              policies, and, in particular, protecting the application against
              excessive resource consumption.
            </p>
            <p>
              Some of these concerns are more urgent than others. For example, the
              potential critical vulnerabilities in the old framework require extra
              attention.
            </p>
            <p>
              While the review did not establish that every applicable production
              mitigation was in place, I decided to leave broader upgrades and
              architectural changes outside the scope of this initial exercise. That
              doesn’t mean I can indefinitely postpone addressing potentially
              critical vulnerabilities, but it does mean separating urgent security
              maintenance from improvements that can wait for another day. As I said
              in the beginning, I don’t want this project to expand indefinitely and
              turn into an excuse for procrastinating sending job applications.
            </p>
            <p>
              Future installments of this series may address some of the issues
              uncovered here, beginning with upgrading the outdated Next.js
              framework. In the meantime, the website is a little more secure, I have
              a better understanding of its architecture and potential
              vulnerabilities, and I have a documented security review pointing me
              toward next steps.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
