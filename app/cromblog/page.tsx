import type { Metadata } from "next";
import { Suspense } from "react";

import { SectionHeading } from "@/components/section-heading";
import { CromblogFilters } from "./cromblog-filters";

export const metadata: Metadata = {
  title: "Cromblog"
};

export default function CromblogPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Cromblog"
        title="Cromblog"
        description="This is a series of essays primarily focused with my learning journey since my transition from history writing back to the world of software development."
      />
      <Suspense>
        <CromblogFilters />
      </Suspense>
    </div>
  );
}
