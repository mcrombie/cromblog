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
        title="About"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />

      <section className="editorial-copy rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="content-flow">
          <p className="text-base leading-8 text-pine-800">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className="text-base leading-8 text-pine-800">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <p className="text-base leading-8 text-pine-800">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </p>
        </div>
      </section>
    </div>
  );
}
