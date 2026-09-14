import type { Metadata } from "next";

import "@/app/art-showcase.css";
import { ArtShowcase } from "@/components/art-showcase";
import { ArtTabs } from "@/components/art-tabs";
import { DoodleExperiments } from "@/components/doodle-experiments";
import { DoodleGallery } from "@/components/doodle-gallery";
import { SectionHeading } from "@/components/section-heading";
import { doodleVibeMarks } from "@/content/doodle-vibe";
import { doodleBatches, doodleCatalog } from "@/content/doodle-catalog";
import { doodleExperiments, doodleExperimentsDescription } from "@/content/doodle-experiments";
import { buildDoodleSubjectGroups } from "@/content/doodle-subjects";

export const metadata: Metadata = {
  title: "Doodle Lab | Art",
  description:
    "Doodle Lab: Michael Crombie's notebook drawings, botanical textures, and experiments in collage, mosaics, and imagined scenes."
};

export default function ArtPage() {
  const subjectGroups = buildDoodleSubjectGroups(doodleCatalog);
  return (
    <div className="content-flow art-page">
      <SectionHeading
        eyebrow="Art"
        title="Doodle Lab"
        doodle={doodleVibeMarks.art}
        description="A growing collection of drawings from my notebooks, and experiments in the worlds they can become."
      />
      <ArtTabs
        experimentCount={doodleExperiments.length}
        showcase={<ArtShowcase />}
        drawings={<DoodleGallery entries={doodleCatalog} batches={doodleBatches} subjectGroups={subjectGroups} />}
        experiments={<DoodleExperiments entries={doodleExperiments} description={doodleExperimentsDescription} />}
      />
    </div>
  );
}
