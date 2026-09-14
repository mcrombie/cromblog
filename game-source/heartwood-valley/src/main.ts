import "./retro.css";
import { FarmAudio } from "./audio";
import {
  CROPS,
  PEOPLE,
  freshState,
  restore,
  tend,
  sleep,
  talk,
  gift,
  canDate,
  date,
  buy,
  sell,
  catchFish,
  partners,
  festival,
  quickStart,
  type Crop,
  type Item,
  type Tool,
  type Person,
} from "./game";
import { World } from "./world";
import { registerGameTools } from "./webmcp";
document.documentElement.style.setProperty(
  "--portraits",
  "url(" + new URL("assets/portraits.png", document.baseURI).href + ")",
);
document.documentElement.style.setProperty(
  "--items",
  "url(" + new URL("assets/items.png", document.baseURI).href + ")",
);
document.documentElement.style.setProperty(
  "--goblin-portrait",
  "url(" +
    new URL("assets/lord-goblin-portrait.png", document.baseURI).href +
    ")",
);
let goblinJoke = 0;
const SAVE_KEY = "heartwood-valley-save-v1";
let loaded: string | null = null;
try {
  loaded = localStorage.getItem(SAVE_KEY);
} catch {}
let state = restore(loaded);
let selected: Tool = "water";
let seed: Crop = "turnip";
let tab = "neighbors";
let toastTimer = 0;
const music = new FarmAudio();
let notebookOpen = false;
let fishRaf = 0;
const $ = <T extends HTMLElement = HTMLElement>(q: string) =>
  document.querySelector<T>(q)!;
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const tools: { id: Tool; icon: string; name: string }[] = [
  { id: "hand", icon: "✋", name: "Interact" },
  { id: "hoe", icon: "⛏", name: "Hoe" },
  { id: "seed", icon: "🌱", name: "Plant" },
  { id: "water", icon: "🚿", name: "Water" },
  { id: "harvest", icon: "🧺", name: "Harvest" },
  { id: "fish", icon: "🎣", name: "Fish" },
];
const iconIndex: Record<string, number> = {
  hand: 0,
  hoe: 1,
  seed: 2,
  water: 3,
  harvest: 4,
  fish: 5,
  turnip: 6,
  strawberry: 7,
  sunflower: 8,
  silverfin: 9,
  bouquet: 10,
  coin: 11,
};
function itemIcon(item: string) {
  const i = iconIndex[item] ?? 0;
  return `<span class="item-icon" style="background-position:${((i % 4) * 100) / 3}% ${Math.floor(i / 4) * 50}%" aria-hidden="true"></span>`;
}
$("#app").innerHTML =
  `<header><div class="brand"><h1>Stardate Valley</h1><div class="eyebrow">The entire town is romanceable.</div></div><nav class="header-right" aria-label="Game menus"><button class="quiet-button" id="social-menu" data-notebook="neighbors" aria-expanded="false" aria-controls="notebook">♥ Social</button><button class="quiet-button" data-notebook="bag" aria-expanded="false" aria-controls="notebook">Backpack</button><button class="quiet-button" id="sound" aria-pressed="false">Music: off</button><button class="quiet-button" id="guide" aria-label="Field guide" title="Field guide">?</button></nav></header>
<main class="shell"><div class="game-layout"><section class="world-section" aria-label="Your farm and village"><div class="world-frame"><canvas id="world" tabindex="0" aria-label="Stardate Valley. Click to walk or use WASD. E interacts. Number keys select tools. Social and Garden beds offer keyboard and touch alternatives."></canvas>
<div class="quest-note"><div class="eyebrow">Grandpa’s last request</div><p>Grow turnips.<br>Date the whole town.</p><button data-notebook="neighbors" aria-controls="notebook">♥ Sweethearts: <span id="love-count">0 / ${PEOPLE.length}</span></button></div>
<div class="world-hud"><div class="season">☀ SPRING · YEAR 1</div><div class="day-line" id="day">Mon. 1</div><div class="clock-line" id="time">9:00 am</div><div class="money">${itemIcon("coin")}<span id="coins">120g</span></div></div>
<div class="energy-meter"><div class="energy-label" title="Energy">E</div><div class="energy-track" role="progressbar" aria-label="Energy" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><div class="energy-fill"></div></div><span class="small-note" id="energy-text">100</span></div>
<div class="world-hint" id="world-hint">Water the turnips. Compliment the neighbors.</div><div class="toast" id="toast" role="status" aria-live="polite"></div>
<div class="toolbar"><div class="tools" aria-label="Tools">${tools.map((t, i) => `<button class="tool ${selected === t.id ? "active" : ""}" data-tool="${t.id}" title="${t.name} (${i + 1})" aria-label="${t.name}, shortcut ${i + 1}" aria-pressed="${selected === t.id}"><span class="tool-key">${i + 1}</span><span class="tool-icon">${itemIcon(t.id)}</span><span class="tool-name">${t.name}</span></button>`).join("")}</div><div class="tool-extra"><div class="tool-label"><label for="seed">Seed pouch</label></div><select class="seed-select" id="seed"></select></div></div></div>
<div class="control-strip"><span><kbd>WASD</kbd> walk &nbsp; <kbd>E</kbd> interact &nbsp; <kbd>1–6</kbd> tools</span><div class="control-actions"><button class="quiet-button" id="farm-controls">Garden beds</button><button class="quiet-button" data-notebook="journal">Journal</button><button class="quiet-button" id="sleep">Sleep ☾</button><button class="quiet-button" data-letter>Grandpa’s letter</button><span class="mobile-actions"><button class="quiet-button" id="nearby">Interact</button></span></div><span id="save-note">Auto-saved</span><span id="save-status" class="save-label">Saved</span></div></section>
<aside class="sidebar" id="notebook" aria-label="Farm notebook" hidden><div class="notebook-heading">Farmer’s notebook <button data-close-notebook aria-label="Close notebook">×</button></div><section class="panel people-panel"><div class="tabs" role="tablist" aria-label="Notebook pages"><button class="tab active" data-tab="neighbors" role="tab" aria-selected="true" id="tab-neighbors" aria-controls="sidebar-content">Social</button><button class="tab" data-tab="bag" role="tab" aria-selected="false" id="tab-bag" aria-controls="sidebar-content">Backpack</button><button class="tab" data-tab="journal" role="tab" aria-selected="false" id="tab-journal" aria-controls="sidebar-content">Journal</button></div><div id="sidebar-content" role="tabpanel" aria-labelledby="tab-neighbors"></div></section><section class="panel gathering"><div class="eyebrow">The polycule potluck</div><h2>Scheduling: the final boss.</h2><p class="panel-sub" id="gathering-copy"></p><button class="button block" id="gathering">Host the long-table picnic</button></section></aside></div><footer class="footer-note"><span>A Stardew-inspired farm-life spoof. ${PEOPLE.length} adults. Zero exclusivity clauses.</span><a href="/games" target="_top">← Cromblog games</a></footer></main><dialog id="dialog" aria-label="Valley conversation"></dialog>`;
const world = new World($("#world"), () => state);
const dialog = $<HTMLDialogElement>("#dialog");
world.isPaused = () => dialog.open || notebookOpen;
function portrait(p: Person, cls = "") {
  if (p.id === "goblin")
    return `<div class="portrait goblin-portrait ${cls}" role="img" aria-label="${p.name}"></div>`;
  const i = PEOPLE.findIndex((x) => x.id === p.id);
  return `<div class="portrait ${cls}" style="background-position:${(i % 3) * 50}% ${Math.floor(i / 3) * 100}%" role="img" aria-label="${p.name}"></div>`;
}
function hearts(points: number) {
  return `<span aria-label="${points / 2} out of 5 hearts">${Array.from({ length: 5 }, (_, i) => (points >= i * 2 + 2 ? '<span aria-hidden="true">♥</span>' : points === i * 2 + 1 ? '<span class="half-heart" aria-hidden="true">♥</span>' : '<span class="empty-heart" aria-hidden="true">♡</span>')).join("")}</span>`;
}
function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    $("#save-status").textContent = "Saved on this device";
  } catch {
    $("#save-status").textContent = "Playing without saving";
    $("#save-note").textContent =
      "Storage is unavailable. Keep this tab open to keep playing.";
  }
}
function ping() {
  music.chime();
}
function setNotebook(open: boolean, page = tab) {
  notebookOpen = open;
  tab = page;
  $(".game-layout").classList.toggle("notebook-open", open);
  $("#notebook").hidden = !open;
  document.querySelectorAll<HTMLElement>("[data-notebook]").forEach((b) => {
    b.setAttribute("aria-expanded", String(open && b.dataset.notebook === tab));
    b.classList.toggle("active", open && b.dataset.notebook === tab);
  });
  document.querySelectorAll<HTMLElement>("[data-tab]").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === tab);
    b.setAttribute("aria-selected", String(b.dataset.tab === tab));
  });
  if (open) world.stop();
  render();
}
function toast(message: string) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(
    () => $("#toast").classList.remove("show"),
    5500,
  );
}
function change(message?: string) {
  render();
  save();
  if (message) {
    toast(message);
    ping();
  }
}
function render() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  $("#day").textContent =
    `${days[(state.day - 1) % 7].slice(0, 3)}. ${state.day}`;
  const h = Math.floor(state.minutes / 60);
  $("#time").textContent =
    `${h % 12 || 12}:${String(state.minutes % 60).padStart(2, "0")} ${h >= 12 ? "pm" : "am"}`;
  $("#coins").textContent = `${state.coins}g`;
  $("#energy-text").textContent = `${state.energy}`;
  $(".energy-fill").style.height = `${state.energy}%`;
  document.documentElement.style.setProperty(
    "--energy-ratio",
    String(state.energy / 100),
  );
  $(".energy-track").setAttribute("aria-valuenow", String(state.energy));
  $("#seed").innerHTML = (Object.keys(CROPS) as Crop[])
    .map(
      (c) =>
        `<option value="${c}" ${seed === c ? "selected" : ""}>${CROPS[c].label} · ${state.seeds[c]}</option>`,
    )
    .join("");
  $("#sidebar-content").setAttribute("aria-labelledby", `tab-${tab}`);
  if (tab === "neighbors")
    $("#sidebar-content").innerHTML = PEOPLE.map(
      (p) =>
        `<button class="neighbor neighbor-${p.id}" data-person="${p.id}" aria-label="Talk to ${p.name}, ${state.bonds[p.id].points / 2} hearts${state.bonds[p.id].dating ? ", dating" : ""}">${portrait(p)}<span class="person-info"><span class="person-name">${p.name}</span><span class="person-job" style="display:block">${p.job}</span><span class="hearts" style="display:block">${hearts(state.bonds[p.id].points)}</span></span>${state.bonds[p.id].dating ? '<span class="dating-badge">Dating</span>' : ""}</button>`,
    ).join("");
  if (tab === "bag")
    $("#sidebar-content").innerHTML =
      `<p class="panel-sub" style="margin:15px 0 5px">For gifts, supper, or the shipping crate.</p>${(Object.keys(state.inventory) as Item[]).map((i) => `<div class="bag-row"><span>${itemLabel(i)}</span><strong>${state.inventory[i]}</strong></div>`).join("")}<button class="button secondary block" data-action="shop">Visit the shop</button><button class="button secondary block" data-action="shipping">Ship produce & fish</button>`;
  if (tab === "journal")
    $("#sidebar-content").innerHTML = `${[
      [state.harvests > 0, "Bring in your first harvest"],
      [state.catches > 0, "Catch a river silverfin"],
      [partners(state).length > 0, "Share a first date"],
      [state.festival, "Host the polycule potluck"],
      [
        partners(state).length === PEOPLE.length,
        `Date the entire town (${PEOPLE.length}/${PEOPLE.length})`,
      ],
    ]
      .map(
        ([done, label]) =>
          `<div class="task ${done ? "complete" : ""}"><span class="check">${done ? "✓" : ""}</span>${label}</div>`,
      )
      .join("")}<hr class="dialog-separator">${state.log
      .slice(0, 4)
      .map((m) => `<p class="journal-line">${esc(m)}</p>`)
      .join("")}`;
  const n = partners(state).length;
  $("#love-count").textContent = `${n} / ${PEOPLE.length}`;
  $("#gathering-copy").textContent = state.festival
    ? `Your table has room for ${n} beloved ${n === 1 ? "neighbor" : "neighbors"}. Keep growing your garden and your circle.`
    : `${n} of ${PEOPLE.length} neighbors dating. Invite two or more partners for a garden celebration.`;
}
function itemLabel(i: Item) {
  return `${itemIcon(i === "fish" ? "silverfin" : i)} ${i === "fish" ? "Silverfin" : i === "bouquet" ? "Bouquet" : CROPS[i].label}`;
}
function itemName(i: Item) {
  return i === "fish"
    ? "silverfin"
    : i === "bouquet"
      ? "bouquets"
      : CROPS[i].label.toLowerCase();
}
function show(content: string, label: string, mode = "") {
  setNotebook(false);
  dialog.className = mode;
  world.stop();
  cancelAnimationFrame(fishRaf);
  dialog.innerHTML = `<button class="dialog-close" data-close aria-label="Close">×</button>${content}`;
  dialog.setAttribute("aria-label", label);
  if (!dialog.open) dialog.showModal();
}
function close() {
  cancelAnimationFrame(fishRaf);
  dialog.close();
  $("#world").focus();
}
dialog.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  if (t.closest("[data-close]")) close();
  if (t === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      close();
  }
});
dialog.addEventListener("close", () => cancelAnimationFrame(fishRaf));
function conversationFrame(p: Person, content: string) {
  return `<div class="conversation-layout ${p.id === "goblin" ? "goblin-conversation" : ""}"><aside class="conversation-portrait">${portrait(p)}<div><div class="conversation-name">${p.name}</div><div class="hearts">${hearts(state.bonds[p.id].points)}</div><div class="small-note">${p.pronouns} · ${p.age}<br>${state.bonds[p.id].dating ? "♥ Dating" : "Romanceable"}</div></div></aside><div class="conversation-body">${content}</div></div>`;
}
function personDialog(id: string, message?: string) {
  const p = PEOPLE.find((p) => p.id === id)!;
  const b = state.bonds[id];
  show(
    conversationFrame(
      p,
      `<div class="eyebrow">${p.job} · ${b.dating ? "your sweetheart" : "a very eligible neighbor"}</div><div class="quote" role="status">${esc(message ?? p.intro)}</div><div class="dialog-actions"><button class="button secondary" data-chat="${id}" ${b.talked === state.day ? "disabled" : ""}>${b.talked === state.day ? "Chatted today" : "Chat (+½ ♥)"}</button>${id === "goblin" ? '<button class="button secondary" data-goblin-joke>Say something filthy</button>' : ""}<button class="button" data-date="${id}" ${!canDate(state, id) || b.dated === state.day ? "disabled" : ""}>${b.dated === state.day ? "Dated today" : b.dating ? "Go on another date" : "Ask on a date"}${!canDate(state, id) ? " · 2 ♥" : ""}</button></div><p>Loves ${itemName(p.favorite)}. ${b.gifted === state.day ? "Gift shared today." : "One gift per day. Favorites earn a full heart."}</p><div class="gift-list">${
        (Object.keys(state.inventory) as Item[])
          .filter((i) => state.inventory[i] > 0)
          .map(
            (i) =>
              `<button class="gift-option" data-gift="${id}:${i}" ${b.gifted === state.day ? "disabled" : ""}>${itemLabel(i)} ×${state.inventory[i]}</button>`,
          )
          .join("") ||
        '<span class="small-note">No gifts in your backpack. Check the farm or the shop.</span>'
      }</div>`,
    ),
    `${p.name}, conversation`,
    "dialog-conversation",
  );
}
function dateDialog(id: string) {
  const p = PEOPLE.find((p) => p.id === id)!;
  if (!canDate(state, id) || state.bonds[id].dated === state.day) return;
  show(
    conversationFrame(
      p,
      `<div class="eyebrow">Heart event · ${p.name}</div><div class="quote">${p.date}</div><div class="dialog-actions">${p.choices.map((choice) => `<button class="button secondary" data-finish-date="${id}">${choice}</button>`).join("")}</div><p>Everyone knows this is an open relationship. No secret bouquets required.</p>`,
    ),
    `A date with ${p.name}`,
    "dialog-conversation",
  );
}
function finishDate(id: string) {
  const p = PEOPLE.find((p) => p.id === id)!;
  date(state, id);
  change();
  world.feedback("♥", "#ffb4b0");
  show(
    conversationFrame(
      p,
      `<div class="eyebrow">Heart event complete · +1 ♥</div><div class="quote">${p.ending}</div><p>${id === "goblin" ? "“You may court the whole town, darling. I am a goblin, not a fucking landlord.”" : "“Yes, I would love to date you. And I am happy for the other people in your life, too.”"}</p><button class="button" data-close>Back to farming (and flirting)</button>`,
    ),
    `You and ${p.name} are dating`,
    "dialog-conversation",
  );
  ping();
}
function shopDialog(
  message = "Seeds, bouquets, and your entire local economy. Thank you for shopping locally.",
) {
  show(
    `<div class="eyebrow">Cleo’s corner shop</div><h2>Seeds & sundries</h2><p role="status">${esc(message)}</p><p>In your pocket: <strong style="color:var(--gold)">${state.coins} coins</strong></p>${([...Object.keys(CROPS), "bouquet"] as (Crop | "bouquet")[]).map((c) => `<div class="shop-row"><span class="shop-icon">${itemIcon(c === "bouquet" ? "bouquet" : c)}</span><div class="shop-copy">${c === "bouquet" ? "A little bouquet" : CROPS[c].label + " seed"}<small>${c === "bouquet" ? "Everyone loves these. Suspiciously efficient." : `${CROPS[c].days} watered ${CROPS[c].days === 1 ? "night" : "nights"} · sells for ${CROPS[c].sell} coins`}</small></div><button class="button secondary" data-buy="${c}" ${state.coins < (c === "bouquet" ? 25 : CROPS[c].seedPrice) ? "disabled" : ""}>${c === "bouquet" ? 25 : CROPS[c].seedPrice} ◉</button></div>`).join("")}`,
    "Seeds and sundries shop",
  );
}
function sleepDialog() {
  const thirsty = state.plots.filter(
    (p) => p.crop && !p.watered && p.growth < CROPS[p.crop].days,
  ).length;
  show(
    `<div class="eyebrow">Home sweet home</div><h2>Call it a lovely day?</h2><p>Sleep restores your energy and grows every watered crop. Your neighbors will be ready for another chat and gift tomorrow.</p>${thirsty ? `<p style="color:var(--gold)">${thirsty} growing ${thirsty === 1 ? "bed still needs" : "beds still need"} water. They will wait safely for another day.</p>` : ""}<div class="dialog-actions"><button class="button secondary" data-close>Stay a little longer</button><button class="button" data-sleep>Sleep until morning ☾</button></div>`,
    "Sleep until morning",
  );
}
function letter() {
  show(
    `<div class="eyebrow">Found in the farmhouse mailbox</div><h2 class="intro-title">Welcome to Stardate Valley</h2><p class="letter-salutation">Dear overworked grandchild,</p><p>I left you my farm, twelve garden beds, and a town full of suspiciously attractive adults. Plus one goblin who claims the smell is a pheromone.</p><p>Plant something. Fall in love. Fall in love again. The land is small, but the dating pool is the entire village.</p><p class="letter-signature">Love, Grandpa</p><p class="letter-postscript">P.S. The real community bundle is a shared calendar.</p><div class="dialog-actions"><button class="button" data-close>I’ll make you proud, Grandpa</button><button class="button secondary" data-quickstart>Skip to the flirting</button></div><p class="small-note">The quick start gives you ripe crops, gifts, and date-ready neighbors. All ${PEOPLE.length} adults welcome open relationships.</p>`,
    "Grandpa’s letter",
    "dialog-letter",
  );
  try {
    localStorage.setItem("stardate-intro-v2", "yes");
  } catch {}
}
function morning() {
  const message = sleep(state);
  change();
  const ready = state.plots.filter(
    (p) => p.crop && p.growth >= CROPS[p.crop].days,
  ).length;
  show(
    `<div class="eyebrow">Another day of extremely normal farm life</div><h2>Spring, Day ${state.day}</h2><div class="day-score"><div><strong>${ready}</strong><span>Crops ready</span></div><div><strong>${partners(state).length}/${PEOPLE.length}</strong><span>Sweethearts</span></div><div><strong>100</strong><span>Energy restored</span></div></div><div class="quote">“Just one more day,” said the farmer, three dates ago.</div><p role="status">${esc(message)}</p><button class="button block" data-close>One more day</button>`,
    "A new morning",
  );
}
function gatheringDialog() {
  const ps = partners(state);
  if (ps.length < 2) {
    show(
      `<div class="eyebrow">Room for everyone</div><h2>The community’s most ambitious potluck</h2><p>The picnic begins when you are dating at least two neighbors. Reach two hearts with someone, then ask them on a date.</p><p>Already dating someone? Keep going. Every neighbor is happy with an open relationship. All ${PEOPLE.length} can be your partners at the same time.</p><button class="button block" data-close>Go make a connection</button>`,
      "Plan your picnic",
    );
    return;
  }
  const message = festival(state);
  change();
  show(
    `<div class="date-art">${itemIcon("sunflower")} ♥ ${itemIcon("sunflower")}</div><div class="eyebrow">${ps.length === PEOPLE.length ? "Everyone, together" : "The polycule potluck"}</div><h2>${ps.length === PEOPLE.length ? "The whole town. One shared calendar." : "A potluck, with extra plus-ones."}</h2><div class="group-portraits">${ps.map((p) => portrait(p)).join("")}</div><p>${esc(message)}</p><p>${ps.some((p) => p.id === "goblin") ? "Lord Goblin brings a mystery casserole. The mystery is why it is swearing. " : ""}There are flowers on the table, stories in the air, and enough chairs for everyone. Nobody has to be your only person to be your favorite person.</p><div class="quote">${ps.length === PEOPLE.length ? "Achievement unlocked: The Whole Dating Pool. Grandpa would be proud. And deeply confused by the calendar." : "This is your kind of happily ever after. And there is still room for more."}</div><button class="button block" data-close>Stay a little longer in Heartwood</button>`,
    "The polycule potluck",
  );
  ping();
}
function fishDialog() {
  if (state.energy < 5) {
    toast("A little too sleepy to fish. Rest at home first.");
    return;
  }
  show(
    `<div class="eyebrow">A quiet moment by the river</div><h2>Something took the bait!</h2><p>Press <kbd>Space</kbd> or Reel in when the white line is inside the green patch. Take as long as you like.</p><div class="fish-track" aria-hidden="true"><div class="fish-zone"></div><div class="fish-marker" id="fish-marker"></div></div><div role="status" id="fish-status" class="small-note" style="display:block;min-height:20px"></div><button class="button block" id="reel">Reel in</button><button class="button secondary block" id="patient-fish">Fish patiently · guaranteed catch</button><p class="small-note" style="display:block">Either method costs 5 energy. A silverfin sells for 18 coins.</p>`,
    "Catch a silverfin",
  );
  let position = 0;
  let finished = false;
  const start = performance.now();
  const tick = (t: number) => {
    position = ((Math.sin((t - start) / 750) + 1) / 2) * 100;
    const el = document.getElementById("fish-marker");
    if (!el) return;
    el.style.left = `${position}%`;
    $("#fish-status").textContent =
      position >= 37 && position <= 63
        ? "Now! The line is in the green patch."
        : "Wait for the green patch…";
    fishRaf = requestAnimationFrame(tick);
  };
  fishRaf = requestAnimationFrame(tick);
  function reel(success: boolean) {
    if (finished) return;
    finished = true;
    close();
    change(catchFish(state, success));
  }
  $("#reel").onclick = () => reel(position >= 37 && position <= 63);
  $("#patient-fish").onclick = () => reel(true);
}
function guide() {
  show(
    `<div class="eyebrow">Your pocket field guide</div><h2>Welcome to Stardate Valley.</h2><p>You inherited a farm. Somehow, the whole town became a dating app. A tiny Stardew-inspired spoof with a much bigger dating pool.</p><div class="instructions"><span class="step">1</span><div><b>Grow something.</b> Four turnips are already planted. Select Water, click each bed, then sleep. Harvest the next morning. Hoe → plant → water → sleep → harvest.</div><span class="step">2</span><div><b>Get a little closer.</b> Click a neighbor or their portrait. Lord Goblin theTurd lurks in the lower-left corner, beside the farm. Chat once a day, share gifts, and ask for a date at two hearts. A favorite gift goes a long way.</div><span class="step">3</span><div><b>Make room for everyone.</b> All ${PEOPLE.length} adults are open to polyamorous relationships. Date as many as you like, then invite your partners to the long-table picnic.</div><span class="step">4</span><div><b>Wander.</b> Click to walk, or use WASD / arrow keys and E. Visit the shop for seeds and bouquets, ship your harvests, and fish by the bridge.</div></div><button class="button block" data-close>Let’s see what grows</button><hr class="dialog-separator"><h2 style="font-size:22px">Only have five minutes?</h2><p>Get ripe crops, a bag of gifts, and enough hearts to take every neighbor on a first date. Your existing progress stays with you.</p><button class="button secondary block" data-quickstart>Give me a little head start ✦</button><p class="small-note" style="display:block">Progress saves in this browser. Time moves when you act, and unwatered crops wait safely for you. No rush, no penalties.</p><button class="quiet-button" data-reset style="margin-top:12px">Start a new farm</button>`,
    "Heartwood field guide",
  );
}
function gardenDialog() {
  show(
    `<div class="eyebrow">Your twelve little beginnings</div><h2>Garden beds</h2><p>Current tool: <strong>${tools.find((t) => t.id === selected)!.name}</strong>${selected === "seed" ? ` · ${CROPS[seed].label}` : ""}. Choose a tool below, then a bed.</p><label class="garden-seed-label">Seeds <select class="seed-select" id="garden-seed">${(Object.keys(CROPS) as Crop[]).map((c) => `<option value="${c}" ${c === seed ? "selected" : ""}>${CROPS[c].label} · ${state.seeds[c]}</option>`).join("")}</select></label><div class="gift-list">${tools
      .filter((t) => t.id !== "fish")
      .map(
        (t) =>
          `<button class="gift-option" data-garden-tool="${t.id}" aria-pressed="${selected === t.id}">${itemIcon(t.id)} ${t.name}</button>`,
      )
      .join(
        "",
      )}</div><div class="garden-grid">${state.plots.map((p, i) => `<button class="gift-option" data-bed="${i}">Bed ${i + 1}<br><span style="display:block;font-size:12px;line-height:1.5;margin-top:4px">${p.crop ? `${itemIcon(p.crop)} ${CROPS[p.crop].label}<br>${p.growth >= CROPS[p.crop].days ? "Ready!" : p.watered ? "Watered ✓" : "Needs water"}` : p.tilled ? "Ready to plant" : "Needs tilling"}</span></button>`).join("")}</div><p class="small-note" id="garden-message" role="status" style="display:block"></p>`,
    "Garden bed controls",
  );
}
function selectTool(id: Tool) {
  selected = id;
  world.setTool(id);
  $("#world-hint").textContent = {
    hand: "Click a neighbor, crop, or marked place.",
    hoe: "Click an empty bed to till the soil.",
    seed: "Choose seeds, then click a tilled bed.",
    water: "Click a planted bed. Crops grow after a watered night.",
    harvest: "Click a ripe crop to collect it.",
    fish: "Click the river marker, or press F to cast.",
  }[id];
  document.querySelectorAll<HTMLElement>("[data-tool]").forEach((b) => {
    b.classList.toggle("active", b.dataset.tool === id);
    b.setAttribute("aria-pressed", String(b.dataset.tool === id));
  });
}
document.addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>("button");
  if (!b || b.hasAttribute("disabled")) return;
  const d = b.dataset;
  if (d.notebook) {
    setNotebook(!(notebookOpen && tab === d.notebook), d.notebook);
    return;
  }
  if ("closeNotebook" in d) {
    setNotebook(false);
    $("#world").focus();
    return;
  }
  if ("letter" in d) {
    letter();
    return;
  }
  if (d.tool) {
    selectTool(d.tool as Tool);
    if (d.tool === "fish")
      toast("Click the fishing spot below the bridge, or press F to fish.");
  }
  if (d.tab) {
    tab = d.tab;
    document.querySelectorAll<HTMLElement>("[data-tab]").forEach((t) => {
      t.classList.toggle("active", t.dataset.tab === tab);
      t.setAttribute("aria-selected", String(t.dataset.tab === tab));
    });
    render();
  }
  if ("goblinJoke" in d) {
    const goblin = PEOPLE.find((p) => p.id === "goblin")!;
    personDialog("goblin", goblin.chat[goblinJoke++ % goblin.chat.length]);
    return;
  }
  if (d.person) personDialog(d.person);
  if (d.chat) {
    const message = talk(state, d.chat);
    change();
    personDialog(d.chat, message);
  }
  if (d.gift) {
    const [id, item] = d.gift.split(":");
    const message = gift(state, id, item as Item);
    change();
    personDialog(id, message);
    ping();
  }
  if (d.date) dateDialog(d.date);
  if (d.finishDate) finishDate(d.finishDate);
  if (d.buy) {
    const message = buy(state, d.buy as Crop | "bouquet");
    change();
    shopDialog(message);
  }
  if ("sleep" in d) {
    morning();
  }
  if ("quickstart" in d) {
    close();
    change(quickStart(state));
  }
  if ("reset" in d)
    show(
      '<div class="eyebrow">A fresh beginning</div><h2>Start a new farm?</h2><p>This replaces the farm saved in this browser, including crops, gifts, and relationships.</p><div class="dialog-actions"><button class="button secondary" data-close>Keep my farm</button><button class="button" data-confirm-reset>Start fresh</button></div>',
      "Start a new farm",
    );
  if ("confirmReset" in d) {
    state = freshState();
    world.stop();
    close();
    change("A new farm and a world of possibilities.");
  }
  if (d.action === "shop") shopDialog();
  if (d.action === "shipping") shippingDialog();
  if (d.gardenTool) {
    selectTool(d.gardenTool as Tool);
    gardenDialog();
  }
  if (d.bed !== undefined) {
    const message = tend(state, Number(d.bed), selected, seed);
    change();
    gardenDialog();
    $("#garden-message").textContent = message;
  }
  if ("sell" in d) {
    close();
    change(sell(state));
  }
});
function shippingDialog() {
  show(
    `<div class="eyebrow">Fresh from the farm</div><h2>The shipping crate</h2><p>Sell all harvested crops and fish. Bouquets and seeds stay in your bag. Set aside any gifts before you ship.</p>${(["turnip", "strawberry", "sunflower", "fish"] as const).map((i) => `<div class="bag-row"><span>${itemLabel(i)} × ${state.inventory[i]}</span><span>${state.inventory[i] * (i === "fish" ? 18 : CROPS[i].sell)} ◉</span></div>`).join("")}<button class="button block" data-sell>Ship produce & fish</button>`,
    "Shipping crate",
  );
}
world.setTool(selected);
world.onInteract = (t) => {
  if (t.kind === "person") personDialog(t.id);
  if (t.kind === "plot") {
    const before = state.energy;
    const message = tend(state, Number(t.id), selected, seed);
    if (state.energy < before)
      world.feedback(
        selected === "water"
          ? "Watered!"
          : selected === "harvest" || selected === "hand"
            ? "+1 crop"
            : selected === "seed"
              ? "Planted!"
              : "Tilled!",
        selected === "water" ? "#bbebff" : "#fff1ad",
        Number(t.id),
      );
    change(message);
  }
  if (t.kind === "place") {
    if (t.id === "home") sleepDialog();
    if (t.id === "shop") shopDialog();
    if (t.id === "shipping") shippingDialog();
    if (t.id === "river") fishDialog();
    if (t.id === "gathering") gatheringDialog();
  }
};
$("#guide").onclick = guide;
$("#sleep").onclick = sleepDialog;
$("#gathering").onclick = gatheringDialog;
$("#nearby").onclick = () => world.interactNearby();
$("#farm-controls").onclick = gardenDialog;
$<HTMLSelectElement>("#seed").onchange = (e) => {
  seed = (e.target as HTMLSelectElement).value as Crop;
  selectTool("seed");
};
$("#sound").onclick = async () => {
  const enabled = await music.toggle();
  $("#sound").textContent = enabled ? "Music: on" : "Music: off";
  $("#sound").setAttribute("aria-pressed", String(enabled));
};
document.addEventListener("change", (e) => {
  if ((e.target as HTMLElement).id === "garden-seed") {
    seed = (e.target as HTMLSelectElement).value as Crop;
    selectTool("seed");
    gardenDialog();
  }
});
window.addEventListener("keydown", (e) => {
  if (notebookOpen && e.key === "Escape") {
    setNotebook(false);
    $("#world").focus();
    return;
  }
  if (dialog.open) {
    if (
      e.code === "Space" &&
      document.getElementById("reel") &&
      !e.repeat &&
      !(e.target as HTMLElement).closest("button,a,input,select,textarea")
    ) {
      e.preventDefault();
      $("#reel").click();
    }
    return;
  }
  if (
    (e.target as HTMLElement).closest(
      "button,a,input,select,textarea,[contenteditable=true]",
    )
  )
    return;
  const n = Number(e.key);
  if (n >= 1 && n <= 6) {
    selectTool(tools[n - 1].id);
    e.preventDefault();
  }
  if (e.key.toLowerCase() === "f") {
    fishDialog();
    e.preventDefault();
  }
  if (e.key.toLowerCase() === "j") {
    setNotebook(!notebookOpen, "journal");
    e.preventDefault();
  }
  if (e.key === "?") {
    guide();
    e.preventDefault();
  }
});
window.addEventListener("pagehide", save);
render();
save();
let introSeen = false;
try {
  introSeen = localStorage.getItem("stardate-intro-v2") === "yes";
} catch {}
if (!introSeen) letter();
registerGameTools(
  () => state,
  (beds, tool, crop) => {
    const messages = beds.map((i) => tend(state, i, tool, crop));
    change(messages.at(-1));
    return messages;
  },
  () => {
    const message = sleep(state);
    change(message);
    return message;
  },
);
