import type { Metadata } from "next";
import { Suspense } from "react";

import { DoodleArt } from "@/components/doodle-art";
import { SectionHeading } from "@/components/section-heading";
import { cromblogMastheadDoodle } from "@/content/doodle-designs";
import { CromblogFilters } from "./cromblog-filters";

export const metadata: Metadata = {
  title: "Cromblog"
};

export default function CromblogPage() {
  return (
    <div className="content-flow">
      <div className="cromblog-doodle-masthead">
        <SectionHeading
          eyebrow="Cromblog"
          title="Cromblog"
          description="This is a series of essays primarily focused with my learning journey since my transition from history writing back to the world of software development."
        />
        <DoodleArt
          assetId={cromblogMastheadDoodle.assetId}
          placement={cromblogMastheadDoodle.placement}
          className="doodle-cromblog-masthead"
        />
      </div>
      <Suspense>
        <CromblogFilters />
      </Suspense>
    </div>
  );
}
