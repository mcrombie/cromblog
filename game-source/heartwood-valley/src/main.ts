import "./style.css";
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
let sound = false;
let audio: AudioContext | null = null;
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
$("#app").innerHTML =
  `<header><div class="brand"><span class="brand-mark" aria-hidden="true">❧</span><div><div class="eyebrow">A little farm. A lot of love.</div><h1>Heartwood Valley</h1></div></div><div class="header-right"><span class="small-note save-label" id="save-status">Saved on this device</span><button class="quiet-button" id="sound" aria-pressed="false" title="Toggle sound">Sound off</button><button class="quiet-button" id="guide">Field guide <span aria-hidden="true">?</span></button></div></header>
<main class="shell"><div class="game-layout"><section class="world-section" aria-label="Your farm and village"><div class="world-frame"><canvas id="world" tabindex="0" aria-label="Heartwood Valley. Use WASD or arrow keys to walk, E to interact. Use the neighbor list, field guide, and keyboard farm controls for accessible actions."></canvas><div class="world-hud"><div class="season">☀ SPRING · YEAR 1</div><div class="day-line" id="day">Monday, 1</div><div class="clock-line" id="time">9:00 am</div></div><div class="location-label">✦ Heartwood village</div><div class="world-hint">Click to wander · Click a neighbor to say hello</div><div class="toast" id="toast" role="status" aria-live="polite"></div></div><div class="toolbar"><div class="tools" aria-label="Tools">${tools.map((t, i) => `<button class="tool ${selected === t.id ? "active" : ""}" data-tool="${t.id}" aria-label="${t.name}, shortcut ${i + 1}" aria-pressed="${selected === t.id}"><span class="tool-key">${i + 1}</span><span class="tool-icon" aria-hidden="true">${t.icon}</span><span class="tool-name">${t.name}</span></button>`).join("")}</div><div class="tool-extra"><div class="tool-label"><label for="seed">In your seed pouch</label></div><select class="seed-select" id="seed"></select></div></div><div class="control-strip"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move &nbsp; <kbd>E</kbd> interact &nbsp; <kbd>1</kbd>–<kbd>6</kbd> tools</span><div class="mobile-actions"><button class="quiet-button" id="nearby">Interact</button></div><button class="quiet-button" id="farm-controls">Garden beds</button><span id="save-note">Your progress is saved automatically.</span></div></section>
<aside class="sidebar" aria-label="Your farm journal"><section class="panel resource-panel"><div class="resources"><span class="money" id="coins">◉ 120</span><span class="small-note">in your pocket</span></div><div class="energy-wrap"><div class="energy-label"><span>Energy</span><span id="energy-text">100 / 100</span></div><div class="energy-track" role="progressbar" aria-label="Energy" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><div class="energy-fill"></div></div></div><button class="button secondary block" id="sleep">☾ &nbsp; Sleep & save</button></section><section class="panel people-panel"><div class="tabs" role="tablist" aria-label="Journal sections"><button class="tab active" data-tab="neighbors" role="tab" aria-selected="true" id="tab-neighbors" aria-controls="sidebar-content">Neighbors</button><button class="tab" data-tab="bag" role="tab" aria-selected="false" id="tab-bag" aria-controls="sidebar-content">Bag</button><button class="tab" data-tab="journal" role="tab" aria-selected="false" id="tab-journal" aria-controls="sidebar-content">Journal</button></div><div id="sidebar-content" role="tabpanel" aria-labelledby="tab-neighbors"></div></section><section class="panel gathering"><div class="eyebrow">Room for everyone</div><h2>The long-table picnic</h2><p class="panel-sub" id="gathering-copy">Good food. Favorite people. Invite two or more partners to a little celebration.</p><button class="button block" id="gathering">Plan a gathering <span aria-hidden="true">♡</span></button></section></aside></div><footer class="footer-note"><span>An original farming & romance daydream · Every neighbor is an adult; every relationship is openly shared.</span><span><a href="/games" target="_top" style="color:inherit">← Cromblog games</a> &nbsp;·&nbsp; Take your time. Love grows here.</span></footer></main><dialog id="dialog" aria-label="Valley conversation"></dialog>`;
const world = new World($("#world"), () => state);
const dialog = $<HTMLDialogElement>("#dialog");
world.isPaused = () => dialog.open;
function portrait(p: Person, cls = "") {
  const i = PEOPLE.findIndex((x) => x.id === p.id);
  return `<div class="portrait ${cls}" style="background-position:${(i % 3) * 50}% ${Math.floor(i / 3) * 100}%" role="img" aria-label="${p.name}"></div>`;
}
function hearts(points: number) {
  return `<span aria-label="${points / 2} out of 5 hearts">${Array.from({ length: 5 }, (_, i) => (i < Math.floor(points / 2) ? "♥" : `<span class="empty-heart">♡</span>`)).join("")}</span>`;
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
  if (!sound) return;
  try {
    audio ??= new AudioContext();
    void audio.resume();
    const o = audio.createOscillator(),
      gain = audio.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(659, audio.currentTime);
    o.frequency.exponentialRampToValueAtTime(880, audio.currentTime + 0.14);
    gain.gain.setValueAtTime(0.04, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.3);
    o.connect(gain);
    gain.connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.32);
  } catch {}
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
  $("#day").textContent = `${days[(state.day - 1) % 7]}, ${state.day}`;
  const h = Math.floor(state.minutes / 60);
  $("#time").textContent =
    `${h % 12 || 12}:${String(state.minutes % 60).padStart(2, "0")} ${h >= 12 ? "pm" : "am"}`;
  $("#coins").textContent = `◉ ${state.coins}`;
  $("#energy-text").textContent = `${state.energy} / 100`;
  $(".energy-fill").style.width = `${state.energy}%`;
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
        `<button class="neighbor" data-person="${p.id}" aria-label="Talk to ${p.name}, ${state.bonds[p.id].points / 2} hearts${state.bonds[p.id].dating ? ", dating" : ""}">${portrait(p)}<span class="person-info"><span class="person-name">${p.name}</span><span class="person-job" style="display:block">${p.job}</span><span class="hearts" style="display:block">${hearts(state.bonds[p.id].points)}</span></span>${state.bonds[p.id].dating ? '<span class="dating-badge">Dating</span>' : ""}</button>`,
    ).join("");
  if (tab === "bag")
    $("#sidebar-content").innerHTML =
      `<p class="panel-sub" style="margin:15px 0 5px">For gifts, supper, or the shipping crate.</p>${(Object.keys(state.inventory) as Item[]).map((i) => `<div class="bag-row"><span>${itemLabel(i)}</span><strong>${state.inventory[i]}</strong></div>`).join("")}<button class="button secondary block" data-action="shop">Visit the shop</button><button class="button secondary block" data-action="shipping">Ship produce & fish</button>`;
  if (tab === "journal")
    $("#sidebar-content").innerHTML = `${[
      [state.harvests > 0, "Bring in your first harvest"],
      [state.catches > 0, "Catch a river silverfin"],
      [partners(state).length > 0, "Share a first date"],
      [state.festival, "Host a long-table picnic"],
      [partners(state).length === 6, "Date all six neighbors"],
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
  $("#gathering-copy").textContent = state.festival
    ? `Your table has room for ${n} beloved ${n === 1 ? "neighbor" : "neighbors"}. Keep growing your garden and your circle.`
    : `${n} of 6 neighbors dating. Invite two or more partners for a garden celebration.`;
}
function itemLabel(i: Item) {
  return i === "fish"
    ? "🐟 Silverfin"
    : i === "bouquet"
      ? "💐 Bouquet"
      : `${CROPS[i].icon} ${CROPS[i].label}`;
}
function show(content: string, label: string) {
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
function personDialog(id: string, message?: string) {
  const p = PEOPLE.find((p) => p.id === id)!;
  const b = state.bonds[id];
  show(
    `<div class="dialog-heading">${portrait(p)}<div><div class="eyebrow">${p.job}</div><h2>${p.name}</h2><div class="small-note" style="display:block">${p.pronouns} · ${p.age} years old ${b.dating ? "· ♥ Dating" : ""}</div><div class="hearts">${hearts(b.points)}</div></div></div><div class="quote" role="status">${esc(message ?? p.intro)}</div><p style="font-size:13px">Loves ${itemLabel(p.favorite).toLowerCase()}. ${b.dating ? "Happy to share an open relationship." : "Open to a relationship with you and room for other partners."}</p><div class="dialog-actions"><button class="button secondary" data-chat="${id}" ${b.talked === state.day ? "disabled" : ""}>${b.talked === state.day ? "Chatted today" : "Have a chat · +½ ♥"}</button><button class="button" data-date="${id}" ${!canDate(state, id) || b.dated === state.day ? "disabled" : ""}>${b.dated === state.day ? "Dated today" : b.dating ? "Spend time together" : "Ask on a date"} ${!canDate(state, id) ? "· 2 ♥" : ""}</button></div><p style="font-size:13px;margin-bottom:7px">${b.gifted === state.day ? "Gift shared today. Come back tomorrow." : "Give a gift · favorites earn a full heart"}</p><div class="gift-list">${
      (Object.keys(state.inventory) as Item[])
        .filter((i) => state.inventory[i] > 0)
        .map(
          (i) =>
            `<button class="gift-option" data-gift="${id}:${i}" ${b.gifted === state.day ? "disabled" : ""}>${itemLabel(i)} <span class="small-note" style="display:inline">×${state.inventory[i]}</span></button>`,
        )
        .join("") ||
      '<span class="small-note" style="display:block">Your bag is empty. Grow a crop or visit the shop.</span>'
    }</div>`,
    `${p.name}, conversation`,
  );
}
function dateDialog(id: string) {
  const p = PEOPLE.find((p) => p.id === id)!;
  if (!canDate(state, id) || state.bonds[id].dated === state.day) return;
  show(
    `<div class="date-art">${{ rowan: "🌳", cleo: "🍰", jun: "🏮", iris: "🎶", mateo: "🪵", maeve: "✨" }[id]}</div><div class="eyebrow" style="text-align:center">A little time for two</div><h2 style="text-align:center">An afternoon with ${p.name}</h2><p>${p.date}</p><div class="dialog-actions">${p.choices.map((choice) => `<button class="button secondary" data-finish-date="${id}">${choice}</button>`).join("")}</div><p class="small-note" style="text-align:center;display:block">Every partner knows this is an open relationship. Everyone gets a say.</p>`,
    `A date with ${p.name}`,
  );
}
function finishDate(id: string) {
  const p = PEOPLE.find((p) => p.id === id)!;
  const message = date(state, id);
  change();
  show(
    `<div class="date-art">♡</div><div class="eyebrow">Something lovely is growing</div><h2>You & ${p.name}</h2><p>${p.ending}</p><div class="quote">“Yes, I would love to be with you. And I am happy for the other people in your life, too.”</div><p>${esc(message)}</p><button class="button block" data-close>Back to the valley</button>`,
    `You and ${p.name} are dating`,
  );
  ping();
}
function shopDialog(
  message = "Fresh seeds, thoughtful gifts, and absolutely unsolicited baking advice.",
) {
  show(
    `<div class="eyebrow">Cleo’s corner shop</div><h2>Seeds & sundries</h2><p role="status">${esc(message)}</p><p>In your pocket: <strong style="color:var(--gold)">${state.coins} coins</strong></p>${([...Object.keys(CROPS), "bouquet"] as (Crop | "bouquet")[]).map((c) => `<div class="shop-row"><span class="shop-icon">${c === "bouquet" ? "💐" : CROPS[c].icon}</span><div class="shop-copy">${c === "bouquet" ? "A little bouquet" : CROPS[c].label + " seed"}<small>${c === "bouquet" ? "A gift everyone loves" : `${CROPS[c].days} watered ${CROPS[c].days === 1 ? "night" : "nights"} · sells for ${CROPS[c].sell} coins`}</small></div><button class="button secondary" data-buy="${c}" ${state.coins < (c === "bouquet" ? 25 : CROPS[c].seedPrice) ? "disabled" : ""}>${c === "bouquet" ? 25 : CROPS[c].seedPrice} ◉</button></div>`).join("")}`,
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
function gatheringDialog() {
  const ps = partners(state);
  if (ps.length < 2) {
    show(
      `<div class="eyebrow">Room for everyone</div><h2>A bigger kind of love</h2><p>The picnic begins when you are dating at least two neighbors. Reach two hearts with someone, then ask them on a date.</p><p>Already dating someone? Keep going. Every neighbor is happy with an open relationship. All six can be your partners at the same time.</p><button class="button block" data-close>Go make a connection</button>`,
      "Plan your picnic",
    );
    return;
  }
  const message = festival(state);
  change();
  show(
    `<div class="date-art">🌻 ♡ 🌻</div><div class="eyebrow">${ps.length === 6 ? "Everyone, together" : "Your long-table picnic"}</div><h2>Love is a very big table.</h2><div style="display:flex;gap:8px;flex-wrap:wrap;margin:20px 0">${ps.map((p) => portrait(p)).join("")}</div><p>${esc(message)}</p><p>Cleo brings something sweet. There are flowers on the table, stories in the air, and enough chairs for everyone. Nobody has to be your only person to be your favorite person.</p><div class="quote">${ps.length === 6 ? "Six relationships. One very full heart. You have brought the whole village together." : "This is your kind of happily ever after. And there is still room for more."}</div><button class="button block" data-close>Stay a little longer in Heartwood</button>`,
    "Your long-table picnic",
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
    `<div class="eyebrow">Your pocket field guide</div><h2>Welcome to Heartwood.</h2><p>A small farm, six very eligible neighbors, and no reason to choose just one. Make a home at your own pace.</p><div class="instructions"><span class="step">1</span><div><b>Grow something.</b> Four turnips are already planted. Select Water, click each bed, then sleep. Harvest the next morning. Hoe → plant → water → sleep → harvest.</div><span class="step">2</span><div><b>Get a little closer.</b> Click a neighbor or their portrait. Chat once a day, share gifts, and ask for a date at two hearts. A favorite gift goes a long way.</div><span class="step">3</span><div><b>Make room for everyone.</b> All six adults are open to polyamorous relationships. Date as many as you like, then invite your partners to the long-table picnic.</div><span class="step">4</span><div><b>Wander.</b> Click to walk, or use WASD / arrow keys and E. Visit the shop for seeds and bouquets, ship your harvests, and fish by the bridge.</div></div><button class="button block" data-close>Let’s see what grows</button><hr class="dialog-separator"><h2 style="font-size:22px">Only have five minutes?</h2><p>Get ripe crops, a bag of gifts, and enough hearts to take every neighbor on a first date. Your existing progress stays with you.</p><button class="button secondary block" data-quickstart>Give me a little head start ✦</button><p class="small-note" style="display:block">Progress saves in this browser. Time moves when you act, and unwatered crops wait safely for you. No rush, no penalties.</p><button class="quiet-button" data-reset style="margin-top:12px">Start a new farm</button>`,
    "Heartwood field guide",
  );
}
function gardenDialog() {
  show(
    `<div class="eyebrow">Your twelve little beginnings</div><h2>Garden beds</h2><p>Current tool: <strong>${tools.find((t) => t.id === selected)!.name}</strong>${selected === "seed" ? ` · ${CROPS[seed].label}` : ""}. Choose a tool below, then a bed.</p><div class="gift-list">${tools
      .filter((t) => t.id !== "fish")
      .map(
        (t) =>
          `<button class="gift-option" data-garden-tool="${t.id}" aria-pressed="${selected === t.id}">${t.icon} ${t.name}</button>`,
      )
      .join(
        "",
      )}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:18px">${state.plots.map((p, i) => `<button class="gift-option" data-bed="${i}">Bed ${i + 1}<br><span style="display:block;font-size:12px;line-height:1.5;margin-top:4px">${p.crop ? `${CROPS[p.crop].icon} ${CROPS[p.crop].label}<br>${p.growth >= CROPS[p.crop].days ? "Ready!" : p.watered ? "Watered ✓" : "Needs water"}` : p.tilled ? "Ready to plant" : "Needs tilling"}</span></button>`).join("")}</div><p class="small-note" id="garden-message" role="status" style="display:block"></p>`,
    "Garden bed controls",
  );
}
function selectTool(id: Tool) {
  selected = id;
  document.querySelectorAll<HTMLElement>("[data-tool]").forEach((b) => {
    b.classList.toggle("active", b.dataset.tool === id);
    b.setAttribute("aria-pressed", String(b.dataset.tool === id));
  });
}
document.addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>("button");
  if (!b || b.hasAttribute("disabled")) return;
  const d = b.dataset;
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
    close();
    change(sleep(state));
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
world.onInteract = (t) => {
  if (t.kind === "person") personDialog(t.id);
  if (t.kind === "plot") change(tend(state, Number(t.id), selected, seed));
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
$("#sound").onclick = () => {
  sound = !sound;
  $("#sound").textContent = sound ? "Sound on" : "Sound off";
  $("#sound").setAttribute("aria-pressed", String(sound));
  ping();
};
window.addEventListener("keydown", (e) => {
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
  if (e.key === "?") {
    guide();
    e.preventDefault();
  }
});
window.addEventListener("pagehide", save);
render();
save();
if (!loaded)
  toast(
    "Welcome home! Four turnips need watering. Click the beds, or open the Field guide.",
  );
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
