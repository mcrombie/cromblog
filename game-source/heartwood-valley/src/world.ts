import { CROPS, PEOPLE, type Crop, type State, type Tool } from "./game";
export const POSITIONS: Record<string, { x: number; y: number }> = {
  rowan: { x: 286, y: 375 },
  cleo: { x: 629, y: 231 },
  jun: { x: 1020, y: 355 },
  iris: { x: 902, y: 252 },
  mateo: { x: 655, y: 500 },
  maeve: { x: 823, y: 565 },
  goblin: { x: 80, y: 590 },
  crombot: { x: 740, y: 350 },
};
export const PLACES = [
  { id: "home", name: "Your cottage", x: 216, y: 218, icon: "☾" },
  { id: "shop", name: "Seeds & sundries", x: 586, y: 234, icon: "✦" },
  { id: "shipping", name: "Shipping crate", x: 435, y: 377, icon: "▣" },
  { id: "river", name: "Fishing spot", x: 1018, y: 412, icon: "≈" },
  { id: "gathering", name: "The long table", x: 744, y: 545, icon: "♡" },
];
export const plotPosition = (i: number) => ({
  x: 174 + (i % 4) * 62,
  y: 438 + Math.floor(i / 4) * 47,
});
type Point = { x: number; y: number };
type Target = { kind: "person" | "plot" | "place"; id: string };
const WALK_AREAS = [
  [20, 320, 1200, 372],
  [174, 205, 231, 345],
  [563, 204, 652, 345],
  [873, 225, 940, 345],
  [482, 331, 545, 784],
  [141, 412, 411, 566],
  [398, 371, 520, 478],
  [538, 449, 640, 555],
  [567, 458, 911, 618],
  [967, 328, 1045, 438],
  [260, 356, 323, 410],
  [150, 548, 177, 607],
  [65, 588, 172, 607],
];
export function walkable(x: number, y: number) {
  return WALK_AREAS.some(
    ([l, t, r, b]) => x >= l && x <= r && y >= t && y <= b,
  );
}
function nearest(p: Point): Point {
  let best = { x: 500, y: 340 },
    d = Infinity;
  for (let y = 10; y < 790; y += 10)
    for (let x = 10; x < 1200; x += 10) {
      if (walkable(x, y)) {
        const dist = (x - p.x) ** 2 + (y - p.y) ** 2;
        if (dist < d) {
          best = { x, y };
          d = dist;
        }
      }
    }
  return best;
}
export function findPath(start: Point, end: Point): Point[] {
  const a = nearest(start),
    b = nearest(end),
    key = (p: Point) => `${p.x},${p.y}`;
  const queue = [a],
    came = new Map<string, Point | null>([[key(a), null]]);
  let cursor = 0;
  while (cursor < queue.length) {
    const c = queue[cursor++];
    if (c.x === b.x && c.y === b.y) {
      const out: Point[] = [];
      let p: Point | null = c;
      while (p) {
        out.unshift(p);
        p = came.get(key(p)) ?? null;
      }
      return out.slice(1);
    }
    for (const [dx, dy] of [
      [10, 0],
      [-10, 0],
      [0, 10],
      [0, -10],
    ]) {
      const n = { x: c.x + dx, y: c.y + dy };
      if (walkable(n.x, n.y) && !came.has(key(n))) {
        came.set(key(n), c);
        queue.push(n);
      }
    }
  }
  return [];
}
export class World {
  private ctx: CanvasRenderingContext2D;
  private map = new Image();
  private characters = new Image();
  private goblin = new Image();
  private crombot = new Image();
  private items = new Image();
  private selectedTool: Tool = "water";
  private facingUp = false;
  private facingLeft = false;
  private effects: {
    x: number;
    y: number;
    start: number;
    text: string;
    color: string;
  }[] = [];
  private path: Point[] = [];
  private pending: Target | null = null;
  private keys = new Set<string>();
  private last = 0;
  private raf = 0;
  private hover: Target | null = null;
  private mouse: Point | null = null;
  private step = 0;
  onInteract: (target: Target) => void = () => {};
  isPaused: () => boolean = () => false;
  constructor(
    private canvas: HTMLCanvasElement,
    private getState: () => State,
  ) {
    this.ctx = canvas.getContext("2d")!;
    canvas.width = 1200;
    canvas.height = 800;
    this.map.src = new URL("assets/village-map.png", document.baseURI).href;
    this.characters.src = new URL(
      "assets/characters.png",
      document.baseURI,
    ).href;
    this.goblin.src = new URL("assets/lord-goblin.png", document.baseURI).href;
    this.crombot.src = new URL("assets/crombot.png", document.baseURI).href;
    this.items.src = new URL("assets/items.png", document.baseURI).href;
    this.ctx.imageSmoothingEnabled = false;
    canvas.addEventListener("pointermove", (e) => {
      this.mouse = this.coords(e);
      this.hover = this.hit(this.mouse);
      canvas.style.cursor = this.hover ? "pointer" : "crosshair";
    });
    canvas.addEventListener("pointerleave", () => {
      this.hover = null;
      this.mouse = null;
    });
    canvas.addEventListener("pointerdown", (e) => {
      if (this.isPaused()) return;
      canvas.focus();
      const point = this.coords(e);
      const hit = this.hit(point);
      if (hit) this.visit(hit);
      else {
        this.path = findPath(this.getState().player, point);
        this.pending = null;
      }
    });
    window.addEventListener("keydown", (e) => {
      if (
        this.isPaused() ||
        (e.target as HTMLElement).closest(
          "button,a,input,select,textarea,[contenteditable=true]",
        )
      )
        return;
      const k = e.key.toLowerCase();
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowleft",
          "arrowdown",
          "arrowright",
          "e",
          " ",
        ].includes(k)
      ) {
        e.preventDefault();
        if (k === "e" || k === " ") {
          if (!e.repeat) this.interactNearby();
        } else {
          this.keys.add(k);
          this.path = [];
          this.pending = null;
        }
      }
    });
    window.addEventListener("keyup", (e) =>
      this.keys.delete(e.key.toLowerCase()),
    );
    window.addEventListener("blur", () => this.keys.clear());
    document.addEventListener("visibilitychange", () => this.keys.clear());
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }
  private coords(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 1200,
      y: ((e.clientY - r.top) / r.height) * 800,
    };
  }
  private hit(p: Point): Target | null {
    for (const person of PEOPLE) {
      const pos = POSITIONS[person.id];
      if (
        person.id === "crombot" &&
        Math.abs(p.x - pos.x) < 45 &&
        p.y > pos.y - 114 &&
        p.y < pos.y + 8
      )
        return { kind: "person", id: person.id };
      if (
        person.id === "goblin" &&
        Math.abs(p.x - pos.x) < 54 &&
        p.y > pos.y - 140 &&
        p.y < pos.y + 8
      )
        return { kind: "person", id: person.id };
      if (Math.abs(p.x - pos.x) < 31 && p.y > pos.y - 83 && p.y < pos.y + 6)
        return { kind: "person", id: person.id };
    }
    for (const place of PLACES)
      if (Math.hypot(p.x - place.x, p.y - (place.y - 18)) < 26)
        return { kind: "place", id: place.id };
    for (let i = 0; i < 12; i++) {
      const pos = plotPosition(i);
      if (Math.abs(p.x - pos.x) < 27 && Math.abs(p.y - pos.y) < 21)
        return { kind: "plot", id: String(i) };
    }
    return null;
  }
  visit(target: Target) {
    let p: Point;
    if (target.kind === "person") p = POSITIONS[target.id];
    else if (target.kind === "plot") p = plotPosition(Number(target.id));
    else p = PLACES.find((p) => p.id === target.id)!;
    this.path = findPath(this.getState().player, p);
    this.pending = target;
    if (this.path.length === 0) this.arrive();
  }
  private arrive() {
    const target = this.pending;
    this.pending = null;
    if (target) this.onInteract(target);
  }
  stop() {
    this.path = [];
    this.pending = null;
    this.keys.clear();
  }
  interactNearby() {
    const s = this.getState();
    let candidate: Target | null = null;
    let closest = 70;
    for (const p of PEOPLE) {
      const pos = POSITIONS[p.id];
      const d = Math.hypot(s.player.x - pos.x, s.player.y - pos.y);
      if (d < closest) {
        closest = d;
        candidate = { kind: "person", id: p.id };
      }
    }
    for (const p of PLACES) {
      const d = Math.hypot(s.player.x - p.x, s.player.y - p.y);
      if (d < closest) {
        closest = d;
        candidate = { kind: "place", id: p.id };
      }
    }
    for (let i = 0; i < 12; i++) {
      const p = plotPosition(i);
      const d = Math.hypot(s.player.x - p.x, s.player.y - p.y);
      if (d < closest) {
        closest = d;
        candidate = { kind: "plot", id: String(i) };
      }
    }
    if (candidate) this.onInteract(candidate);
  }
  setTool(tool: Tool) {
    this.selectedTool = tool;
  }
  feedback(text: string, color = "#fff1ad", bed?: number) {
    const p = bed === undefined ? this.getState().player : plotPosition(bed);
    this.effects.push({ ...p, text, color, start: performance.now() });
  }
  private face(dx: number, dy: number) {
    if (Math.abs(dy) > Math.abs(dx)) this.facingUp = dy < 0;
    else if (dx !== 0) {
      this.facingLeft = dx < 0;
      this.facingUp = false;
    }
  }
  private frame(time: number) {
    const dt = Math.min((time - this.last) / 1000, 0.05);
    this.last = time;
    const s = this.getState();
    let moving = false;
    if (!this.isPaused()) {
      let dx =
        Number(this.keys.has("d") || this.keys.has("arrowright")) -
        Number(this.keys.has("a") || this.keys.has("arrowleft"));
      let dy =
        Number(this.keys.has("s") || this.keys.has("arrowdown")) -
        Number(this.keys.has("w") || this.keys.has("arrowup"));
      if (dx || dy) {
        this.face(dx, dy);
        const m = Math.hypot(dx, dy);
        dx = (dx / m) * dt * 185;
        dy = (dy / m) * dt * 185;
        if (walkable(s.player.x + dx, s.player.y)) s.player.x += dx;
        if (walkable(s.player.x, s.player.y + dy)) s.player.y += dy;
        moving = true;
      } else if (this.path.length) {
        const p = this.path[0];
        this.face(p.x - s.player.x, p.y - s.player.y);
        const d = Math.hypot(p.x - s.player.x, p.y - s.player.y);
        const speed = dt * 270;
        if (d <= speed) {
          s.player = { ...p };
          this.path.shift();
          if (!this.path.length) this.arrive();
        } else {
          s.player.x += ((p.x - s.player.x) / d) * speed;
          s.player.y += ((p.y - s.player.y) / d) * speed;
        }
        moving = true;
      }
    }
    if (moving) this.step += dt * 9;
    this.render(time, moving);
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }
  private label(text: string, x: number, y: number, highlight = false) {
    const c = this.ctx;
    c.font = "20px ValleyText,monospace";
    c.textAlign = "center";
    const width = c.measureText(text).width + 14;
    c.fillStyle = "#613a26";
    c.fillRect(Math.round(x - width / 2) - 2, y - 19, width + 4, 26);
    c.fillStyle = highlight ? "#fff0b7" : "#f4d794";
    c.fillRect(Math.round(x - width / 2), y - 17, width, 22);
    c.fillStyle = "#684024";
    c.fillText(text, x, y);
  }
  private drawItem(index: number, x: number, y: number, size: number) {
    if (!this.items.complete || !this.items.naturalWidth) return;
    const w = this.items.naturalWidth / 4,
      h = this.items.naturalHeight / 3;
    this.ctx.drawImage(
      this.items,
      (index % 4) * w,
      Math.floor(index / 4) * h,
      w,
      h,
      Math.round(x - size / 2),
      Math.round(y - size / 2),
      size,
      size,
    );
  }
  private sprite(
    x: number,
    y: number,
    index: number,
    player = false,
    moving = false,
  ) {
    const c = this.ctx;
    if (!player && PEOPLE[index]?.id === "crombot") {
      c.fillStyle = "#17392765";
      c.beginPath();
      c.ellipse(x, y + 1, 26, 6, 0, 0, Math.PI * 2);
      c.fill();
      if (this.crombot.complete && this.crombot.naturalWidth) {
        c.drawImage(
          this.crombot,
          Math.round(x - 48),
          Math.round(y - 84 + Math.sin(this.last / 900)),
          96,
          96,
        );
      }
      return;
    }
    if (!player && PEOPLE[index]?.id === "goblin") {
      c.fillStyle = "#17392775";
      c.beginPath();
      c.ellipse(x, y + 2, 25, 7, 0, 0, Math.PI * 2);
      c.fill();
      if (this.goblin.complete && this.goblin.naturalWidth) {
        const bob = Math.sin(this.last / 700) * 1.2;
        c.drawImage(
          this.goblin,
          Math.round(x - 58),
          Math.round(y - 114 + bob),
          116,
          116,
        );
        c.fillStyle = "#526b31";
        for (let i = 0; i < 3; i++) {
          const t = this.last / 650 + i * 2.1;
          c.fillRect(
            x + Math.sin(t) * 42,
            y - 65 + Math.cos(t * 0.8) * 15,
            3,
            3,
          );
        }
      }
      return;
    }
    c.fillStyle = "#17392765";
    c.beginPath();
    c.ellipse(x, y + 1, 13, 4, 0, 0, Math.PI * 2);
    c.fill();
    if (!this.characters.complete || !this.characters.naturalWidth) return;
    const tile = player ? (this.facingUp ? 7 : 0) : index + 1;
    const width = this.characters.naturalWidth / 4,
      height = this.characters.naturalHeight / 2;
    const bob = moving ? Math.round(Math.sin(this.step * 2) * 2) : 0;
    c.save();
    c.translate(Math.round(x), Math.round(y + bob));
    if (player && this.facingLeft && !this.facingUp) c.scale(-1, 1);
    c.drawImage(
      this.characters,
      (tile % 4) * width,
      Math.floor(tile / 4) * height,
      width,
      height,
      -33,
      -62,
      66,
      66,
    );
    c.restore();
    if (player && this.selectedTool !== "hand") {
      const tool = { hand: 0, hoe: 1, seed: 2, water: 3, harvest: 4, fish: 5 }[
        this.selectedTool
      ];
      this.drawItem(tool, x + 17, y - 18 + bob, 25);
    }
  }
  private crop(crop: Crop, growth: number, x: number, y: number) {
    const c = this.ctx;
    const ripe = growth >= CROPS[crop].days;
    if (ripe && this.items.complete && this.items.naturalWidth) {
      this.drawItem(
        { turnip: 6, strawberry: 7, sunflower: 8 }[crop],
        x,
        y - 8,
        47,
      );
      return;
    }
    const size = ripe ? 1 : 0.6;
    c.save();
    c.translate(x, y + 4);
    c.scale(size, size);
    c.fillStyle = "#30542a";
    c.fillRect(-2, -15, 4, 22);
    c.fillStyle = "#609c40";
    c.fillRect(-12, -12, 11, 6);
    c.fillRect(2, -19, 10, 6);
    c.fillStyle = "#8abc4e";
    c.fillRect(-9, -15, 8, 4);
    c.fillRect(3, -22, 7, 4);
    if (ripe) {
      if (crop === "turnip") {
        c.fillStyle = "#ead9b1";
        c.fillRect(-8, 0, 17, 11);
        c.fillRect(-5, 10, 11, 4);
        c.fillStyle = "#b893b3";
        c.fillRect(-8, -2, 17, 5);
      } else if (crop === "strawberry") {
        c.fillStyle = "#ce5255";
        c.fillRect(-11, -3, 10, 9);
        c.fillRect(3, -8, 10, 9);
        c.fillStyle = "#f5d58a";
        c.fillRect(-8, 0, 2, 2);
        c.fillRect(7, -5, 2, 2);
      } else {
        c.fillStyle = "#f2c44b";
        c.fillRect(-11, -32, 23, 19);
        c.fillRect(-6, -37, 13, 29);
        c.fillStyle = "#825127";
        c.fillRect(-5, -29, 12, 12);
        c.fillStyle = "#b57932";
        c.fillRect(-2, -27, 5, 6);
      }
    }
    c.restore();
  }
  private render(time: number, moving: boolean) {
    const c = this.ctx,
      s = this.getState();
    c.clearRect(0, 0, 1200, 800);
    if (this.map.complete && this.map.naturalWidth)
      c.drawImage(this.map, 0, 0, 1200, 800);
    else {
      c.fillStyle = "#63824b";
      c.fillRect(0, 0, 1200, 800);
      c.fillStyle = "#eff0ca";
      c.font = "22px Georgia";
      c.textAlign = "center";
      c.fillText("Your little valley is waking up…", 600, 390);
    }
    // A wooden stile crosses the south fence; the approach stays below the trees.
    c.fillStyle = "#372c1d75";
    c.fillRect(148, 555, 34, 49);
    c.fillStyle = "#674128";
    c.fillRect(150, 550, 28, 49);
    for (let y = 551; y < 596; y += 7) {
      c.fillStyle = "#bb8649";
      c.fillRect(152, y, 24, 6);
      c.fillStyle = "#e1ad66";
      c.fillRect(152, y, 24, 2);
    }
    for (const x of [147, 178]) {
      c.fillStyle = "#5c3822";
      c.fillRect(x, 557, 4, 26);
      c.fillStyle = "#d49b55";
      c.fillRect(x, 555, 4, 5);
    }
    for (let i = 0; i < 12; i++) {
      const p = s.plots[i],
        pos = plotPosition(i);
      c.fillStyle = p.tilled
        ? p.watered
          ? "#593d2ce8"
          : "#80502bd9"
        : "#6d492c65";
      c.fillRect(pos.x - 27, pos.y - 20, 54, 40);
      if (p.tilled) {
        c.fillStyle = p.watered ? "#3d362987" : "#51331e88";
        for (let line = 0; line < 3; line++)
          c.fillRect(pos.x - 23, pos.y - 13 + line * 12, 46, 2);
      }
      if (p.crop) this.crop(p.crop, p.growth, pos.x, pos.y);
      if (p.watered) {
        c.fillStyle = "#8cc9df";
        c.fillRect(pos.x + 18, pos.y + 13, 4, 5);
      }
      if (this.hover?.kind === "plot" && this.hover.id === String(i)) {
        c.strokeStyle = "#ffe1a0";
        c.lineWidth = 2;
        c.strokeRect(pos.x - 28, pos.y - 21, 56, 42);
      }
    }
    const actors: {
      x: number;
      y: number;
      i: number;
      id: string;
      name: string;
      player: boolean;
    }[] = PEOPLE.map((p, i) => ({
      x: POSITIONS[p.id].x,
      y: POSITIONS[p.id].y,
      i,
      id: p.id,
      name: p.name,
      player: false,
    }));
    actors.push({ ...s.player, i: 0, id: "player", name: "You", player: true });
    actors.sort((a, b) => a.y - b.y);
    for (const a of actors) {
      this.sprite(a.x, a.y, a.i, a.player, a.player && moving);
      if (a.player) {
        c.fillStyle = "#ffe49a";
        c.beginPath();
        c.moveTo(a.x - 4, a.y - 74);
        c.lineTo(a.x + 4, a.y - 74);
        c.lineTo(a.x, a.y - 68);
        c.fill();
      } else {
        const dating = s.bonds[a.id].dating;
        this.label(
          `${dating ? "♥ " : ""}${a.id === "goblin" ? "Lord Goblin" : a.name}`,
          a.x,
          a.y - (a.id === "goblin" ? 127 : a.id === "crombot" ? 94 : 65),
          this.hover?.id === a.id,
        );
      }
    }
    for (const p of PLACES) {
      c.fillStyle = this.hover?.id === p.id ? "#f3cd77" : "#183b2de8";
      c.fillRect(p.x - 14, p.y - 32, 28, 28);
      c.strokeStyle = "#ebd095";
      c.lineWidth = 1.5;
      c.strokeRect(p.x - 14, p.y - 32, 28, 28);
      c.fillStyle = this.hover?.id === p.id ? "#28452f" : "#f6d995";
      c.font = "22px ValleyText,monospace";
      c.textAlign = "center";
      c.fillText(p.icon, p.x, p.y - 12);
      if (this.hover?.id === p.id) this.label(p.name, p.x, p.y - 47, true);
    }
    if (this.path.length) {
      const end = this.path[this.path.length - 1];
      c.strokeStyle = "#fff0afa0";
      c.lineWidth = 2;
      c.beginPath();
      c.ellipse(
        end.x,
        end.y,
        10 + Math.sin(time / 160) * 2,
        5,
        0,
        0,
        Math.PI * 2,
      );
      c.stroke();
    }
    for (let i = 0; i < 12; i++) {
      const x = ((i * 109 + time * 0.012) % 1140) + 20;
      const y = 280 + Math.sin(i * 22 + time * 0.0005) * 170;
      c.globalAlpha = 0.4 + Math.sin(time * 0.002 + i) * 0.3;
      c.fillStyle = "#fff0ad";
      c.fillRect(x, y, 2, 2);
    }
    c.globalAlpha = 1;
    this.effects = this.effects.filter((e) => time - e.start < 1100);
    for (const effect of this.effects) {
      const age = (time - effect.start) / 1100;
      c.globalAlpha = 1 - age;
      c.font = "25px ValleyText,monospace";
      c.textAlign = "center";
      c.strokeStyle = "#4c3425";
      c.lineWidth = 3;
      c.strokeText(effect.text, effect.x, effect.y - 32 - age * 38);
      c.fillStyle = effect.color;
      c.fillText(effect.text, effect.x, effect.y - 32 - age * 38);
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 0.4;
        const d = age * 30;
        c.fillRect(
          effect.x + Math.cos(a) * d,
          effect.y - 14 + Math.sin(a) * d,
          3,
          3,
        );
      }
    }
    c.globalAlpha = 1;
    if (s.minutes > 1020) {
      c.fillStyle = `rgba(48,37,77,${Math.min(0.22, (s.minutes - 1020) / 1700)})`;
      c.fillRect(0, 0, 1200, 800);
    }
  }
  destroy() {
    cancelAnimationFrame(this.raf);
  }
}
