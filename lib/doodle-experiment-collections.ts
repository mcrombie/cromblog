import type { DoodleExperiment } from "@/content/doodle-experiments";

export const experimentCollections = ["all", "scenic", "character-studies", "future-studies", "meme-gifs"] as const;
export type ExperimentCollection = typeof experimentCollections[number];

export const experimentCollectionLabels: Record<ExperimentCollection, string> = {
  all: "All experiments",
  scenic: "Scenic",
  "character-studies": "Character studies",
  "future-studies": "Future GIF",
  "meme-gifs": "Meme GIFs"
};

export function groupDoodleExperiments(entries: readonly DoodleExperiment[]) {
  const twoCharacterScenes = entries.filter((entry) =>
    entry.kind === "Scene" && (entry.round === "17" || entry.round === "19")
  );
  const futureStudies = entries.filter((entry) => entry.round === "18");
  const memeGifs = entries.filter((entry) => entry.round === "20" && entry.kind === "Animation");
  const scenic = entries.filter((entry) =>
    entry.kind === "Scene" && entry.round !== "17" && entry.round !== "19"
  );

  return {
    twoCharacterScenes,
    futureStudies,
    memeGifs,
    scenic,
    characterStudies: twoCharacterScenes
  };
}

export function collectionFromSearch(search: string, fallback: ExperimentCollection): ExperimentCollection {
  const value = new URLSearchParams(search).get("collection");
  return experimentCollections.find((collection) => collection === value) ?? fallback;
}

export function experimentCollectionUrl(href: string, collection: ExperimentCollection): string {
  const url = new URL(href);
  url.searchParams.set("collection", collection);
  url.hash = "experiments";
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
