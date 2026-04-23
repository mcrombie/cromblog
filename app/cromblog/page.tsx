import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { blogOrder, blogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Cromblog"
};

export default function CromblogPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Cromblog"
        title="Cromblog"
        description="Posts appear here in reverse chronological order."
      />

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="content-flow">
          {blogOrder.map((slug) => {
            const post = blogPosts[slug];

            return (
              <article
                key={post.slug}
                className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/60 p-6 sm:p-7"
              >
                <div className="content-flow">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-pine-700/80">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="content-flow">
                    <h2 className="font-serif text-2xl text-ink sm:text-3xl">
                      <Link
                        href={post.href}
                        className="underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="editorial-copy text-base leading-8 text-pine-800">
                      {post.summary}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
