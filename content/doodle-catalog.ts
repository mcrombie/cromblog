import { artGalleries } from "@/content/art";
import { doodleAssets, doodleOrder, type DoodleAsset } from "@/content/doodles";
import januaryToMay from "@/content/doodle-batches/2026-01-may.json";
import juneToJanuary from "@/content/doodle-batches/2025-06-2026-01.json";

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
};

export type DoodleBatch = { id: string; title: string; description?: string };

export const doodleBatches: readonly DoodleBatch[] = [
  { id: "2025-06-2026-01", title: "June 2025–January 2026" },
  { id: "2026-01-may", title: "January–May 2026" },
  { id: "2026-06-aug", title: "June–August 2026" },
  { id: "crombot", title: "Crombot studies" }
];

const originalDescriptions = new Map<string, string>(
  artGalleries.flatMap((gallery) => gallery.works.map((work) => [work.assetId, work.alt] as const))
);

const existingDrawings: DoodleCatalogEntry[] = doodleOrder.map((id) => {
  const asset: DoodleAsset = doodleAssets[id];
  const title = asset.displayName ?? id.replace(/-\d+$/, "").split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
  return {
    id, title, src: asset.src,
    alt: originalDescriptions.get(id) ?? `Notebook drawing of ${title.toLowerCase()}.`,
    batchId: id === "crombot-1-01" ? "crombot" : "2026-06-aug",
    status: id === "leaf-vine-01" ? "texture" : "curated",
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
  ...juneToJanuary, ...januaryToMay
] as DoodleCatalogEntry[]).map((entry) => {
  if (!["curated", "texture", "archive"].includes(entry.status)) {
    throw new Error(`Invalid catalog status for ${entry.id}`);
  }
  return {
    id: entry.id, title: entry.title, src: entry.src, alt: entry.alt,
    batchId: entry.batchId, status: entry.status as DoodleCatalogEntry["status"],
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
