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
        description="Essays and field notes on software, simulated histories, language, and the worlds that emerge between them."
      />
      <Suspense>
        <CromblogFilters />
      </Suspense>
    </div>
  );
}
