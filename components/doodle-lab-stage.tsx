import { DoodleArt } from "@/components/doodle-art";

export function DoodleLabStage() {
  return (
    <div className="doodle-lab-stage" aria-hidden="true">
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
