/** The First Crossing. Pure story logic; the scene, controls and save slot live in the UI. */
export type Target = "visitor" | "turtle" | "juggler" | "bird" | "roots" | "gap" | "islands";

export type GameState = {
  version: 1;
  examinedGap: boolean;
  watchedJuggler: boolean;
  examinedRoots: boolean;
  learnedResponse: boolean;
  turtleWilling: boolean;
  jugglerReady: boolean;
  bridgeOpen: boolean;
  complete: boolean;
  approach: "quiet" | "honest" | "playful";
};

export type Dialogue = {
  speaker: string;
  lines: string[];
  choices: { id: string; label: string }[];
};

export const initialState: GameState = Object.freeze({
  version: 1,
  examinedGap: false,
  watchedJuggler: false,
  examinedRoots: false,
  learnedResponse: false,
  turtleWilling: false,
  jugglerReady: false,
  bridgeOpen: false,
  complete: false,
  approach: "quiet",
});

const preparation = [
  "examinedGap", "watchedJuggler", "examinedRoots", "learnedResponse", "turtleWilling", "jugglerReady",
] as const;

const booleanFields = [...preparation, "bridgeOpen", "complete"] as const;
const leave = { id: "leave", label: "Back to the clearing" };

export function getProgress(state: GameState): { done: number; total: number } {
  return { done: preparation.filter((key) => state[key]).length, total: preparation.length };
}

export function isBridgeOpen(state: GameState): boolean { return state.bridgeOpen; }
export function isComplete(state: GameState): boolean { return state.complete; }

export function getStage(state: GameState): "arrival" | "exploring" | "ready" | "bridge" | "complete" {
  if (state.complete) return "complete";
  if (state.bridgeOpen) return "bridge";
  const { done, total } = getProgress(state);
  return done === total ? "ready" : done ? "exploring" : "arrival";
}

export function getObjective(state: GameState): string {
  switch (getStage(state)) {
    case "complete": return "The first crossing is yours.";
    case "bridge": return "Take the first step across the roots.";
    case "ready": return "Ask the Trumpet Turtle to begin the crossing.";
    case "exploring": return "Bring the clearing together to make a crossing.";
    default: return "Find a way to the next island.";
  }
}

/** Opt-in help. The ordinary objective deliberately does not reveal every step. */
export function getHint(state: GameState): string {
  if (state.complete) return "You have reached the end of this opening. You can revisit the clearing or start a fresh journey.";
  if (state.bridgeOpen) return "Select the gap and choose to cross. The roots are holding steady.";
  if (!state.examinedGap) return "Look closely at the gap. There may be a landing place among the roots on the next island.";
  if (!state.watchedJuggler) return "Ask the Orb Juggler to show you the pattern. Watch where the two short movements leave a pause.";
  if (!state.examinedRoots) return "Examine the roots near the gap. They respond to the same pattern the juggler is showing you.";
  if (!state.learnedResponse) return "Ask the Woodgrain Bird how the roots make a crossing. It knows why the pause matters.";
  if (!state.turtleWilling) return "Ask the Trumpet Turtle to make the call. It wants to know this will be an exchange, not a solo.";
  if (!state.jugglerReady) return "Ask the Orb Juggler to answer the turtle's call. The answer belongs in the pause.";
  return "Everyone is ready. Return to the Trumpet Turtle and ask it to begin.";
}

