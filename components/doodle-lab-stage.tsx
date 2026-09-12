import { DoodleArt } from "@/components/doodle-art";
import { doodleCatalogById } from "@/content/doodle-catalog";
import type { CSSProperties } from "react";

// A small, deliberate cast from the growing collection. Archived studies never
// become ambient decoration. The source ID stays stable when a crop is refined.
const labDrawings = [
  { id: "ma24-p100-a", className: "doodle-lab-bird" },
  { id: "ma24-p065-a", className: "doodle-lab-leaf-cat" },
  { id: "jj2526-p228-a", className: "doodle-lab-branch" },
  { id: "ma24-p081-a", className: "doodle-lab-leaf" },
  { id: "jj2526-p244-a", className: "doodle-lab-acorns" }
] as const;

export function DoodleLabStage() {
  return (
    <div className="doodle-lab-stage" aria-hidden="true">
      {labDrawings.map(({ id, className }) => {
        const drawing = doodleCatalogById[id];
        if (!drawing || drawing.status === "archive") return null;
        const style: CSSProperties = {
          aspectRatio: `${drawing.image.width} / ${drawing.image.height}`,
          backgroundColor: "currentColor",
          maskImage: `url("${drawing.src}")`,
          WebkitMaskImage: `url("${drawing.src}")`,
          maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat",
          maskPosition: "center", WebkitMaskPosition: "center",
          maskSize: "contain", WebkitMaskSize: "contain"
        };
        return <span key={id} className={`doodle-art ${className}`} style={style}
          data-doodle-asset={id} data-doodle-placement="ambient" aria-hidden="true" />;
      })}
      <DoodleArt
        assetId="one-eyed-gentleman-01"
        placement="ambient"
        className="doodle-lab-gentleman"
      />
      <DoodleArt
        assetId="bow-tied-crocodile-01"
        placement="ambient"
        className="doodle-lab-crocodile"
      />
      <DoodleArt
        assetId="caped-rabbit-01"
        placement="ambient"
        className="doodle-lab-rabbit"
      />
      <DoodleArt
        assetId="orb-balancing-slug-01"
        placement="ambient"
        className="doodle-lab-slug"
      />
      <DoodleArt
        assetId="eye-flower-sentinel-01"
        placement="ambient"
        className="doodle-lab-sentinel"
      />
    </div>
  );
}
