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

      <section className="editorial-panel">
        <h2 className="sr-only">Background and contact</h2>
        <div className="about-layout">
          <div className="about-story">
            <p>
              I&apos;m a software developer. I build things across the stack —
              from Python simulations to TypeScript/React applications — with a
              particular interest in projects that have a strong interactive or
              experiential quality. The work on this site reflects that range: a
              hex-map worldbuilding editor, a phoneme chart that lets you hear
              the sounds of language, a civilization simulation built in layers
              over several months.
            </p>
            <p>
              The throughline in most of my projects is curiosity: I tend to
              start with a question I can&apos;t answer without building something.
              That process produces both the project itself and the writing that
              documents it, which is why this site combines a portfolio and a
              blog.
            </p>
          </div>

          <aside className="about-aside">
            <h3 className="about-aside-heading">Find a path in</h3>
            <ul className="about-facts">
              <li>Software and systems</li>
              <li>History and language</li>
              <li>Worlds and simulations</li>
            </ul>
            <h3 className="about-aside-heading" style={{ marginTop: "1.5rem" }}>
              Correspondence
            </h3>
            <a href="mailto:mcrombie1994@gmail.com" className="about-contact">
              mcrombie1994@gmail.com
            </a>
          </aside>
        </div>
      </section>
    </div>
  );
}
