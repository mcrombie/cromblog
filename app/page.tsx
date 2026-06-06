import { SectionHeading } from "@/components/section-heading";

export default function HomePage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Home"
        title="Home"
        description="A portfolio and writing space for Michael Crombie — software developer and writer."
      />

      <section className="editorial-copy rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="content-flow">
          <p className="text-base leading-8 text-pine-800">
            This site collects the projects I build and the writing I do around
            them. Some of it is technical — simulations, tools, rebuilt apps —
            and some of it is more reflective: essays about the ideas that
            motivated those projects in the first place.
          </p>
          <p className="text-base leading-8 text-pine-800">
            The best place to start is the Blog, where posts are organized by
            publication date or series, or the Projects page if you&apos;d rather go straight to
            the work.
          </p>
        </div>
      </section>
    </div>
  );
}
