import type { BlogSlug } from "@/content/blog";
import type {
  DoodleAssetId,
  DoodlePlacement
} from "@/content/doodles";

export type PostDoodleDesign = {
  rail: DoodleAssetId;
  accent: {
    assetId: DoodleAssetId;
    placement: Extract<DoodlePlacement, "divider" | "endmark">;
  };
};

export const cromblogMastheadDoodle = {
  assetId: "red-eyed-vireo-01",
  placement: "hero"
} as const satisfies {
  assetId: DoodleAssetId;
  placement: DoodlePlacement;
};

export const postDoodleDesigns = {
  "archivist-iii-lowering-latency": {
    rail: "raven-01",
    accent: {
      assetId: "feathered-eye-01",
      placement: "endmark"
    }
  },
  "make-believe-may": {
    rail: "scissor-tailed-flycatcher-01",
    accent: {
      assetId: "leaf-vine-01",
      placement: "divider"
    }
  }
} as const satisfies Partial<Record<BlogSlug, PostDoodleDesign>>;

