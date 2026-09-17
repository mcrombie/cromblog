import generated from "@/content/doodle-vibe-assets.generated.json";

export type VibeDoodleId = keyof typeof generated;
export type VibeDoodle = Omit<(typeof generated)[VibeDoodleId], "id" | "role"> & {
  id: VibeDoodleId;
  role: "hero" | "specimen" | "mark" | "meadow" | "ornament";
};

// This small registry is safe to import from client components. Never import the
// full catalog or experiment collection here; the build script resolves those.
export const vibeDoodles = generated as Record<VibeDoodleId, VibeDoodle>;

/* Sidebar specimens. A route's specimen never repeats its heading mark, its
 * article rail or the hero drawing, so no drawing appears twice on one screen. */
export const doodleVibeRoutes = {
  exact: {
    "/": "red-eyed-vireo-01",
    "/about": "carolina-wren-01",
    "/cromblog": "raven-01",
    "/projects": "owl-on-branch-01",
    "/games": "scissor-tailed-flycatcher-01",
    "/art": "owl-on-branch-01",
    "/cromblog/crombot-one": "common-flicker-tree-01",
    "/cromblog/clio": "owl-on-branch-01",
    "/cromblog/cromonsters": "carolina-wren-01",
    "/cromblog/doodle-lab": "scissor-tailed-flycatcher-01",
    "/cromblog/revisiting-roots-of-civilization": "red-eyed-vireo-01",
    "/cromblog/cradle-of-the-empire": "raven-01",
    "/cromblog/an-auspicious-august": "carolina-wren-01",
    "/cromblog/archivist-iii-lowering-latency": "carolina-wren-01",
    "/cromblog/evaluator-also-has-to-be-evaluated": "owl-on-branch-01",
    "/cromblog/primeproofing-beyond-vibe-coding": "scissor-tailed-flycatcher-01",
    "/cromblog/building-an-llm-from-scratch": "common-flicker-tree-01",
    "/cromblog/interactive-phoneme-chart": "carolina-wren-01",
    "/cromblog/ai-april": "red-eyed-vireo-01",
    "/cromblog/make-believe-may": "red-eyed-vireo-01"
  } satisfies Record<string, VibeDoodleId>,
  prefixes: [
    { prefix: "/cromblog/simulating-civilizations-", id: "red-eyed-vireo-01" },
    { prefix: "/cromblog/archivist-", id: "raven-01" }
  ] satisfies readonly { prefix: string; id: VibeDoodleId }[],
  fallback: "owl-on-branch-01" as VibeDoodleId
} as const;

function normalisePath(pathname: string) {
  return pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
}

export function doodleVibeForPath(pathname: string): VibeDoodleId {
  const path = normalisePath(pathname);
  const exact = (doodleVibeRoutes.exact as Partial<Record<string, VibeDoodleId>>)[path];
  if (exact) return exact;
  const matched = [...doodleVibeRoutes.prefixes]
    .sort((left, right) => right.prefix.length - left.prefix.length)
    .find(({ prefix }) => path.startsWith(prefix));
  return matched?.id ?? doodleVibeRoutes.fallback;
}

/* Page-foot compositions. Centres and widths are percentages of a 1.55:1 box;
 * only placement and rotation change, and every mark is an intact original drawing. */
export type DoodleCompositionItem = { id: VibeDoodleId; x: number; y: number; width: number; rotate: number };

