import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="About"
        title="Work that prefers depth to noise."
        description="Cromblog is designed as a steady portfolio rather than a feed: a place for projects that span software, history, writing, and the long middle stretch between first idea and finished form."
      />

      <section className="editorial-copy rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="content-flow">
          <p className="text-base leading-8 text-pine-800">
            Some work begins as code, some as research, and some as a question
            that refuses to stay in a single discipline. This site is meant to
            hold all of those forms without forcing them into a louder shape
            than they need.
          </p>
          <p className="text-base leading-8 text-pine-800">
            The common thread is duration. These projects reward patience,
            revision, and a willingness to think across systems, narratives, and
            historical scale.
          </p>
          <p className="text-base leading-8 text-pine-800">
            Over time, Cromblog can grow into a home for essays, project notes,
            historical writing, and software experiments that deserve more than
            a single release announcement.
          </p>
        </div>
      </section>
    </div>
  );
}

