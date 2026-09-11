import type { Metadata } from "next";

import { ArtTabs } from "@/components/art-tabs";
import { DoodleExperiments } from "@/components/doodle-experiments";
import { DoodleGallery } from "@/components/doodle-gallery";
import { SectionHeading } from "@/components/section-heading";
import { doodleBatches, doodleCatalog } from "@/content/doodle-catalog";
import { doodleExperiments, doodleExperimentsDescription } from "@/content/doodle-experiments";

export const metadata: Metadata = {
  title: "Doodle Lab | Art",
  description:
    "Doodle Lab: Michael Crombie's notebook drawings, botanical textures, and experiments in collage, mosaics, and imagined scenes."
};

export default function ArtPage() {
  return (
    <div className="content-flow art-page">
      <SectionHeading
        eyebrow="Art"
        title="Doodle Lab"
        description="A growing collection of drawings from my notebooks, and experiments in the worlds they can become."
      />
      <ArtTabs
        experimentCount={doodleExperiments.length}
        drawings={<DoodleGallery entries={doodleCatalog} batches={doodleBatches} />}
        experiments={<DoodleExperiments entries={doodleExperiments} description={doodleExperimentsDescription} />}
      />
    </div>
  );
}
