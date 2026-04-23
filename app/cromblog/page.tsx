import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Cromblog"
};

export default function CromblogPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Cromblog"
        title="Cromblog"
        description="Posts will appear here in chronological order."
      />

      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8" />
    </div>
  );
}
