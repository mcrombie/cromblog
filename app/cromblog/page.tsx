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
        description="Posts appear here by date and can be filtered by series."
      />
      <Suspense>
        <CromblogFilters />
      </Suspense>
    </div>
  );
}
