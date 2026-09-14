export type Crop = "turnip" | "strawberry" | "sunflower";
export type Item = Crop | "fish" | "bouquet";
export type Tool = "hand" | "hoe" | "seed" | "water" | "harvest" | "fish";
export interface Plot {
  tilled: boolean;
  crop: Crop | null;
  growth: number;
  watered: boolean;
}
export interface Bond {
  points: number;
  dating: boolean;
  talked: number;
  gifted: number;
  dated: number;
}
export interface State {
  version: 1;
  day: number;
  minutes: number;
  coins: number;
  energy: number;
  inventory: Record<Item, number>;
  seeds: Record<Crop, number>;
  plots: Plot[];
  bonds: Record<string, Bond>;
  player: { x: number; y: number };
  harvests: number;
  catches: number;
  festival: boolean;
  log: string[];
}
export const CROPS: Record<
  Crop,
  { label: string; icon: string; days: number; seedPrice: number; sell: number }
> = {
  turnip: { label: "Turnip", icon: "🥬", days: 1, seedPrice: 8, sell: 22 },
  strawberry: {
    label: "Strawberry",
    icon: "🍓",
    days: 2,
    seedPrice: 15,
    sell: 40,
  },
  sunflower: {
    label: "Sunflower",
    icon: "🌻",
    days: 2,
    seedPrice: 12,
    sell: 32,
  },
};
export const PEOPLE = [
  {
    id: "rowan",
    name: "Rowan",
    pronouns: "he/him",
    age: 29,
    job: "The gardener",
    color: "#719951",
    favorite: "sunflower" as Item,
    x: 265,
    y: 415,
    intro:
      "Oh, the new farmer! I was told to be mysterious until you gave me enough vegetables. Honestly, a hello works too.",
    chat: [
      "The best part of gardening? Everything is rooting for you. Including me.",
      "My tomato vines are sharing a trellis. I think they have the right idea.",
      "I saved you the sunny spot. There is room for more than one of us.",
    ],
    date: "Rowan spreads a blanket between the apple trees. He has packed six kinds of jam and forgotten the bread. “We could call this a tasting menu?”",
    choices: ["Share the jam by the spoonful", "Make flower crowns together"],
    ending:
      "Sticky fingers, flower crowns, and a very unhurried kiss. Rowan asks if next time you could bring everyone.",
  },
  {
    id: "cleo",
    name: "Cleo",
    pronouns: "she/her",
    age: 32,
    job: "The baker",
    color: "#cd943e",
    favorite: "strawberry" as Item,
    x: 597,
    y: 300,
    intro:
      "Welcome! I sell seeds, buy your crops, and accept romantic gifts. It is a very vertically integrated meet-cute.",
    chat: [
      "Someone ordered a wedding cake with seven little figures. Finally, a structural challenge.",
      "There is always room at my table. I have been buying more chairs.",
      "I made you a heart-shaped bun. It came out potato-shaped. Emotionally, it is still a heart.",
    ],
    date: "The bakery is closed, but the oven is still warm. Cleo hands you an apron. “Tonight, we are making something wildly impractical.”",
    choices: [
      "Bake a seven-layer love cake",
      "Start a very gentle flour fight",
    ],
    ending:
      "You leave covered in flour, carrying the world’s least symmetrical cake. Cleo kisses your cheek and calls it a masterpiece.",
  },
  {
    id: "jun",
    name: "Jun",
    pronouns: "they/them",
    age: 27,
    job: "The river keeper",
    color: "#559f9d",
    favorite: "fish" as Item,
    x: 928,
    y: 480,
    intro:
      "You are the new farmer? Good. The river needs a keeper and my love life needs a protagonist.",
    chat: [
      "A river can split into many streams and still be the same river. Love makes sense that way.",
      "I catalogued twelve frog calls today. None of them were asking about my relationship status.",
      "I found a stone shaped like a heart. Then another. The river is being a little obvious.",
    ],
    date: "Jun leads you along the river at sunset. Paper lanterns drift past the reeds. “I made a wish. You can probably guess it.”",
    choices: ["Float a lantern together", "Sit close and listen to the frogs"],
    ending:
      "Your shoulders touch as the lanterns turn the water gold. Jun takes your hand. The frogs, for once, mind their business.",
  },
  {
    id: "iris",
    name: "Iris",
    pronouns: "she/her",
    age: 26,
    job: "The musician",
    color: "#ac7cb9",
    favorite: "sunflower" as Item,
    x: 838,
    y: 310,
    intro:
      "I wrote the town theme. It loops forever. So does my crush on the person who keeps bringing me sunflowers.",
    chat: [
      "I am composing a love song. It has a lot of verses. And a shared calendar.",
      "You have excellent walking-through-the-village rhythm. Have you considered percussion?",
      "A duet is lovely. But have you heard a whole orchestra?",
    ],
    date: "Iris has hung fairy lights around the gazebo. She begins a song, misses a chord, and laughs. “That part was jazz.”",
    choices: [
      "Dance like nobody has knees",
      "Sing a gloriously off-key harmony",
    ],
    ending:
      "You dance until the last note becomes a laugh. Iris kisses you and immediately starts writing the chorus.",
  },
  {
    id: "mateo",
    name: "Mateo",
    pronouns: "he/him",
    age: 35,
    job: "The carpenter",
    color: "#c88050",
    favorite: "turnip" as Item,
    x: 655,
    y: 570,
    intro:
      "I can upgrade your house once you have enough wood. I can upgrade our relationship once you say hello. Much less grinding.",
    chat: [
      "My love language is making sure your shelves are level.",
      "I am building a bigger picnic table. No reason. Well. Several very attractive reasons.",
      "Measure twice, fall in love as often as feels right. That is the saying, yes?",
    ],
    date: "Mateo sets out two small pieces of wood. “We are carving keepsakes. No power tools. I would like to impress you with all ten fingers.”",
    choices: [
      "Carve your initials in a little heart",
      "Build a tiny, crooked birdhouse",
    ],
    ending:
      "Your keepsake is beautifully imperfect. Mateo hangs it in the workshop. “This is my favorite thing we have made.”",
  },
  {
    id: "maeve",
    name: "Maeve",
    pronouns: "she/her",
    age: 42,
    job: "The astronomer",
    color: "#aa6f88",
    favorite: "bouquet" as Item,
    x: 814,
    y: 647,
    intro:
      "I chart the stars. Apparently every constellation says I am compatible with the new farmer. Extremely rigorous science.",
    chat: [
      "Constellations are just a lot of beautiful things connected. No star has to shine alone.",
      "Tonight should be clear. My schedule, remarkably, is also clear.",
      "I charted our compatibility. Very scientific. There were colored pencils.",
    ],
    date: "Maeve has set up a telescope on the hill and brought a thermos of cocoa. “There are billions of stars. I am rather glad you are here.”",
    choices: ["Invent a constellation together", "Share cocoa under the stars"],
    ending:
      "You name a tiny constellation The Extremely Lucky Farmer. Maeve laughs, then pulls you a little closer.",
  },
  {
    id: "goblin",
    name: "Lord Goblin theTurd",
    pronouns: "he/him",
    age: 57,
    job: "The compost aristocrat",
    color: "#8b9146",
    favorite: "fish" as Item,
    x: 80,
    y: 590,
    intro:
      "Lord Goblin theTurd, at your service. I am filthy rich. Mostly filthy. Bring me a fish and I will whisper something absolutely disgusting: agricultural tax loopholes.",
    chat: [
      "I put the ass in aristocracy. The council asked me to stop putting it on their furniture.",
      "Fancy a roll in the hay? Fair warning: I have hay fever. It is like dating a horny accordion.",
      "They told me to bring protection. I brought a moat. Apparently that was not the fucking question.",
      "My ex said I was full of shit. Finally, someone who understood my compost business.",
      "I am a freak in the sheets. Mostly because I eat soup in bed. The stains have formed a government.",
      "I bathed for this. A duck splashed me. Practically a spa day, you lucky bastard.",
      "My reputation is enormous. My manners are microscopic. The smell is a third, legally separate problem.",
      "You may court the whole town, darling. I am a goblin, not a fucking landlord.",
    ],
    date: "His Lordship unveils a candlelit compost heap. The candles are stolen. The heap has a wine list. ‘Welcome to my filthy little kingdom. I would offer you a dirty martini, but the health inspector confiscated the bucket.’ He pulls out a surprisingly clean chair for you.",
    choices: [
      "Flirt shamelessly over questionable wine",
      "Demand a royal bath before the romance",
    ],
    ending:
      "He washes his hands, bows so low his crown falls into a turnip, and asks before kissing your knuckles. ‘Consent is sexy. Personal hygiene is still under review.’ The toads applaud. His royal belch ends the evening in B-flat.",
  },
] as const;
export type Person = (typeof PEOPLE)[number];
export function freshState(): State {
  return {
    version: 1,
    day: 1,
    minutes: 540,
    coins: 120,
    energy: 100,
    inventory: { turnip: 0, strawberry: 0, sunflower: 0, fish: 0, bouquet: 2 },
    seeds: { turnip: 8, strawberry: 4, sunflower: 4 },
    plots: Array.from({ length: 12 }, (_, i) => ({
      tilled: i < 8,
      crop: i < 4 ? "turnip" : null,
      growth: 0,
      watered: false,
    })),
    bonds: Object.fromEntries(
      PEOPLE.map((p) => [
        p.id,
        { points: 2, dating: false, talked: 0, gifted: 0, dated: 0 },
      ]),
    ),
    player: { x: 468, y: 400 },
    harvests: 0,
    catches: 0,
    festival: false,
    log: ["You arrived in Heartwood Valley. Your old life can wait."],
  };
}
export function note(s: State, msg: string) {
  s.log.unshift(msg);
  s.log = s.log.slice(0, 30);
  return msg;
}
export function spend(s: State, energy = 3, minutes = 10) {
  if (s.energy < energy) return false;
  s.energy -= energy;
  s.minutes = Math.min(1380, s.minutes + minutes);
  return true;
}
export function tend(s: State, index: number, tool: Tool, seed: Crop): string {
  const p = s.plots[index];
  if (!p) return "That is not a garden bed.";
  if (tool === "hoe") {
    if (p.tilled) return "Already tilled. Choose seeds to plant something.";
    if (!spend(s)) return "Time to rest. Head home or choose Sleep.";
    p.tilled = true;
    return note(s, "A fresh bed. A small beginning.");
  }
  if (tool === "seed") {
    if (!p.tilled) return "Use the hoe first to prepare this bed.";
    if (p.crop) return "Something is already growing here.";
    if (s.seeds[seed] < 1)
      return `No ${CROPS[seed].label.toLowerCase()} seeds left. Visit Cleo’s shop.`;
    if (!spend(s)) return "Time to rest. Head home or choose Sleep.";
    p.crop = seed;
    p.growth = 0;
    s.seeds[seed]--;
    return note(s, `${CROPS[seed].label} planted. Give it a little water.`);
  }
  if (tool === "water") {
    if (!p.crop) return "Plant a seed here first.";
    if (p.watered) return "This bed already has enough water for today.";
    if (p.growth >= CROPS[p.crop].days)
      return "Ready to harvest! Choose the basket or your hand.";
    if (!spend(s, 2)) return "Time to rest. Head home or choose Sleep.";
    p.watered = true;
    return note(
      s,
      `${CROPS[p.crop].label} watered. It will grow while you sleep.`,
    );
  }
  if (
    (tool === "harvest" || tool === "hand") &&
    p.crop &&
    p.growth >= CROPS[p.crop].days
  ) {
    if (!spend(s, 2)) return "Time to rest. Head home or choose Sleep.";
    const crop = p.crop;
    s.inventory[crop]++;
    s.harvests++;
    p.crop = null;
    p.growth = 0;
    p.watered = false;
    return note(
      s,
      `${CROPS[crop].label} harvested! Keep it for a gift or sell it at the shipping crate.`,
    );
  }
  return p.crop
    ? `${CROPS[p.crop].label}: ${p.growth}/${CROPS[p.crop].days} growing days. ${p.watered ? "Watered today." : "Needs water."}`
    : p.tilled
      ? "A prepared bed. Choose seeds to plant."
      : "An empty bed. Choose the hoe to till.";
}
export function sleep(s: State) {
  let grown = 0;
  s.plots.forEach((p) => {
    if (p.crop && p.watered) {
      p.growth = Math.min(CROPS[p.crop].days, p.growth + 1);
      if (p.growth === CROPS[p.crop].days) grown++;
    }
    p.watered = false;
  });
  s.day++;
  s.minutes = 480;
  s.energy = 100;
  return note(
    s,
    `Good morning! Day ${s.day}. ${grown ? `${grown} crops are ready to harvest.` : "A fresh day and a full heart."}`,
  );
}
export function talk(s: State, id: string) {
  const p = PEOPLE.find((p) => p.id === id)!;
  const b = s.bonds[id];
  if (b.talked === s.day)
    return "We have caught up today. Come back tomorrow, or stay a little longer.";
  b.talked = s.day;
  b.points = Math.min(10, b.points + 1);
  s.minutes = Math.min(1380, s.minutes + 10);
  note(s, `You and ${p.name} got a little closer.`);
  return p.chat[(s.day - 1) % p.chat.length];
}
export function gift(s: State, id: string, item: Item) {
  const p = PEOPLE.find((p) => p.id === id)!;
  const b = s.bonds[id];
  if (b.gifted === s.day)
    return `${p.name} has received your gift today. Tomorrow is another lovely day.`;
  if (s.inventory[item] < 1) return "You do not have one of those yet.";
  s.inventory[item]--;
  b.gifted = s.day;
  const loved = p.favorite === item || item === "bouquet";
  b.points = Math.min(10, b.points + (loved ? 2 : 1));
  return note(
    s,
    `${p.name}: “${loved ? "For me? You remembered. I love it." : "That is so thoughtful. Thank you!"}” ${loved ? "+2" : "+1"} affection.`,
  );
}
export function canDate(s: State, id: string) {
  return s.bonds[id].points >= 4;
}
export function date(s: State, id: string) {
  const b = s.bonds[id];
  const p = PEOPLE.find((p) => p.id === id)!;
  if (!canDate(s, id))
    return "Reach two hearts first. Chat and share a gift to grow closer.";
  if (b.dated === s.day)
    return "You have already shared a date today. There is always tomorrow.";
  b.dating = true;
  b.dated = s.day;
  b.points = Math.min(10, b.points + 2);
  s.minutes = Math.min(1380, s.minutes + 60);
  return note(
    s,
    `You and ${p.name} are dating. There is room in this story for every kind of love.`,
  );
}
export function buy(s: State, item: Crop | "bouquet") {
  const cost = item === "bouquet" ? 25 : CROPS[item].seedPrice;
  if (s.coins < cost)
    return "Not quite enough coins. Sell a harvest or some fish at the crate.";
  s.coins -= cost;
  if (item === "bouquet") s.inventory.bouquet++;
  else s.seeds[item]++;
  return note(
    s,
    item === "bouquet"
      ? "One bouquet, a whole lot of possibility."
      : `${CROPS[item].label} seeds tucked into your pocket.`,
  );
}
export function sell(s: State) {
  let earned = 0;
  for (const item of ["turnip", "strawberry", "sunflower", "fish"] as const) {
    earned += s.inventory[item] * (item === "fish" ? 18 : CROPS[item].sell);
    s.inventory[item] = 0;
  }
  s.coins += earned;
  return note(
    s,
    earned
      ? `Shipped your produce and fish for ${earned} coins. Bouquets stay in your bag.`
      : "Your crate is empty. Grow a crop or catch a fish first.",
  );
}
export function catchFish(s: State, success: boolean) {
  if (!spend(s, 5, 20)) return "Too sleepy to fish. Rest at home first.";
  if (!success)
    return note(s, "That one got away. The next fish could be your fish.");
  s.inventory.fish++;
  s.catches++;
  return note(s, "A silverfin! Gift it to Jun, or sell it for 18 coins.");
}
export function partners(s: State) {
  return PEOPLE.filter((p) => s.bonds[p.id].dating);
}
export function festival(s: State) {
  if (partners(s).length < 2)
    return "Invite at least two partners first. Then we will set the big table.";
  s.festival = true;
  return note(
    s,
    `${partners(s)
      .map((p) => p.name)
      .join(", ")} joined your garden gathering. A table full of love.`,
  );
}
export function quickStart(s: State) {
  s.coins = Math.max(s.coins, 220);
  s.inventory.bouquet = Math.max(s.inventory.bouquet, PEOPLE.length);
  s.inventory.sunflower = Math.max(s.inventory.sunflower, 3);
  s.inventory.strawberry = Math.max(s.inventory.strawberry, 3);
  s.inventory.fish = Math.max(s.inventory.fish, 2);
  s.energy = 100;
  for (const b of Object.values(s.bonds)) b.points = Math.max(b.points, 4);
  s.plots.forEach((p) => {
    if (p.crop) p.growth = CROPS[p.crop].days;
  });
  return note(
    s,
    "A little head start: crops are ripe, your bag has gifts, and everyone is ready for a first date.",
  );
}
export function restore(raw: string | null): State {
  if (!raw) return freshState();
  try {
    const s = JSON.parse(raw) as State;
    const finite = (n: unknown, min = 0, max = 100000) =>
      typeof n === "number" && Number.isFinite(n) && n >= min && n <= max;
    if (
      s.version !== 1 ||
      !finite(s.day, 1) ||
      !Number.isInteger(s.day) ||
      !finite(s.minutes, 0, 1440) ||
      !finite(s.coins) ||
      !finite(s.energy, 0, 100) ||
      !Array.isArray(s.plots) ||
      s.plots.length !== 12 ||
      !s.inventory ||
      !s.seeds ||
      !s.bonds ||
      !s.player ||
      !finite(s.player.x, 0, 1200) ||
      !finite(s.player.y, 0, 800) ||
      !finite(s.harvests) ||
      !finite(s.catches) ||
      typeof s.festival !== "boolean" ||
      !Array.isArray(s.log) ||
      !s.log.every((x) => typeof x === "string")
    )
      throw Error();
    for (const i of [
      "turnip",
      "strawberry",
      "sunflower",
      "fish",
      "bouquet",
    ] as Item[])
      if (!finite(s.inventory[i]) || !Number.isInteger(s.inventory[i]))
        throw Error();
    for (const c of Object.keys(CROPS) as Crop[])
      if (!finite(s.seeds[c]) || !Number.isInteger(s.seeds[c])) throw Error();
    for (const p of s.plots)
      if (
        typeof p.tilled !== "boolean" ||
        typeof p.watered !== "boolean" ||
        (p.crop !== null &&
          (typeof p.crop !== "string" || !Object.hasOwn(CROPS, p.crop))) ||
        !finite(p.growth, 0, 2) ||
        !Number.isInteger(p.growth)
      )
        throw Error();
    // Version 1 saves predate the seventh neighbor. Add only his missing bond;
    // malformed existing bonds still fail the normal validation below.
    if (!Object.hasOwn(s.bonds, "goblin")) {
      s.bonds.goblin = {
        points: 2,
        dating: false,
        talked: 0,
        gifted: 0,
        dated: 0,
      };
    }
    for (const p of PEOPLE) {
      const b = s.bonds[p.id];
      if (
        !b ||
        !finite(b.points, 0, 10) ||
        typeof b.dating !== "boolean" ||
        !finite(b.talked) ||
        !finite(b.gifted) ||
        !finite(b.dated)
      )
        throw Error();
    }
    return s;
  } catch {
    return freshState();
  }
}
