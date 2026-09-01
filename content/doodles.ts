export type DoodleAssetId =
  | "owl-on-branch-01"
  | "raven-01"
  | "scissor-tailed-flycatcher-01"
  | "red-eyed-vireo-01"
  | "carolina-wren-01"
  | "common-flicker-tree-01"
  | "crombot-1-01"
  | "leaf-vine-01"
  | "feathered-eye-01"
  | "one-eyed-gentleman-01"
  | "bow-tied-crocodile-01"
  | "caped-rabbit-01"
  | "orb-balancing-slug-01"
  | "eye-flower-sentinel-01";

export type DoodleKind =
  | "specimen"
  | "composition"
  | "rule"
  | "mark"
  | "character";

export type DoodlePlacement =
  | "hero"
  | "margin"
  | "divider"
  | "endmark"
  | "card"
  | "empty-state"
  | "ambient";

type NormalizedPoint = {
  /** A value from 0 through 1. */
  x: number;
  /** A value from 0 through 1. */
  y: number;
};

type DoodleSemantics =
  | { decorative: true; alt: "" }
  | { decorative: false; alt: string };

export type DoodleAsset = {
  id: DoodleAssetId;
  src: `/cromblog/doodles/${string}.png`;
  displayName?: string;
  kind: DoodleKind;
  tags: readonly string[];
  image: {
    width: number;
    height: number;
  };
  focalPoint: NormalizedPoint;
  allowedPlacements: readonly DoodlePlacement[];
  semantics: DoodleSemantics;
  provenance: {
    sourceFile: `${string}.jpg`;
    treatment: "ai-assisted-cleanup" | "manual-cleanup" | "redrawn";
  };
};

export const doodleCollection = {
  artist: "Michael Crombie",
  collection: "Doodles June through August 31st, 2026",
  approvedOn: "2026-08-31"
} as const;

export const doodleOrder: DoodleAssetId[] = [
  "owl-on-branch-01",
  "raven-01",
  "scissor-tailed-flycatcher-01",
  "red-eyed-vireo-01",
  "carolina-wren-01",
  "common-flicker-tree-01",
  "crombot-1-01",
  "leaf-vine-01",
  "feathered-eye-01",
  "one-eyed-gentleman-01",
  "bow-tied-crocodile-01",
  "caped-rabbit-01",
  "orb-balancing-slug-01",
  "eye-flower-sentinel-01"
];

