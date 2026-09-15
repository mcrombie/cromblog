export const GARDEN_EPOCH = Date.UTC(2026, 8, 1, 12);
export const GARDEN_DAY = 86_400_000;
export const GARDEN_YEAR = 365.2425;

export type GardenSeason = "winter" | "spring" | "summer" | "autumn";
export type GardenPlace = "oak" | "pines" | "water" | "orchard" | "strawberries" | "canopy";

export const gardenPlaces: {
  id: GardenPlace; number: string; name: string; subtitle: string;
  x: number; y: number; zoom: number; note: string; inhabitants: string;
}[] = [
  { id: "oak", number: "01", name: "The returning oak", subtitle: "On the dry ridge", x: 13, y: 43, zoom: 2.2,
    note: "Give the chestnut oak a little room. A crooked trunk, a broad crown, a floor of last year's leaves. Here it gets to be the old presence around which a younger garden slowly gathers.",
    inhabitants: "Chestnut oak · eastern redcedar · leaf litter" },
  { id: "pines", number: "02", name: "Two kinds of pine", subtitle: "Along the old field", x: 68, y: 24, zoom: 2.5,
    note: "Virginia pine brings the scruffy, familiar silhouette; loblolly rises behind it. The boundary between a planted place and a wild place is allowed to get pleasantly untidy.",
    inhabitants: "Virginia pine · loblolly pine · eastern redcedar" },
  { id: "water", number: "03", name: "The wet-footed corner", subtitle: "Beside the water", x: 86, y: 57, zoom: 2.3,
    note: "Bald cypress keeps company with dawn redwood, the metasequoia: a planted guest with a family-garden connection. Two feathery trees, a damp hollow, and room for the years to accumulate.",
    inhabitants: "Bald cypress · dawn redwood · ferns" },
  { id: "orchard", number: "04", name: "An imperfect orchard", subtitle: "In the understory", x: 51, y: 47, zoom: 2.6,
    note: "Pawpaws in the softer shade; an apple tree at the sunny edge. A few things planted on purpose, a few volunteers, and a path that never quite keeps its original shape.",
    inhabitants: "Pawpaw · apple · violets · clover" },
  { id: "strawberries", number: "05", name: "The strawberry republic", subtitle: "A dispute at ground level", x: 14, y: 83, zoom: 3.4,
    note: "One squirrel insists these are communal acorns. The other has already established a treasury. Below the argument: strawberry runners, a snail, and a rather serviceable acorn-cap teacup.",
    inhabitants: "Strawberries · squirrels · mushrooms · small grievances" },
  { id: "canopy", number: "06", name: "A world above ours", subtitle: "Up in the branches", x: 15, y: 12, zoom: 3.2,
    note: "The birds have their own paths, meeting places, and boundary disputes. Stand still long enough and the upper branches stop looking empty. There was a whole neighborhood here before we looked up.",
    inhabitants: "Birds · branches · an entirely separate conversation" }
];

export const gardenTrees = [
  { name: "Chestnut oak", botanical: "Quercus montana", cell: 0, x: 39, y: 66, size: 20, years: 22, evergreen: false, place: "oak" },
  { name: "Eastern redcedar", botanical: "Juniperus virginiana", cell: 1, x: 44, y: 55, size: 13, years: 15, evergreen: true, place: "pines" },
  { name: "Virginia pine", botanical: "Pinus virginiana", cell: 2, x: 59, y: 52, size: 15, years: 13, evergreen: true, place: "pines" },
  { name: "Loblolly pine", botanical: "Pinus taeda", cell: 3, x: 64, y: 49, size: 17, years: 12, evergreen: true, place: "pines" },
  { name: "Bald cypress", botanical: "Taxodium distichum", cell: 4, x: 76, y: 67, size: 22, years: 19, evergreen: false, place: "water" },
  { name: "Dawn redwood", botanical: "Metasequoia glyptostroboides", cell: 5, x: 85, y: 59, size: 24, years: 14, evergreen: false, place: "water" },
  { name: "Pawpaw", botanical: "Asimina triloba", cell: 6, x: 51, y: 72, size: 17, years: 10, evergreen: false, place: "orchard" },
  { name: "Apple", botanical: "Malus domestica", cell: 7, x: 61, y: 69, size: 19, years: 11, evergreen: false, place: "orchard" }
] as const;

/** A shared, deterministic clock. Reloading or changing devices cannot replant the garden. */
export function gardenAge(timestamp: number) {
  return Math.max(0, (timestamp - GARDEN_EPOCH) / GARDEN_DAY);
}

/** Deliberately illustrative growth: slow, continuous, and bounded, not a forestry model. */
export function treeGrowth(timestamp: number, yearsToMaturity: number) {
  return 0.24 + 0.76 * (1 - Math.exp(-3 * gardenAge(timestamp) / (Math.max(1, yearsToMaturity) * GARDEN_YEAR)));
}

export function gardenCalendar(timestamp: number) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "numeric", hour: "numeric", hourCycle: "h23" }).formatToParts(timestamp);
  const month = Number(parts.find((part) => part.type === "month")?.value ?? 9);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 12);
  const season: GardenSeason = month <= 2 || month === 12 ? "winter" : month <= 5 ? "spring" : month <= 8 ? "summer" : "autumn";
  const light = hour < 6 || hour >= 20 ? "night" : hour < 9 ? "morning" : hour >= 17 ? "evening" : "day";
  const notes = {
    winter: "The ink rests. Evergreen silhouettes keep their place.",
    spring: "New green gathers at the edges of the page.",
    summer: "The understory thickens. Every patch has company.",
    autumn: "Green lingers; copper begins to enter the margins."
  };
  return { season, light, note: notes[season] };
}

export function gardenDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "long", day: "numeric", year: "numeric" }).format(timestamp);
}

export function clampGardenView(view: { zoom: number; x: number; y: number }) {
  const zoom = Math.min(5, Math.max(1, view.zoom));
  const edge = 50 / zoom;
  return { zoom, x: Math.min(100 - edge, Math.max(edge, view.x)), y: Math.min(100 - edge, Math.max(edge, view.y)) };
}
