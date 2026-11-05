import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, isDraftPost, type BlogPost } from "@/content/blog";
import { canPreviewDrafts } from "../draft-preview";

const post: BlogPost = blogPosts["site-security-ii"];
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

export default function SiteSecurityIIPage() {
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
              In my <Link href="/cromblog/site-security-i">first Securing CromBlog post</Link>,
              I described using Codex to conduct a timeboxed security review of my
              website and implement a couple of targeted improvements. That exercise
              identified several potential vulnerabilities, but, since I deliberately
              limited the scope to about eight hours to avoid getting carried away
              with yet another software development project, I did not actually carry
              out the most urgent update: upgrading the outdated version of Next.js,
              the React framework upon which the website is built.
            </p>

            <h2>Upgrading the Framework</h2>
            <p>
              CromBlog was running Next.js 13.4.19, a version released several years
              ago and <a href="https://nextjs.org/support-policy">no longer supported</a>.
              My earlier security audit had identified numerous dependency
              vulnerabilities related to this old version, though not all of them
              necessarily affected the production website.
            </p>
            <p>
              Still, further investigation revealed an especially concerning{" "}
              <a href="https://github.com/vercel/next.js/security/advisories/GHSA-mwv6-3258-q52c">issue involving React Server Components</a>,
              which could expose affected applications to denial-of-service attacks.
              In other words, specially crafted requests could potentially cause the
              server to consume excessive resources or become unavailable. I doubt
              there are many people or agents with much incentive to attack my site
              in particular, but it was still a clear vulnerability worth repairing,
              so I decided to upgrade to the current release: Next.js 16.
            </p>
            <p>
              I asked Codex to investigate the requirements for the migration and
              determine whether it could be accomplished without becoming another
              major project. Fortunately, the necessary changes seemed quite
              manageable and doable in just a few hours.
            </p>
            <p>
              The <a href="https://nextjs.org/docs/app/guides/upgrading/version-16">upgrade</a> involved
              more than simply changing a version number in <code>package.json</code> because
              we also needed to update React, the Node.js runtime, dependencies and
              linting tools, and several parts of the existing application that relied
              on older Next.js conventions.
            </p>
            <p>
              One significant change involved replacing Next.js’s old{" "}
              <code>middleware.ts</code> convention with{" "}
              <a href="https://nextjs.org/docs/app/guides/upgrading/version-16#middleware-to-proxy"><code>proxy.ts</code></a>.
              This was especially important because I have CromBlog using middleware
              to restrict access to unpublished blog posts. Other adjustments
              concerned the API routes connecting CromBlog to my{" "}
              <Link href="/projects/clashvergence-demo">Clashvergence simulation</Link>,
              along with a handful of existing React components that needed changes
              per the newer system.
            </p>

            <h2>Testing the Upgrade</h2>
            <p>
              Since upgrading a framework across three major versions risks creating
              subtle regression issues, even when the application appears to work,
              I wanted to make sure that the migration preserved the website’s
              existing functionality, particularly the security improvements made
              during the first review.
            </p>
            <p>
              Codex ran linting, TypeScript, and production build checks, along with
              dedicated tests for the API proxy and unpublished-draft protections.
              We also conducted automated browser tests using Chrome, checking the
              website’s pages, navigation, images, interactive features, and embedded
              applications. The tests included desktop and mobile layouts, with
              screenshots for visual inspection.
            </p>
            <p>
              Eventually, the upgraded site passed its automated tests, built
              successfully on Vercel, and was ready for production.
            </p>

            <h2>Deploying the Upgrade</h2>
            <p>
              After reviewing the results, I authorized the production release, and
              the upgraded website now runs Next.js 16.4.5, React 19.3.1, and Node.js 24.
            </p>
            <p>
              Once the deployment was live, I had Codex repeat the browser and HTTP
              checks against the production website, including all twenty-eight
              published blog routes. We also tested the live Clashvergence integration
              by creating a temporary simulation, advancing it by one turn, retrieving
              its updated state, and deleting it.
            </p>
            <p>
              Everything important passed, and no rollback was necessary. What’s
              more, the production dependency audit now reports zero known
              vulnerabilities, compared with the multiple findings that initially
              prompted this whole security review.
            </p>
            <p>
              That does not mean CromBlog is now perfectly secure since this
              dependency audit only checked for known vulnerabilities in the packages
              it examined. It can’t determine whether the application itself contains
              exploitable weaknesses.
            </p>
            <p>
              There are also a few remaining warnings involving development tools,
              along with some pre-existing minor problems unrelated to the upgrade.
              Still, the outdated framework, which had been the largest outstanding
              concern from the first review, has now been replaced, and, though there
              are still plenty of improvements I could make to CromBlog, for now I
              think it’s stable and presentable enough to return my attention to
              finding full-time employment.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