export const doodleAssets = {
  "owl-on-branch-01": {
    id: "owl-on-branch-01",
    src: "/cromblog/doodles/owl-on-branch-01.png",
    kind: "specimen",
    tags: ["bird", "owl", "front-facing", "branch", "calm"],
    image: { width: 1099, height: 1431 },
    focalPoint: { x: 0.5, y: 0.42 },
    allowedPlacements: ["hero", "margin", "endmark", "card"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_152310496.jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "raven-01": {
    id: "raven-01",
    src: "/cromblog/doodles/raven-01.png",
    kind: "specimen",
    tags: ["bird", "raven", "crow", "profile", "technical"],
    image: { width: 1254, height: 1254 },
    focalPoint: { x: 0.5, y: 0.5 },
    allowedPlacements: ["hero", "margin", "endmark", "card"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_152423466.jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "scissor-tailed-flycatcher-01": {
    id: "scissor-tailed-flycatcher-01",
    src: "/cromblog/doodles/scissor-tailed-flycatcher-01.png",
    kind: "specimen",
    tags: ["bird", "flycatcher", "profile", "long-tail", "vertical"],
    image: { width: 1024, height: 1536 },
    focalPoint: { x: 0.45, y: 0.35 },
    allowedPlacements: ["hero", "margin", "endmark", "card"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_152426758.jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "red-eyed-vireo-01": {
    id: "red-eyed-vireo-01",
    src: "/cromblog/doodles/red-eyed-vireo-01.png",
    kind: "specimen",
    tags: ["bird", "vireo", "profile", "branch", "horizontal"],
    image: { width: 1402, height: 1122 },
    focalPoint: { x: 0.5, y: 0.47 },
    allowedPlacements: ["hero", "margin", "endmark", "card"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_152433020.jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "carolina-wren-01": {
    id: "carolina-wren-01",
    src: "/cromblog/doodles/carolina-wren-01.png",
    kind: "specimen",
    tags: ["bird", "carolina-wren", "profile", "upturned-tail", "perch", "horizontal"],
    image: { width: 1403, height: 1121 },
    focalPoint: { x: 0.51, y: 0.51 },
    allowedPlacements: ["hero", "margin", "endmark", "card"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "unnamed (2).jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "common-flicker-tree-01": {
    id: "common-flicker-tree-01",
    src: "/cromblog/doodles/common-flicker-tree-01.png",
    kind: "composition",
    tags: ["bird", "common-flicker", "tree", "vertical", "margin"],
    image: { width: 935, height: 1681 },
    focalPoint: { x: 0.52, y: 0.48 },
    allowedPlacements: ["hero", "margin"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_152415768.jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "crombot-1-01": {
    id: "crombot-1-01",
    src: "/cromblog/doodles/crombot-1-pencil-01.png",
    displayName: "Crombot 1",
    kind: "character",
    tags: [
      "character",
      "robot",
      "robot-car",
      "cardboard",
      "electronics",
      "ultrasonic-sensor",
      "three-quarter",
      "graphite",
      "pencil"
    ],
    image: { width: 1254, height: 1254 },
    focalPoint: { x: 0.5, y: 0.5 },
    allowedPlacements: [
      "hero",
      "margin",
      "endmark",
      "card",
      "empty-state",
      "ambient"
    ],
    semantics: {
      decorative: false,
      alt: "Graphite drawing of Crombot 1, a small cardboard robot car with sensor eyes, exposed electronics, wheels, and looping jumper wires."
    },
    provenance: {
      sourceFile: "1000005519.jpg",
      treatment: "redrawn"
    }
  },
  "leaf-vine-01": {
    id: "leaf-vine-01",
    src: "/cromblog/doodles/leaf-vine-01.png",
    kind: "rule",
    tags: ["botanical", "vine", "leaves", "divider", "repeatable"],
    image: { width: 857, height: 1836 },
    focalPoint: { x: 0.5, y: 0.5 },
    allowedPlacements: ["divider", "endmark"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_150953250.jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "feathered-eye-01": {
    id: "feathered-eye-01",
    src: "/cromblog/doodles/feathered-eye-01.png",
    kind: "mark",
    tags: ["feather", "eye", "leaf", "symbol", "eccentric"],
    image: { width: 1001, height: 1571 },
    focalPoint: { x: 0.5, y: 0.43 },
    allowedPlacements: ["margin", "endmark", "card"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_151040675.jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "one-eyed-gentleman-01": {
    id: "one-eyed-gentleman-01",
    src: "/cromblog/doodles/one-eyed-gentleman-01.png",
    kind: "character",
    tags: ["character", "one-eye", "top-hat", "cane", "formal"],
    image: { width: 1023, height: 1537 },
    focalPoint: { x: 0.5, y: 0.48 },
    allowedPlacements: ["empty-state", "endmark", "card", "ambient"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_151309621.jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "bow-tied-crocodile-01": {
    id: "bow-tied-crocodile-01",
    src: "/cromblog/doodles/bow-tied-crocodile-01.png",
    kind: "character",
    tags: ["character", "crocodile", "bow-tie", "horizontal", "eccentric"],
    image: { width: 1422, height: 1106 },
    focalPoint: { x: 0.5, y: 0.5 },
    allowedPlacements: ["ambient", "card", "empty-state"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_151233685.jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "caped-rabbit-01": {
    id: "caped-rabbit-01",
    src: "/cromblog/doodles/caped-rabbit-01.png",
    kind: "character",
    tags: ["character", "rabbit", "cape", "bow-tie", "eccentric"],
    image: { width: 1122, height: 1402 },
    focalPoint: { x: 0.45, y: 0.48 },
    allowedPlacements: ["ambient", "card", "empty-state"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_151402285.jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "orb-balancing-slug-01": {
    id: "orb-balancing-slug-01",
    src: "/cromblog/doodles/orb-balancing-slug-01.png",
    kind: "character",
    tags: ["character", "slug", "orb", "horizontal", "deadpan"],
    image: { width: 1536, height: 1024 },
    focalPoint: { x: 0.54, y: 0.49 },
    allowedPlacements: ["ambient", "endmark", "card", "empty-state"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_151217423.jpg",
      treatment: "ai-assisted-cleanup"
    }
  },
  "eye-flower-sentinel-01": {
    id: "eye-flower-sentinel-01",
    src: "/cromblog/doodles/eye-flower-sentinel-01.png",
    kind: "composition",
    tags: ["eye", "flower", "orb", "pedestal", "surreal", "vertical"],
    image: { width: 1023, height: 1537 },
    focalPoint: { x: 0.5, y: 0.38 },
    allowedPlacements: ["ambient", "hero", "margin"],
    semantics: { decorative: true, alt: "" },
    provenance: {
      sourceFile: "IMG_20260817_151415321.jpg",
      treatment: "ai-assisted-cleanup"
    }
  }
} satisfies Record<DoodleAssetId, DoodleAsset>;

export function doodleAspectRatio(asset: DoodleAsset) {
  return asset.image.width / asset.image.height;
}
