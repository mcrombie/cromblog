import type { CSSProperties } from "react";

import {
  doodleAssets,
  type DoodleAssetId,
  type DoodlePlacement
} from "@/content/doodles";

type DoodleArtProps = {
  assetId: DoodleAssetId;
  placement: DoodlePlacement;
  className?: string;
};

export function DoodleArt({
  assetId,
  placement,
  className
}: DoodleArtProps) {
  const asset = doodleAssets[assetId];
  const allowedPlacements =
    asset.allowedPlacements as readonly DoodlePlacement[];

  if (!allowedPlacements.includes(placement)) {
    throw new Error(
      `Doodle asset "${assetId}" cannot be used as a ${placement}.`
    );
  }

  const style: CSSProperties = {
    aspectRatio: `${asset.image.width} / ${asset.image.height}`,
    backgroundColor: "currentColor",
    maskImage: `url("${asset.src}")`,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "contain",
    WebkitMaskImage: `url("${asset.src}")`,
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "contain"
  };

  return (
    <span
      className={["doodle-art", className].filter(Boolean).join(" ")}
      style={style}
      data-doodle-asset={asset.id}
      data-doodle-kind={asset.kind}
      data-doodle-placement={placement}
      aria-hidden="true"
    />
  );
}

