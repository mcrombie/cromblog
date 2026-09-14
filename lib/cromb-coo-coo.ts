/** A quiet journey: one island, one hello, one clear way onward. */
export type IslandIndex = 0 | 1 | 2 | 3 | 4;
export type Target = "resident" | "path" | "detail" | "back";
type IslandFlags = [boolean, boolean, boolean, boolean, boolean];
export type GameState = { version: 2; sceneIndex: IslandIndex; greeted: IslandFlags; inspected: IslandFlags; complete: boolean };
export type Dialogue = { speaker: string; lines: string[]; choices: { id: string; label: string }[] };
export type SceneTarget = { id: Target; label: string; action: string; x: number; y: number; kind: "talk" | "look" | "move" };
export type IslandScene = { id: string; name: string; subtitle: string; resident: string; detail: string; art: string; artAlt: string; arrival: string; departure: string };
export const islandScenes: readonly IslandScene[] = [
  { id: "frog-landing", name: "Frog's Landing", subtitle: "A hello, then a first step.", resident: "Frog", detail: "The little pond", art: "/cromblog/doodle-experiments/round-21/at-the-center-of-cromb-coo-coo.png", artAlt: "The original floating-island drawing, with the wide-eyed frog waiting beside the path.", arrival: "You walk up to a frog beside the path.", departure: "The frog waves you toward the next island." },
  { id: "woodgrain-terrace", name: "Woodgrain Terrace", subtitle: "Another island. Another acquaintance.", resident: "Woodgrain Bird", detail: "The listening roots", art: "/games/cromb-coo-coo/bridge-open.png", artAlt: "The Woodgrain Bird and its rooted terrace in the original illustrated world.", arrival: "An old wooden face watches you arrive.", departure: "The roots carry your footsteps toward a garden of glass." },
  { id: "glasshouse-garden", name: "Glasshouse Garden", subtitle: "A little weather under glass.", resident: "Garden Snail", detail: "The rain garden", art: "/games/cromb-coo-coo/islands/03-glasshouse-garden.png", artAlt: "A floating fern garden and brass-ribbed glasshouse, with a spiral-shelled snail beside the Visitor.", arrival: "Rain ticks softly against the glasshouse roof.", departure: "You leave the snail to its unhurried rounds." },
  { id: "tidal-observatory", name: "Tidal Observatory", subtitle: "The sky has a shoreline, apparently.", resident: "Shorebird", detail: "The brass telescope", art: "/games/cromb-coo-coo/islands/04-tidal-observatory.png", artAlt: "A floating limestone observatory with a brass telescope, turquoise pool and curious shorebird.", arrival: "A shorebird is watching the clouds through a telescope.", departure: "A warm light waits beyond the blue distance." },
  { id: "lantern-archive", name: "Lantern Archive", subtitle: "Somewhere to sit for a while.", resident: "Archive Owl", detail: "The open book", art: "/games/cromb-coo-coo/islands/05-lantern-archive.png", artAlt: "A lantern-lit library inside an oak on a floating island, with a wooden owl at a reading desk.", arrival: "An owl has left a lantern on for you.", departure: "For now, this is a good place to rest." }
];
export const initialState: GameState = { version: 2, sceneIndex: 0, greeted: [false, false, false, false, false], inspected: [false, false, false, false, false], complete: false };
export function getScene(state: GameState): IslandScene { return islandScenes[state.sceneIndex]; }
export function isComplete(state: GameState): boolean { return state.complete; }
export function canMoveForward(state: GameState): boolean { return state.sceneIndex < 4 && state.greeted[state.sceneIndex]; }
export function getTargets(state: GameState): SceneTarget[] {
  const scene = getScene(state);
  const targets: SceneTarget[] = [
    { id: "resident", label: scene.resident, action: `Talk to the ${scene.resident}`, x: 64, y: 54, kind: "talk" },
    { id: "path", label: state.sceneIndex === 4 ? "Rest here" : "Next island", action: state.sceneIndex === 4 ? "Rest at the archive" : "Go to the next island", x: 87, y: 71, kind: "move" }
  ];
  if (state.sceneIndex > 0) targets.push(
    { id: "detail", label: scene.detail, action: `Look at ${scene.detail.toLowerCase()}`, x: 44, y: 53, kind: "look" },
    { id: "back", label: "Previous island", action: "Go back to the previous island", x: 13, y: 73, kind: "move" }
  );
  return targets;
}
export function getObjective(state: GameState): string {
  if (!state.greeted[state.sceneIndex]) return `Say hello to the ${getScene(state).resident}.`;
  if (state.sceneIndex < 4) return "You're ready. Go to the next island.";
  return state.complete ? "Five islands. A few new acquaintances." : "Take a seat beneath the lanterns.";
}
export function getHint(state: GameState): string {
  if (!state.greeted[state.sceneIndex]) return `Choose the ${getScene(state).resident}, then choose a reply. That's all you need to do here.`;
  if (state.sceneIndex < 4) return "Choose Go to the next island. You can come back whenever you like.";
  return state.complete ? "You can revisit the other islands using the path back, or linger here." : "Choose Rest here to finish this little journey.";
}
const hellos = [
  ["Hello there. First island?", "Say hello, then take the path on your right. It leads to the Woodgrain Bird. I'll be here if you come back."],
  ["You must be the person the frog was expecting.", "Welcome. The path continues to the glasshouse. There's always something growing there."],
  ["Welcome to the garden. I am making my morning rounds. Since Tuesday.", "The observatory is just along the path. The bird there moves rather faster than I do."],
  ["Good timing. I was looking for the next island. It keeps being exactly where I left it.", "See that warm light? That's the archive. Follow the path and say hello to the owl."],
  ["There you are. A chair, a lantern, and no particular hurry.", "Tell me you've arrived, then make yourself comfortable."]
];
const replies = [
  ["Hello! I'm finding my way.", "Then you're doing it correctly. One hello, one island at a time. Go on - the path is ready."],
  ["The frog sent me.", "An excellent reference. Follow the roots to the glasshouse. They know where they're going."],
  ["I'll try not to hurry through.", "A fine plan. Look at the rain garden if you like. The path will wait."],
  ["I can see the lantern.", "Then you have all the navigation equipment you need. Onward, when you're ready."],
  ["It's good to have arrived.", "Yes. Sit for a while. The islands will still be there when you're ready to wander again."]
];
const observations = [
  "A small pond reflects a very large sky.",
  "The roots make a broad, steady path. A small leaf points toward the glasshouse.",
  "A drop slides from an enormous leaf into a shallow stream. The ferns are having an excellent day.",
  "Through the brass telescope, one warm window glows inside a distant oak. You can see it without the telescope too.",
  "An open book waits beside the lantern. Someone has pressed a leaf between its pages. There is room beside it for another story."
];
const leave = { id: "leave", label: "Back to the island" };
function availableChoices(target: Target, state: GameState): Dialogue["choices"] {
  switch (target) {
    case "resident": return [{ id: "greet", label: state.greeted[state.sceneIndex] ? "Thank you. I'll take my time." : replies[state.sceneIndex][0] }, leave];
    case "detail": return state.sceneIndex > 0 ? [{ id: "examine", label: "Take a closer look" }, leave] : [leave];
    case "path": return state.greeted[state.sceneIndex] ? [{ id: state.sceneIndex === 4 ? "finish" : "forward", label: state.sceneIndex === 4 ? "Rest here" : "Go to the next island" }, leave] : [leave];
    case "back": return state.sceneIndex > 0 ? [{ id: "back", label: "Go back to the previous island" }, leave] : [leave];
  }
}
export function getDialogue(target: Target, state: GameState): Dialogue {
  const scene = getScene(state);
  const speaker = target === "resident" ? `The ${scene.resident}` : target === "detail" ? scene.detail : "The path";
  let lines: string[];
  switch (target) {
    case "resident": lines = state.greeted[state.sceneIndex] ? [replies[state.sceneIndex][1]] : hellos[state.sceneIndex]; break;
    case "detail": lines = [observations[state.sceneIndex]]; break;
    case "path": lines = !state.greeted[state.sceneIndex] ? [`The ${scene.resident} is waiting to say hello. Talk for a moment before heading on.`] : [state.sceneIndex === 4 ? "A quiet seat waits beside the reading desk." : `The path leads to ${islandScenes[state.sceneIndex + 1].name}.`]; break;
    case "back": lines = [state.sceneIndex > 0 ? `You can return to ${islandScenes[state.sceneIndex - 1].name}.` : "This is where your journey began."]; break;
  }
  return { speaker, lines, choices: availableChoices(target, state) };
}
/** Looking or opening a conversation never unlocks a crossing. */
export function move(state: GameState, direction: "forward" | "back"): GameState {
  if (direction === "forward" && canMoveForward(state)) return { ...state, sceneIndex: (state.sceneIndex + 1) as IslandIndex };
  if (direction === "back" && state.sceneIndex > 0) return { ...state, sceneIndex: (state.sceneIndex - 1) as IslandIndex };
  return state;
}
export function choose(target: Target, choiceId: string, state: GameState): { state: GameState; dialogue: Dialogue } {
  if (!availableChoices(target, state).some(choice => choice.id === choiceId) || choiceId === "leave") return { state, dialogue: getDialogue(target, state) };
  let next = state;
  if (target === "resident" && choiceId === "greet") {
    const greeted = [...state.greeted] as IslandFlags; greeted[state.sceneIndex] = true; next = { ...state, greeted };
  } else if (target === "detail" && choiceId === "examine") {
    const inspected = [...state.inspected] as IslandFlags; inspected[state.sceneIndex] = true; next = { ...state, inspected };
  } else if (target === "path" && choiceId === "forward") next = move(state, "forward");
  else if (target === "back" && choiceId === "back") next = move(state, "back");
  else if (target === "path" && choiceId === "finish" && state.sceneIndex === 4 && state.greeted[4]) next = { ...state, complete: true };
  const dialogue = getDialogue(target, next);
  if (target === "resident" && choiceId === "greet") dialogue.lines = [replies[state.sceneIndex][1]];
  if (target === "detail" && choiceId === "examine") dialogue.lines = [observations[state.sceneIndex]];
  return { state: next, dialogue };
}
export function getJournal(state: GameState): { title: string; text: string }[] {
  return islandScenes.flatMap((scene, index) => {
    if (index > state.sceneIndex && !state.greeted[index]) return [];
    const entries = [{ title: scene.name, text: state.greeted[index] ? `I met the ${scene.resident}. ${replies[index][1]}` : scene.arrival }];
    if (state.inspected[index]) entries.push({ title: scene.detail, text: observations[index] });
    return entries;
  });
}
/** Migrate the old opening without deleting its save. Finished crossings resume at island two. */
export function restoreState(raw: unknown): GameState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  if (value.version === 1) {
    const preparation = ["examinedGap", "watchedJuggler", "examinedRoots", "learnedResponse", "turtleWilling", "jugglerReady"];
    if ([...preparation, "complete", "bridgeOpen"].some(key => typeof value[key] !== "boolean")) return null;
    if (!["quiet", "honest", "playful"].includes(String(value.approach))) return null;
    if (value.complete && !value.bridgeOpen || value.bridgeOpen && preparation.some(key => !value[key])) return null;
    return { ...initialState, sceneIndex: value.complete ? 1 : 0, greeted: [value.complete === true, false, false, false, false], inspected: [false, false, false, false, false] };
  }
  const flags = (input: unknown): input is IslandFlags => Array.isArray(input) && input.length === 5 && input.every(flag => typeof flag === "boolean");
  if (value.version !== 2 || !Number.isInteger(value.sceneIndex) || Number(value.sceneIndex) < 0 || Number(value.sceneIndex) > 4 || !flags(value.greeted) || !flags(value.inspected) || typeof value.complete !== "boolean") return null;
  const sceneIndex = value.sceneIndex as IslandIndex;
  const firstUngreeted = value.greeted.indexOf(false);
  if (firstUngreeted !== -1 && (sceneIndex > firstUngreeted || value.greeted.slice(firstUngreeted + 1).some(Boolean))) return null;
  if (value.complete && !value.greeted.every(Boolean)) return null;
  return { version: 2, sceneIndex, greeted: [...value.greeted], inspected: [...value.inspected], complete: value.complete };
}
