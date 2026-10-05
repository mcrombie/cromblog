import curation from "@/content/doodle-curation.json";

export const doodleSubjects = [
  { id: "characters", label: "Characters & people" },
  { id: "creatures", label: "Creatures & animals" },
  { id: "birds", label: "Birds" },
  { id: "plants", label: "Trees & plants" },
  { id: "places", label: "Landscapes, scenes & places" },
  { id: "sky", label: "Sky & weather" },
  { id: "objects", label: "Objects" },
  { id: "marks", label: "Symbols, patterns & marks" },
  { id: "abstract", label: "Abstract" }
] as const;

export type DoodleSubjectId = typeof doodleSubjects[number]["id"];
export type DoodleSubjectGroups = Readonly<Record<string, DoodleSubjectId>>;

// Keep the notebook catalog's original categories intact. Mixed historical
// categories use the broader display group; their original words remain searchable.
export const doodleCategorySubjects = {
  "Abstract": "abstract",
  "Abstract & objects": "abstract",
  "Animals": "creatures",
  "Architecture": "places",
  "Birds": "birds",
  "Birds & animals": "creatures",
  "Botanical": "plants",
  "Botanicals": "plants",
  "Celestial": "sky",
  "Characters": "characters",
  "Creatures": "creatures",
  "Curious creatures": "creatures",
  "Groups": "characters",
  "Landforms": "places",
  "Landscapes": "places",
  "Leaves & branches": "plants",
  "Marks": "marks",
  "Nature": "plants",
  "Objects": "objects",
  "Objects & structures": "objects",
  "Ornaments": "marks",
  "Patterns": "marks",
  "People & faces": "characters",
  "Places": "places",
  "Plants": "plants",
  "Plants & trees": "plants",
  "Scenes": "places",
  "Scenes & objects": "places",
  "Scenes & structures": "places",
  "Sky": "sky",
  "Sky & symbols": "sky",
  "Symbols": "marks",
  "Symbols & shapes": "marks",
  "Textures": "marks",
  "Trees & plants": "plants",
  "Weather": "sky"
} as const satisfies Record<string, DoodleSubjectId>;

export function buildDoodleSubjectGroups(entries: readonly { category: string }[]): DoodleSubjectGroups {
  const categories = doodleCategorySubjects as Readonly<Partial<Record<string, DoodleSubjectId>>>;
  return Object.fromEntries(Array.from(new Set(entries.map((entry) => entry.category))).map((category) => {
    const subject = categories[category];
    if (!Object.prototype.hasOwnProperty.call(categories, category) || !subject) {
      throw new Error(`Doodle category "${category}" needs a display subject.`);
    }
    return [category, subject];
  }));
}

/** Categories whose drawings can be birds: the creature and character ones, not plants, places or objects. */
const birdCategories = new Set(["Birds", "Birds & animals", "Animals", "Creatures", "Curious creatures", "Characters", "Groups", "People & faces"]);
const birdWords = /\b(birds?|owls?|owlets?|wrens?|vireos?|flycatchers?|ravens?|crows?|sparrows?|finch(?:es)?|cardinals?|warblers?|hawks?|eagles?|herons?|ducks?|robins?|jays?|woodpeckers?|pewees?|chicks?|parrots?|penguins?|pelicans?|storks?|cranes?|swans?|geese|goose|hens?|roosters?|turkeys?|songbirds?|kingfishers?|hummingbirds?|bluebirds?)\b/i;

/**
 * Which theme a drawing belongs to. Mostly its category's, but the batches file birds under several categories
 * (Birds, Birds & animals, Creatures, Animals, Characters), so a drawing whose main subject is a bird - judged
 * from the part of its title before "with", "holding" and the like, or from a "bird" tag in a bird category - is
 * a Bird. A tree with a tiny bird in it stays a tree.
 */
export function doodleSubjectFor(
  entry: { id: string; category: string; title: string; tags: readonly string[] },
  groups: DoodleSubjectGroups
): DoodleSubjectId {
  const reviewed = (curation.themes as Record<string, DoodleSubjectId | undefined>)[entry.id];
  if (reviewed) return reviewed;
  if (birdCategories.has(entry.category)) {
    const head = entry.title.split(/\s+(?:with|holding|on|beneath|under|above|beside|behind|among|inside|carrying|riding)\s+/i)[0];
    const tagged = (entry.category === "Birds" || entry.category === "Birds & animals") && entry.tags.some((tag) => /^birds?$/i.test(tag));
    if (birdWords.test(head) || tagged) return "birds";
  }
  return groups[entry.category];
}