export function getJournal(state: GameState): { title: string; text: string }[] {
  const entries: { title: string; text: string }[] = [
    { title: "A clearing between places", text: "There is another island beyond the roots. I would like to find out what is waiting there." },
  ];
  if (state.examinedGap) entries.push({ title: "A place to land", text: "A pale root on the near edge faces a root on the next island. The distance is too wide to jump." });
  if (state.watchedJuggler) entries.push({ title: "The juggler's pattern", text: "Two short rises. A pause. One long sweep. The orbs hold the rhythm where I can see it." });
  if (state.examinedRoots) entries.push({ title: "The roots are listening", text: "Their tips lift twice, then wait. They reach toward the other island when the long answering sweep arrives." });
  if (state.learnedResponse) entries.push({ title: "An invitation and an answer", text: "The turtle makes two short calls. After a pause, the juggler gives one long answer. The roots carry the exchange across the gap. Neither side has to reach alone." });
  if (state.turtleWilling) entries.push({ title: "Someone to call", text: "The Trumpet Turtle will begin the invitation. It would like a wave from the other bank when I arrive." });
  if (state.jugglerReady) entries.push({ title: "Someone to answer", text: "The Orb Juggler has agreed to make the long answering sweep. It wants to hear how the echo sounds from the next island." });
  if (state.approach === "honest") entries.push({ title: "Saying it aloud", text: "I admitted that I am frightened of the crossing. Apparently the roots don't require confidence. Only a first step." });
  if (state.approach === "playful") entries.push({ title: "A useful question", text: "I asked whether the crossing comes with a handrail. The answer was reassuringly practical." });
  if (state.bridgeOpen) entries.push({ title: "A bridge made together", text: "The call and its answer brought the roots together. A broad path now reaches the next island." });
  if (state.complete) entries.push({ title: "The first crossing", text: "I crossed, turned, and waved. For the first time since arriving, I was expected somewhere." });
  return entries;
}

function choices(target: Target, state: GameState): Dialogue["choices"] {
  switch (target) {
    case "visitor": return [
      { id: "breathe", label: "Take a breath. Look around." },
      { id: "remember", label: "What do I remember?" },
      { id: "pockets", label: "Check my pockets" },
      leave,
    ];
    case "turtle": return [
      { id: "waiting", label: "What are you waiting for?" },
      { id: "invite", label: state.turtleWilling ? "Are you still willing to call?" : "Would you make the call for me?" },
      { id: "perform", label: state.bridgeOpen ? "That was quite a crossing." : "Let's begin the crossing." },
      { id: "fear", label: "I'm a little frightened of that gap." },
      { id: "tail", label: "Ask about the flowering tail" },
      leave,
    ];
    case "juggler": return [
      { id: "watch", label: state.watchedJuggler ? "Show me the pattern again." : "Let me watch the pattern." },
      { id: "invite", label: state.jugglerReady ? "Ready to answer the turtle?" : "Would you answer the turtle's call?" },
      { id: "orbs", label: "What are you juggling?" },
      { id: "practice", label: "How long have you been practicing?" },
      { id: "beyond", label: "Have you been to the next island?" },
      leave,
    ];
    case "bird": return [
      { id: "crossing", label: state.learnedResponse ? "Remind me how the crossing works." : "How do the roots make a crossing?" },
      { id: "home", label: "Are you a bird, or a tree?" },
      { id: "elsewhere", label: "Where does the next island lead?" },
      { id: "handrail", label: "Does the crossing come with a handrail?" },
      { id: "help", label: "Couldn't you just carry me over?" },
      leave,
    ];
    case "roots": return [
      { id: "examine", label: state.examinedRoots ? "Watch the root tips again" : "Look closely at the root tips" },
      { id: "touch", label: "Rest a hand against the wood" },
      { id: "age", label: "Follow the grain" },
      leave,
    ];
    case "gap": return [
      { id: "examine", label: state.examinedGap ? "Look toward the landing again" : "Look for a place to land" },
      { id: "cross", label: state.complete ? "Remember the first step" : state.bridgeOpen ? "Take the first step. Cross the roots." : "Could I cross from here?" },
      { id: "listen", label: "Listen to the distance" },
      leave,
    ];
    case "islands": return [
      { id: "look", label: "Look farther into the valley" },
      { id: "lights", label: "Watch the distant lights" },
      leave,
    ];
  }
}

