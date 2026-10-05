import type { DoodleExperiment } from "@/content/doodle-experiments";

export const experimentCollections = ["all", "scenic", "comics", "character-studies", "gifs"] as const;
export type ExperimentCollection = typeof experimentCollections[number];

export const experimentCollectionLabels: Record<ExperimentCollection, string> = {
  all: "All experiments",
  scenic: "Scenic",
  comics: "Comics",
  "character-studies": "Character studies",
  gifs: "GIFs"
};

/** Collections that were merged into one: every animation now lives under GIFs. */
const mergedCollections: Readonly<Record<string, ExperimentCollection>> = { "future-studies": "gifs", "meme-gifs": "gifs" };

export function groupDoodleExperiments(entries: readonly DoodleExperiment[]) {
  const twoCharacterScenes = entries.filter((entry) =>
    entry.kind === "Scene" && (entry.round === "17" || entry.round === "19")
  );
  // Every animation in one place: the future studies, the meme GIFs and the earlier animated scenes.
  const gifs = entries.filter((entry) => entry.kind === "Animation");
  const comics = entries.filter((entry) => entry.kind === "Comic");
  const scenic = entries.filter((entry) =>
    entry.kind === "Scene" && entry.round !== "17" && entry.round !== "19"
  );

  return {
    twoCharacterScenes,
    gifs,
    comics,
    scenic,
    characterStudies: twoCharacterScenes
  };
}

export function collectionFromSearch(search: string, fallback: ExperimentCollection): ExperimentCollection {
  const raw = new URLSearchParams(search).get("collection") ?? "";
  const value = mergedCollections[raw] ?? raw;
  return experimentCollections.find((collection) => collection === value) ?? fallback;
}

export function experimentCollectionUrl(href: string, collection: ExperimentCollection): string {
  const url = new URL(href);
  url.searchParams.set("collection", collection);
  url.hash = "ai-experiments";
  return `${url.pathname}${url.search}${url.hash}`;
}

export function collectionForKey(collection: ExperimentCollection, key: string): ExperimentCollection | undefined {
  const index = experimentCollections.indexOf(collection);
  if (key === "ArrowRight") return experimentCollections[(index + 1) % experimentCollections.length];
  if (key === "ArrowLeft") return experimentCollections[(index - 1 + experimentCollections.length) % experimentCollections.length];
  if (key === "Home") return experimentCollections[0];
  if (key === "End") return experimentCollections[experimentCollections.length - 1];
  return undefined;
}