export const doodleVibeCompositions = {
  "leaves-a": {
    title: "Oak and sprig",
    items: [
      { id: "jm26-p133-a", x: 34, y: 50, width: 44, rotate: -74 },
      { id: "jj25-p083-a", x: 74, y: 29, width: 16, rotate: -25 },
      { id: "jj25-p019-a", x: 74, y: 58, width: 33, rotate: 18 }
    ]
  },
  "leaves-b": {
    title: "Maple and almond",
    items: [
      { id: "jm26-p036-a", x: 35, y: 49, width: 49, rotate: -24 },
      { id: "jm26-p067-a", x: 18, y: 78, width: 18, rotate: 100 },
      { id: "jm26-p030-a", x: 69, y: 61, width: 38, rotate: 14 }
    ]
  },
  "leaves-c": {
    title: "Veins and lobes",
    items: [
      { id: "jm26-p133-a", x: 62, y: 52, width: 44, rotate: 67 },
      { id: "jj25-p083-a", x: 49, y: 26, width: 15, rotate: 10 },
      { id: "jj25-p019-a", x: 25, y: 55, width: 31, rotate: -22 }
    ]
  },
  "grove-a": {
    title: "Layered grove",
    items: [
      { id: "jj2526-p108-a", x: 24, y: 49, width: 34, rotate: -2 },
      { id: "fn22-p097-a", x: 55, y: 56, width: 30, rotate: 1.5 },
      { id: "jm26-p085-a", x: 82, y: 63, width: 26, rotate: 0 }
    ]
  },
  "grove-b": {
    title: "Bent tree and canopy",
    items: [
      { id: "fn22-p034-a", x: 22, y: 52, width: 36, rotate: 0 },
      { id: "jj2526-p224-a", x: 58, y: 61, width: 34, rotate: -1.5 },
      { id: "jm26-p085-a", x: 86, y: 68, width: 22, rotate: 1 }
    ]
  }
} as const satisfies Record<string, { title: string; items: readonly DoodleCompositionItem[] }>;

export type DoodleCompositionId = keyof typeof doodleVibeCompositions;

/* Which compositions stand at the foot of each route: three on wide screens,
 * two on tablets, the first alone on phones. */
export const doodleVibeFeet = {
  exact: {
    "/": ["leaves-b", "grove-a", "leaves-a"],
    "/about": ["grove-b", "leaves-c", "leaves-b"],
    "/cromblog": ["leaves-a", "grove-a", "leaves-c"],
    "/projects": ["grove-b", "leaves-b", "leaves-a"],
    "/games": ["leaves-c", "grove-a", "leaves-b"]
  } satisfies Record<string, readonly DoodleCompositionId[]>,
  prefixes: [
    { prefix: "/cromblog/", ids: ["leaves-a", "grove-b", "leaves-c"] }
  ] satisfies readonly { prefix: string; ids: readonly DoodleCompositionId[] }[],
  fallback: ["leaves-b", "grove-b", "leaves-a"] as readonly DoodleCompositionId[]
} as const;

export function doodleVibeFootForPath(pathname: string): readonly DoodleCompositionId[] {
  const path = normalisePath(pathname);
  const exact = (doodleVibeFeet.exact as Partial<Record<string, readonly DoodleCompositionId[]>>)[path];
  if (exact) return exact;
  const matched = doodleVibeFeet.prefixes.find(({ prefix }) => path.startsWith(prefix));
  return matched?.ids ?? doodleVibeFeet.fallback;
}

export const doodleVibeHero = {
  figure: "common-flicker-tree-01"
} as const satisfies { figure: VibeDoodleId };

export const doodleVibeOrnaments = {
  knot: "um22-p083-e",
  wave: "um22-p107-b",
  sprig: "um22-p013-a"
} as const satisfies Record<string, VibeDoodleId>;

export const doodleVibeMarks = {
  about: "red-eyed-vireo-01",
  projects: "sm2324-p152-a",
  games: "carolina-wren-01",
  art: "owl-on-branch-01",
  notFound: "raven-01"
} as const satisfies Record<string, VibeDoodleId>;

const referencedIds: readonly VibeDoodleId[] = [
  ...Object.values(doodleVibeRoutes.exact),
  ...doodleVibeRoutes.prefixes.map(({ id }) => id),
  doodleVibeRoutes.fallback,
  ...Object.values(doodleVibeCompositions).flatMap(({ items }) => items.map(({ id }) => id)),
  doodleVibeHero.figure,
  ...Object.values(doodleVibeOrnaments),
  ...Object.values(doodleVibeMarks)
];

for (const id of referencedIds) {
  if (!vibeDoodles[id]) throw new Error(`Missing Doodle vibe asset: ${id}`);
}

const referencedCompositions: readonly DoodleCompositionId[] = [
  ...Object.values(doodleVibeFeet.exact).flat(),
  ...doodleVibeFeet.prefixes.flatMap(({ ids }) => ids),
  ...doodleVibeFeet.fallback
];

for (const id of referencedCompositions) {
  if (!doodleVibeCompositions[id]) throw new Error(`Missing Doodle vibe composition: ${id}`);
}