const speakers: Record<Target, string> = {
  visitor: "The Visitor", turtle: "The Trumpet Turtle", juggler: "The Orb Juggler",
  bird: "The Woodgrain Bird", roots: "The listening roots", gap: "The next step", islands: "The islands beyond",
};

function reply(target: Target, state: GameState, lines: string[], speaker = speakers[target]): Dialogue {
  return { speaker, lines, choices: choices(target, state) };
}

export function getDialogue(target: Target, state: GameState): Dialogue {
  switch (target) {
    case "visitor": return reply(target, state, state.complete
      ? ["I expected getting across to make this place less strange. It hasn't.", "It has made it a little less unfamiliar."]
      : ["My shoes are on solid ground. The solid ground is floating. I'll deal with those facts separately.", "Someone here must know the way onward."]);
    case "turtle": return reply(target, state, state.bridgeOpen
      ? ["A very good answer. Worth the wait.", state.complete ? "And an excellent wave. Thank you." : "Go on. We'll keep the crossing for you."]
      : state.turtleWilling
        ? ["I have the invitation ready. Two short calls, and room for a reply.", "No hurry. A hurried pause is hardly a pause at all."]
        : ["Good afternoon. Or the part of the day we have agreed to call afternoon.", "Are you staying on this bank, or hoping to be received by the next one?"]);
    case "juggler": return reply(target, state, state.bridgeOpen
      ? ["Did you see? The roots held the last note after I let it go.", "If you hear it from over there, tell me whether it sounds round or long."]
      : state.jugglerReady
        ? ["Ready. I'm leaving a little space for the turtle.", "It's much harder than filling every moment. I've been practicing."]
        : ["Careful of the bit between the orbs. That's where the useful part happens.", "You can watch. They don't mind an audience."]);
    case "bird": return reply(target, state, state.bridgeOpen
      ? ["There. A path with two ends that agree about being a path.", "Please use the middle. I have only just persuaded the leaves to move aside."]
      : state.learnedResponse
        ? ["The roots are quite willing. They simply prefer to know they're expected."]
        : ["The great wooden face turns, very slightly, toward you.", "“If you are looking for a crossing, you've found the correct absence of one.”"]);
    case "roots": return reply(target, state, state.bridgeOpen
      ? ["The roots now lie broad and close together. A ridge has curled up along either side, just high enough for a hand.", "Small leaves tremble over the open air."]
      : ["Pale root tips curl out over the edge. Their counterparts wait on the next island.", "Every so often, one of the near tips lifts, as if about to ask something."]);
    case "gap": return reply(target, state, state.complete
      ? ["From this side, the clearing seems smaller. The people in it don't.", "You can still make out the turtle's flowering tail."]
      : state.bridgeOpen
        ? ["There is a path now. The far bank is no nearer, but it has become somewhere you can reach.", "The first root is broad enough for both your feet."]
        : ["The terrace ends in a long, quiet drop. The next island hangs beyond it, green and gold.", "This is a good place to look. It is not a good place to jump."]);
    case "islands": return reply(target, state, [
      "Forested islands drift through layers of blue distance. Some carry little paths. Some carry things too large to be paths.",
      state.complete ? "One crossing has brought all of them a little closer." : "For now, the next island is enough.",
    ]);
  }
}

