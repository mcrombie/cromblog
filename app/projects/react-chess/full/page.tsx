import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

const ReactChessEmbed = dynamic(() => import("@/components/react-chess-embed"), {
  ssr: false,
  loading: () => (
    <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
      <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
        Loading board
      </p>
      <p className="mt-3 text-base leading-8 text-pine-800">
        Preparing the full-page React-Chess rebuild.
      </p>
    </section>
  )
});

export const metadata: Metadata = {
  title: "React-Chess Full Play"
};

export default function ReactChessFullPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Full-page play"
        title="React-Chess, without the article squeezing it."
        description="This version stays on Cromblog, but gives the rebuilt app a wider surface and a cleaner focus than the embedded article view."
      />

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-3xl text-base leading-8 text-pine-700">
            The game below is the same rebuilt React-Chess app, just given more room to breathe. If you want the surrounding writeup and comparison framing, head back to the article version.
          </p>
          <Link
            href="/projects/react-chess"
            className="inline-flex rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm text-pine-800 transition hover:bg-white"
          >
            Back to article
          </Link>
        </div>
      </section>

      <ReactChessEmbed />
    </div>
  );
}
