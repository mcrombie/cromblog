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
