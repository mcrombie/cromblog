import { artGalleries } from "@/content/art";
import curation from "@/content/doodle-curation.json";
import { doodleAssets, doodleOrder, type DoodleAsset } from "@/content/doodles";
import januaryToMay from "@/content/doodle-batches/2026-01-may.json";
import juneToJanuary from "@/content/doodle-batches/2025-06-2026-01.json";
import januaryToJune from "@/content/doodle-batches/2025-01-06.json";
import augustToJanuary from "@/content/doodle-batches/2024-08-2025-01.json";
import marchToAugust from "@/content/doodle-batches/2024-03-08.json";
import septemberToMarch from "@/content/doodle-batches/2023-09-2024-03.json";
import aprilToAugust from "@/content/doodle-batches/2023-04-08.json";
import novemberToApril from "@/content/doodle-batches/2022-11-2023-04.json";
import februaryToNovember from "@/content/doodle-batches/2022-02-11.json";
import upToMarchAndMisc from "@/content/doodle-batches/2022-up-to-03-misc.json";

export type DoodleCatalogEntry = {
  id: string;
  title: string;
  src: string;
  alt: string;
  batchId: string;
  status: "curated" | "texture" | "archive";
  category: string;
  tags: readonly string[];
  image: { width: number; height: number };
  /** Place in its theme's reviewed best-of (lower is better); only Selected drawings have one. */
  rank?: number;
};

export type DoodleBatch = { id: string; title: string; description?: string };

export const doodleBatches: readonly DoodleBatch[] = [
  { id: "2022-up-to-03-misc", title: "Up to March 2022 + misc." },
  { id: "2022-02-11", title: "February–November 2022" },
  { id: "2022-11-2023-04", title: "November 2022–April 2023" },
  { id: "2023-04-08", title: "April–August 2023" },
  { id: "2023-09-2024-03", title: "September 2023–March 2024" },
  { id: "2024-03-08", title: "March–August 2024" },
  { id: "2024-08-2025-01", title: "August 2024–January 2025" },
  { id: "2025-01-06", title: "January–June 2025" },
  { id: "2025-06-2026-01", title: "June 2025–January 2026" },
  { id: "2026-01-may", title: "January–May 2026" },
  { id: "2026-06-aug", title: "June–August 2026" },
  { id: "crombot", title: "Crombot studies" }
];

const originalDescriptions = new Map<string, string>(
  artGalleries.flatMap((gallery) => gallery.works.map((work) => [work.assetId, work.alt] as const))
);

/**
 * The reviewed curation (content/doodle-curation.json): each theme's best-of, in order, is "Selected"; every other
 * drawing is an Archive drawing or a Texture. Until a review has been recorded, the batches' own statuses stand.
 */
const curatedThemes = curation.selected as Record<string, readonly string[]>;
const statusFixes = curation.status as Record<string, "texture" | "drawing" | undefined>;
const reviewed = Object.values(curatedThemes).some((ids) => ids.length > 0);
const selectedRanks = new Map<string, number>();
Object.values(curatedThemes).forEach((ids, themeIndex) => ids.forEach((id, place) => selectedRanks.set(id, place * 16 + themeIndex)));
function curatedStatus(id: string, status: DoodleCatalogEntry["status"]): DoodleCatalogEntry["status"] {
  const fixed = statusFixes[id];
  if (!reviewed) return fixed === "texture" ? "texture" : fixed === "drawing" && status === "texture" ? "archive" : status;
  if (selectedRanks.has(id)) return "curated";
  return (fixed ?? (status === "texture" ? "texture" : "drawing")) === "texture" ? "texture" : "archive";
}

const existingDrawings: DoodleCatalogEntry[] = doodleOrder.map((id) => {
  const asset: DoodleAsset = doodleAssets[id];
  const title = asset.displayName ?? id.replace(/-\d+$/, "").split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
  return {
    id, title, src: asset.src,
    alt: originalDescriptions.get(id) ?? `Notebook drawing of ${title.toLowerCase()}.`,
    batchId: id === "crombot-1-01" ? "crombot" : "2026-06-aug",
    status: curatedStatus(id, id === "leaf-vine-01" ? "texture" : "curated"),
    rank: selectedRanks.get(id),
    category: asset.kind === "character" ? "Characters"
      : asset.tags.includes("bird") ? "Birds & animals"
      : asset.tags.includes("botanical") ? "Botanicals" : "Abstract & objects",
    tags: asset.tags,
    image: asset.image
  };
});

// Only publish the clean gallery projection. Source photos, masks and review
// notes belong in art-source, outside the public bundle and browser props.
const importedDrawings: DoodleCatalogEntry[] = ([
  ...upToMarchAndMisc, ...februaryToNovember, ...novemberToApril, ...aprilToAugust, ...septemberToMarch, ...marchToAugust, ...augustToJanuary, ...januaryToJune, ...juneToJanuary, ...januaryToMay
] as DoodleCatalogEntry[]).map((entry) => {
  if (!["curated", "texture", "archive"].includes(entry.status)) {
    throw new Error(`Invalid catalog status for ${entry.id}`);
  }
  return {
    id: entry.id, title: entry.title, src: entry.src, alt: entry.alt,
    batchId: entry.batchId, status: curatedStatus(entry.id, entry.status as DoodleCatalogEntry["status"]),
    rank: selectedRanks.get(entry.id),
    category: entry.category, tags: entry.tags, image: entry.image
  };
});

export const doodleCatalog: readonly DoodleCatalogEntry[] = [
  ...importedDrawings, ...existingDrawings
];

if (new Set(doodleCatalog.map((entry) => entry.id)).size !== doodleCatalog.length) {
  throw new Error("Doodle Lab asset IDs must be unique across all collections.");
}

export const doodleCatalogById = Object.fromEntries(
  doodleCatalog.map((entry) => [entry.id, entry])
) as Record<string, DoodleCatalogEntry | undefined>;
