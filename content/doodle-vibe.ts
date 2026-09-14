import generated from "@/content/doodle-vibe-assets.generated.json";

export type VibeDoodleId = keyof typeof generated;
export type VibeDoodle = Omit<(typeof generated)[VibeDoodleId], "id" | "role"> & {
  id: VibeDoodleId;
  role: "hero" | "specimen" | "mark" | "meadow" | "ornament";
};

// This small registry is safe to import from client components. Never import the
// full catalog or experiment collection here; the build script resolves those.
export const vibeDoodles = generated as Record<VibeDoodleId, VibeDoodle>;

export const doodleVibeRoutes = {
  exact: {
    "/": "red-eyed-vireo-01",
    "/about": "carolina-wren-01",
    "/cromblog": "scissor-tailed-flycatcher-01",
    "/projects": "owl-on-branch-01",
    "/games": "raven-01",
    "/art": "owl-on-branch-01",
    "/cromblog/crombot-one": "common-flicker-tree-01",
    "/cromblog/clio": "owl-on-branch-01",
    "/cromblog/cromonsters": "carolina-wren-01",
    "/cromblog/revisiting-roots-of-civilization": "red-eyed-vireo-01",
    "/cromblog/cradle-of-the-empire": "raven-01",
    "/cromblog/an-auspicious-august": "carolina-wren-01",
    "/cromblog/evaluator-also-has-to-be-evaluated": "owl-on-branch-01",
    "/cromblog/primeproofing-beyond-vibe-coding": "scissor-tailed-flycatcher-01",
    "/cromblog/building-an-llm-from-scratch": "common-flicker-tree-01",
    "/cromblog/interactive-phoneme-chart": "carolina-wren-01",
    "/cromblog/ai-april": "red-eyed-vireo-01",
    "/cromblog/make-believe-may": "scissor-tailed-flycatcher-01"
  } satisfies Record<string, VibeDoodleId>,
  prefixes: [
    { prefix: "/cromblog/simulating-civilizations-", id: "red-eyed-vireo-01" },
    { prefix: "/cromblog/archivist-", id: "raven-01" }
  ] satisfies readonly { prefix: string; id: VibeDoodleId }[],
  fallback: "owl-on-branch-01" as VibeDoodleId
} as const;

export function doodleVibeForPath(pathname: string): VibeDoodleId {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const exact = (doodleVibeRoutes.exact as Partial<Record<string, VibeDoodleId>>)[path];
  if (exact) return exact;
  const matched = [...doodleVibeRoutes.prefixes]
    .sort((left, right) => right.prefix.length - left.prefix.length)
    .find(({ prefix }) => path.startsWith(prefix));
  return matched?.id ?? doodleVibeRoutes.fallback;
}

export const doodleVibeMeadow = [
  { id: "fn22-p051-a", role: "texture", mobile: true },
  { id: "um22-p013-a", role: "texture", mobile: false },
  { id: "um22-p009-a", role: "texture", mobile: true },
  { id: "carolina-wren-01", role: "character", mobile: true },
  { id: "fn22-p026-a", role: "texture", mobile: true },
  { id: "um22-p061-a", role: "texture", mobile: false }
] as const satisfies readonly { id: VibeDoodleId; role: "texture" | "character"; mobile: boolean }[];

// Retained tree study; the preferred footer now uses the leaf compositions below.
export const doodleVibePreferredMeadow = [
  { id: "jm26-p085-a", role: "texture", mobile: true },
  { id: "fn22-p034-a", role: "texture", mobile: false },
  { id: "jj2526-p108-a", role: "texture", mobile: false },
  { id: "jj2526-p224-a", role: "texture", mobile: true },
  { id: "fn22-p097-a", role: "texture", mobile: true }
] as const satisfies readonly { id: VibeDoodleId; role: "texture" | "character"; mobile: boolean }[];

// Centers and widths are percentages of each composition; only placement and
// rotation change. Every mark comes from an intact original drawing.
export const doodleVibeLeafClusters = [
  {
    id: "oak-and-sprig", primary: false,
    leaves: [
      { id: "jm26-p133-a", x: 34, y: 50, width: 44, rotate: -74 },
      { id: "jj25-p083-a", x: 74, y: 29, width: 16, rotate: -25 },
      { id: "jj25-p019-a", x: 74, y: 58, width: 33, rotate: 18 }
    ]
  },
  {
    id: "maple-and-almond", primary: true,
    leaves: [
      { id: "jm26-p036-a", x: 35, y: 49, width: 49, rotate: -24 },
      { id: "jm26-p067-a", x: 18, y: 78, width: 18, rotate: 100 },
      { id: "jm26-p030-a", x: 69, y: 61, width: 38, rotate: 14 }
    ]
  },
  {
    id: "veins-and-lobes", primary: false,
    leaves: [
      { id: "jm26-p133-a", x: 62, y: 52, width: 44, rotate: 67 },
      { id: "jj25-p083-a", x: 49, y: 26, width: 15, rotate: 10 },
      { id: "jj25-p019-a", x: 25, y: 55, width: 31, rotate: -22 }
    ]
  }
] as const satisfies readonly {
  id: string;
  primary: boolean;
  leaves: readonly { id: VibeDoodleId; x: number; y: number; width: number; rotate: number }[];
}[];

export const doodleVibeHero = {
  strict: "owl-on-branch-01",
  framed: "common-flicker-tree-01",
  preferred: ["common-flicker-tree-01", "carolina-wren-01"]
} as const satisfies { strict: VibeDoodleId; framed: VibeDoodleId; preferred: readonly VibeDoodleId[] };

export const doodleVibeOrnaments = {
  knot: "um22-p083-e",
  wave: "um22-p107-b",
  sprig: "um22-p013-a"
} as const satisfies Record<string, VibeDoodleId>;

export const doodleVibePreferredOrnaments = {
  sprig: "jm26-p030-a"
} as const satisfies Record<string, VibeDoodleId>;

export const doodleVibeMarks = {
  about: "red-eyed-vireo-01",
  projects: "common-flicker-tree-01",
  games: "carolina-wren-01",
  art: "owl-on-branch-01",
  notFound: "raven-01"
} as const satisfies Record<string, VibeDoodleId>;

const referencedIds: readonly VibeDoodleId[] = [
  ...Object.values(doodleVibeRoutes.exact),
  ...doodleVibeRoutes.prefixes.map(({ id }) => id),
  doodleVibeRoutes.fallback,
  ...doodleVibeMeadow.map(({ id }) => id),
  ...doodleVibePreferredMeadow.map(({ id }) => id),
  ...doodleVibeLeafClusters.flatMap(({ leaves }) => leaves.map(({ id }) => id)),
  doodleVibeHero.strict,
  doodleVibeHero.framed,
  ...doodleVibeHero.preferred,
  ...Object.values(doodleVibeOrnaments),
  ...Object.values(doodleVibePreferredOrnaments),
  ...Object.values(doodleVibeMarks)
];

for (const id of referencedIds) {
  if (!vibeDoodles[id]) throw new Error(`Missing Doodle vibe asset: ${id}`);
}
