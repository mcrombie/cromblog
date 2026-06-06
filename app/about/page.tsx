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
        title="Michael Crombie"
        description="Software developer with a background in building interactive tools, simulations, and editorial experiences from the ground up."
      />

      <section className="editorial-copy rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="content-flow">
          <p className="text-base leading-8 text-pine-800">
            I&apos;m a software developer. I build things across the stack —
            from Python simulations to TypeScript/React applications — with a
            particular interest in projects that have a strong interactive or
            experiential quality. The work on this site reflects that range: a
            hex-map worldbuilding editor, a phoneme chart that lets you hear the
            sounds of language, a civilization simulation built in layers over
            several months.
          </p>
          <p className="text-base leading-8 text-pine-800">
            The throughline in most of my projects is curiosity: I tend to start
            with a question I can&apos;t answer without building something. That
            process produces both the project itself and the writing that
            documents it, which is why this site combines a portfolio and a
            blog.
          </p>
          <p className="text-base leading-8 text-pine-800">
            You can reach me at{" "}
            <a
              href="mailto:mcrombie1994@gmail.com"
              className="underline underline-offset-2 hover:opacity-70"
            >
              mcrombie1994@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