export function choose(target: Target, choiceId: string, state: GameState): { state: GameState; dialogue: Dialogue } {
  // Stale or unknown UI actions are harmless; actions are always chosen from the current conversation.
  if (choiceId === "leave" || !choices(target, state).some((choice) => choice.id === choiceId)) {
    return { state, dialogue: getDialogue(target, state) };
  }
  let next = state;
  let lines: string[] = [];
  let speaker = speakers[target];
  const update = (patch: Partial<GameState>) => { next = { ...next, ...patch }; };

  switch (`${target}:${choiceId}`) {
    case "visitor:breathe": lines = [
      "In. Out. There is warm air here, and the smell of bark after rain.",
      "The turtle is waiting for something. The juggler is demonstrating something. The bird looks as if it has known both of those things for a long time.",
      "I can start by asking.",
    ]; break;
    case "visitor:remember": lines = [
      "A moment ago there was somewhere else. I can remember the feeling of needing to leave it more clearly than the place itself.",
      "I don't need to solve that before I introduce myself. Probably.",
    ]; break;
    case "visitor:pockets": lines = [
      "A fold of lint. A button that seems to belong to the shirt I am wearing. No map.",
      "On balance, it is a relief that this isn't going to depend on something I remembered to pack.",
    ]; break;
    case "turtle:waiting": lines = [
      "“An answer. I can make the invitation, but it would be impolite to provide the reply myself.”",
      "The turtle gestures toward the juggler with its flowering tail.",
      "“Our friend has a splendid answer. It keeps practicing it privately. Perhaps you could give it an occasion.”",
    ]; break;
    case "turtle:invite":
      update({ turtleWilling: true });
      lines = [
        "“Gladly. Two short calls, and then I leave the next voice its room.”",
        "“Will you do one thing for me? When you reach the other bank, turn and wave. It's pleasant to see an invitation arrive.”",
        "You promise. The turtle plants all four feet and lifts its trumpet-shaped head.",
      ]; break;
    case "turtle:perform":
      if (state.bridgeOpen) {
        lines = ["“It was a conversation. The roots were good enough to let us walk on it.”", "The turtle looks pleased with this description."];
      } else if (!state.examinedGap) {
        lines = ["“Certainly. Where are you hoping to arrive?”", "You glance toward the edge. Best to look for a landing before asking everyone to make a crossing."];
      } else if (!state.watchedJuggler) {
        lines = ["“Before we begin, watch our friend's pattern. You should see the answer you are inviting.”", "The juggler is keeping its orbs in a patient, repeating arc."];
      } else if (!state.examinedRoots) {
        lines = ["“Look at the root tips first. They're already showing us where the exchange wants to go.”", "The turtle waits while you turn toward the roots at the edge."];
      } else if (!state.learnedResponse) {
        lines = ["“We ought to ask our host which roots are ready to receive us.”", "The great woodgrain face watches over the clearing. It seems to have heard its cue."];
      } else if (!state.turtleWilling) {
        lines = ["“I would be happy to. Were you asking me to make the invitation?”", "The turtle waits for you to ask it to take part."];
      } else if (!state.jugglerReady) {
        lines = ["“I have my call. Has our friend agreed to answer?”", "The juggler is still absorbed in its own pattern. You should invite it to join the exchange."];
      } else {
        update({ bridgeOpen: true });
        speaker = "A call, and an answer";
        lines = [
          "The turtle gives two short calls. The root tips rise once, then again. A pause opens in the clearing.",
          "The juggler sends its orbs into one long, bright sweep. The answer travels through the wood; the roots on the far bank lean to meet it.",
          "Across the gap, pale strands weave together. Broader roots settle over them. Leaves uncurl along a path that wasn't there a moment ago.",
          "“There,” says the bird. “Now you have been expected.”",
        ];
      }
      break;
    case "turtle:fear":
      update({ approach: "honest" });
      lines = [
        "“Yes,” says the turtle. “It is a considerable gap.”",
        "It considers you without embarrassment.",
        "“Fortunately, the roots don't ask you to be unafraid. They'll do the holding. You can concentrate on the walking.”",
      ]; break;
    case "turtle:tail": lines = [
      "“These? They open when I've been standing in one place long enough.”",
      "“Is that inconvenient?” you ask.",
      "“Sometimes. But it makes waiting rather less of a waste.”",
    ]; break;
    case "juggler:watch":
      update({ watchedJuggler: true });
      lines = [
        "The juggler slows down so you can follow. One orb rises a little. Then the other. Both hang still for a moment.",
        "Then comes a single long sweep, carrying the pair across the empty space between its hands.",
        "Two short rises. A pause. One long answer. At the edge of the terrace, a root tip stirs.",
        "“I like that part,” says the juggler. “When the space becomes something you can use.”",
      ]; break;
    case "juggler:invite":
      update({ jugglerReady: true });
      lines = [
        "“With the long sweep? Yes. I've been wondering what it would sound like with an actual question in front of it.”",
        "The orbs settle into a low, waiting arc.",
        "“Go and tell the turtle. And when you're over there, listen for the echo. I think it might come back with a different shape.”",
      ]; break;
    case "juggler:orbs": lines = [
      "“These are the heavy ones.”",
      "You ask what they are made of.",
      "“Mostly attention. If I stop paying it, they get much heavier.” The juggler catches one without looking. “Please don't test that.”",
    ]; break;
    case "juggler:practice": lines = [
      "“Since I could keep one in the air. The second one took longer.”",
      "“Why two?”",
      "“With one, the empty hand always feels left out.”",
      "It makes another pass, slower this time. You can see how carefully it leaves room for the catch.",
    ]; break;
    case "juggler:beyond": lines = [
      "“Once. The light there arrives from a different side. I kept reaching for the wrong shadow.”",
      "“Was it difficult?”",
      "“At first. Then it was the place where I'd learned a different way to stand.”",
    ]; break;
    case "bird:crossing":
      update({ learnedResponse: true });
      lines = [
        "“Two short calls invite. A pause leaves room. One long answer accepts. The roots carry that exchange to the other bank.”",
        "“Ask the turtle to make the call, and the juggler to answer. You can see the rhythm in its orbs. There is nothing you need to sing or time.”",
        "“Why both of them?” you ask.",
        "“So neither end has to do all the reaching. It is a useful arrangement, beyond bridges.”",
      ]; break;
    case "bird:home": lines = [
      "“Yes.”",
      "The bird allows this answer to settle among the leaves.",
      "“Are those different occupations where you come from?”",
      "You look at the roots, the great beak, the little green crown. You decide it is a question you can leave open.",
    ]; break;
    case "bird:elsewhere": lines = [
      "“To the next place you can stand.”",
      "“And after that?”",
      "“That is usually easier to see once you're standing there. I can tell you it catches the evening light before we do.”",
      "Beyond the gap, the leaves have begun to turn gold at their edges.",
    ]; break;
    case "bird:handrail":
      update({ approach: "playful" });
      lines = [
        "“Naturally. I have noticed that your kind prefers an extra root to hold.”",
        "“Our kind?”",
        "“The kind with so few feet.”",
        "A small root curls upward, as if demonstrating good service.",
      ]; break;
    case "bird:help": lines = [
      "“I could. There would be a considerable rearrangement of the forest.”",
      "A few leaves tremble high above you.",
      "“Or we could make something the next visitor can use as well.”",
      "You look back toward the turtle and the juggler. That seems the better introduction.",
    ]; break;
    case "roots:examine":
      update({ examinedRoots: true });
      lines = state.bridgeOpen ? [
        "The same pale tips are woven into the path now. You can trace each one to the root that met it from the other side.",
        "The pattern hasn't vanished. It has become something that can hold weight.",
      ] : [
        "You crouch beside a pale root. In time with the juggler's orbs, its tip lifts twice and waits.",
        "When the orbs make their long sweep, the root stretches toward the other bank. It stops short, then slowly settles back.",
        "It can begin the reaching. Something is still missing from the exchange.",
      ]; break;
    case "roots:touch": lines = [
      "The wood is warm. Beneath the ridges, you feel a faint movement, patient enough to have been going on before you arrived.",
      "From somewhere overhead the bird says, “Thank you for asking with a flat hand.”",
      "You hadn't realized you were asking anything. You leave your hand there for another moment.",
    ]; break;
    case "roots:age": lines = [
      "The grain bends around old knots. Little roots have grown around larger ones, keeping their shape without quite repeating it.",
      "There is no straight line here that hasn't made room for something.",
    ]; break;
    case "gap:examine":
      update({ examinedGap: true });
      lines = state.bridgeOpen ? [
        "The landing you noticed is exactly where the new path arrives. A pale root curls around a patch of gold-green grass.",
        "Someone has left enough room for a visitor to stop and look back.",
      ] : [
        "Across the drop, a broad pale root curves into a shelf of gold-green grass. Another root waits on this side, facing it.",
        "The two edges seem to belong to the same path. They have simply not been introduced.",
        "You step back from the brink. Whatever makes the crossing, it will need to reach that shelf.",
      ]; break;
    case "gap:cross":
      if (state.complete) {
        lines = ["You remember the slight give of the first root, then its steadiness.", "It wasn't a leap. That turned out to matter."];
      } else if (!state.bridgeOpen) {
        lines = [
          "You test the ground with one shoe, well back from the edge. There is no path yet.",
          "No need to make courage do a bridge's job. You turn toward the people in the clearing.",
        ];
      } else {
        update({ complete: true });
        speaker = "The first crossing";
        lines = [
          state.approach === "honest"
            ? "Your first step is a little frightened. The root holds it just as carefully as any other step."
            : state.approach === "playful"
              ? "You take the bird's handrail. It is an excellent extra root."
              : "You put one foot on the nearest root. It gives a little, then holds. You put down the other.",
          "Halfway across, the last note of the answer comes back through the wood. It sounds round at first. Then long.",
          "You reach the grass, turn, and wave. A flowering tail waves back. Two bright orbs rise once into the air.",
          "Ahead, another path bends into the trees. For the first time since arriving, you want to see where it goes.",
        ];
      }
      break;
    case "gap:listen": lines = [
      "Wind moves below the terrace. Somewhere farther off, a loose leaf taps against wood.",
      state.bridgeOpen ? "Beneath it is the lingering answer, returning through the new path." : "The silence between those sounds feels unusually available.",
    ]; break;
    case "islands:look": lines = [
      "A thread of path disappears around a tall rooted shape. Beyond it, a smaller island carries a tree leaning into the light.",
      "Farther still, the mountains turn from green to blue to something almost the color of the paper beneath them.",
      "You could spend a long time mistaking the edge of one place for the beginning of another.",
    ]; break;
    case "islands:lights": lines = [
      "Small warm lights gather among the distant leaves. They drift too slowly to be falling.",
      "For a while you watch without trying to decide what they are. It feels like a useful new skill.",
    ]; break;
  }
  return { state: next, dialogue: reply(target, next, lines, speaker) };
}

/** Only a complete, supported save is restored; corrupt or partial saves start fresh. */
export function restoreState(raw: unknown): GameState | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const candidate = raw as Record<string, unknown>;
  if (candidate.version !== 1 || !booleanFields.every((key) => typeof candidate[key] === "boolean")) return null;
  if (candidate.approach !== "quiet" && candidate.approach !== "honest" && candidate.approach !== "playful") return null;
  if (candidate.complete && !candidate.bridgeOpen) return null;
  if (candidate.bridgeOpen && !preparation.every((key) => candidate[key] === true)) return null;
  return {
    version: 1,
    examinedGap: candidate.examinedGap as boolean,
    watchedJuggler: candidate.watchedJuggler as boolean,
    examinedRoots: candidate.examinedRoots as boolean,
    learnedResponse: candidate.learnedResponse as boolean,
    turtleWilling: candidate.turtleWilling as boolean,
    jugglerReady: candidate.jugglerReady as boolean,
    bridgeOpen: candidate.bridgeOpen as boolean,
    complete: candidate.complete as boolean,
    approach: candidate.approach,
  };
}
