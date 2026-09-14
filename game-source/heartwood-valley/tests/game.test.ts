import { test } from "node:test";
import assert from "node:assert/strict";
import {
  freshState,
  tend,
  sleep,
  talk,
  gift,
  date,
  buy,
  sell,
  catchFish,
  partners,
  festival,
  quickStart,
  restore,
  PEOPLE,
} from "../src/game";
import {
  findPath,
  walkable,
  POSITIONS,
  PLACES,
  plotPosition,
} from "../src/world";

test("four starter crops require watering and sleep, then harvest and sell for a profit", () => {
  const s = freshState();
  sleep(s);
  assert.equal(s.plots[0].growth, 0);
  for (let i = 0; i < 4; i++) tend(s, i, "water", "turnip");
  sleep(s);
  for (let i = 0; i < 4; i++) tend(s, i, "harvest", "turnip");
  assert.equal(s.harvests, 4);
  assert.equal(s.inventory.turnip, 4);
  const coins = s.coins;
  sell(s);
  assert.equal(s.coins, coins + 88);
  assert.equal(s.inventory.turnip, 0);
  assert.equal(s.inventory.bouquet, 2);
});
test("till, plant, water and harvest a two-night crop with no repeated watering charge", () => {
  const s = freshState();
  tend(s, 8, "hoe", "sunflower");
  tend(s, 8, "seed", "sunflower");
  tend(s, 8, "water", "sunflower");
  const energy = s.energy;
  tend(s, 8, "water", "sunflower");
  assert.equal(s.energy, energy);
  sleep(s);
  assert.equal(s.plots[8].growth, 1);
  tend(s, 8, "harvest", "sunflower");
  assert.equal(s.inventory.sunflower, 0);
  tend(s, 8, "water", "sunflower");
  sleep(s);
  tend(s, 8, "harvest", "sunflower");
  assert.equal(s.inventory.sunflower, 1);
});
test("invalid purchases and tired actions do not consume resources", () => {
  const s = freshState();
  s.coins = 0;
  const seeds = s.seeds.turnip;
  buy(s, "turnip");
  assert.equal(s.seeds.turnip, seeds);
  s.energy = 0;
  const snapshot = JSON.stringify(s);
  tend(s, 4, "seed", "turnip");
  assert.equal(JSON.stringify(s), snapshot);
});
test("daily social limits reset after sleeping", () => {
  const s = freshState();
  talk(s, "rowan");
  talk(s, "rowan");
  assert.equal(s.bonds.rowan.points, 3);
  gift(s, "rowan", "bouquet");
  gift(s, "rowan", "bouquet");
  assert.equal(s.inventory.bouquet, 1);
  assert.equal(s.bonds.rowan.points, 5);
  date(s, "rowan");
  date(s, "rowan");
  assert.equal(s.bonds.rowan.points, 7);
  sleep(s);
  talk(s, "rowan");
  assert.equal(s.bonds.rowan.points, 8);
});
test("all seven simultaneous partners are retained and can celebrate together", () => {
  const s = freshState();
  quickStart(s);
  for (const p of PEOPLE) {
    date(s, p.id);
    assert.equal(s.bonds[p.id].dating, true);
  }
  assert.equal(partners(s).length, PEOPLE.length);
  festival(s);
  assert.equal(s.festival, true);
  assert.equal(partners(s).length, PEOPLE.length);
});
test("dates and picnic require the advertised relationship progress", () => {
  const s = freshState();
  date(s, "maeve");
  assert.equal(s.bonds.maeve.dating, false);
  festival(s);
  assert.equal(s.festival, false);
  quickStart(s);
  date(s, "maeve");
  festival(s);
  assert.equal(s.festival, false);
  date(s, "jun");
  festival(s);
  assert.equal(s.festival, true);
});
test("fishing results spend energy but only successful catches produce fish", () => {
  const s = freshState();
  catchFish(s, false);
  assert.equal(s.energy, 95);
  assert.equal(s.inventory.fish, 0);
  catchFish(s, true);
  assert.equal(s.energy, 90);
  assert.equal(s.inventory.fish, 1);
});
test("head start preserves existing crops, dates, day and higher resources", () => {
  const s = freshState();
  quickStart(s);
  date(s, "cleo");
  s.coins = 800;
  s.day = 8;
  quickStart(s);
  assert.equal(s.coins, 800);
  assert.equal(s.day, 8);
  assert.equal(s.bonds.cleo.dating, true);
  assert.equal(s.bonds.cleo.points, 6);
});
test("saves round-trip and malformed records fall back safely", () => {
  const s = freshState();
  quickStart(s);
  date(s, "iris");
  assert.deepEqual(restore(JSON.stringify(s)), s);
  assert.deepEqual(restore("{broken"), freshState());
  assert.deepEqual(
    restore(
      JSON.stringify({ ...s, inventory: { ...s.inventory, turnip: 1.5 } }),
    ),
    freshState(),
  );
  assert.deepEqual(
    restore(
      JSON.stringify({
        ...s,
        plots: s.plots.map((p, i) =>
          i === 0 ? { ...p, crop: ["turnip"] } : p,
        ),
      }),
    ),
    freshState(),
  );
});
test("every neighbor, garden bed and landmark is reachable without crossing blocked terrain", () => {
  const s = freshState();
  for (const p of PEOPLE)
    assert.ok(POSITIONS[p.id], `No position for ${p.name}`);
  const goblinPath = findPath(s.player, POSITIONS.goblin);
  assert.ok(
    goblinPath.every((p) => p.x >= 141 || p.y >= 588),
    "The goblin approach must pass below the trees and west fence",
  );
  for (const p of [
    ...Object.values(POSITIONS),
    ...PLACES,
    ...Array.from({ length: 12 }, (_, i) => plotPosition(i)),
  ]) {
    const path = findPath(s.player, p);
    assert.ok(path.length > 0, `No path to ${p.x},${p.y}`);
    assert.ok(path.every((p) => walkable(p.x, p.y)));
    const end = path.at(-1)!;
    assert.ok(Math.hypot(end.x - p.x, end.y - p.y) <= 12);
  }
});

test("legacy farms gain the goblin without losing six relationships or farm progress", () => {
  const s = freshState();
  quickStart(s);
  for (const p of PEOPLE.filter((p) => p.id !== "goblin")) date(s, p.id);
  festival(s);
  s.day = 12;
  s.coins = 987;
  tend(s, 0, "harvest", "turnip");
  const expected = structuredClone(s);
  expected.bonds.goblin = freshState().bonds.goblin;
  delete s.bonds.goblin;
  const migrated = restore(JSON.stringify(s));
  assert.deepEqual(migrated, expected);
  assert.equal(partners(migrated).length, 6);
  assert.equal(migrated.festival, true);
});

test("the new goblin supports favorite gifts, daily limits, dating and save round trips", () => {
  const s = freshState();
  s.inventory.fish = 2;
  talk(s, "goblin");
  gift(s, "goblin", "fish");
  assert.equal(s.bonds.goblin.points, 5);
  date(s, "goblin");
  assert.equal(s.bonds.goblin.points, 7);
  assert.equal(s.bonds.goblin.dating, true);
  const snapshot = JSON.stringify(s);
  talk(s, "goblin");
  gift(s, "goblin", "fish");
  date(s, "goblin");
  assert.equal(JSON.stringify(s), snapshot);
  const loaded = restore(snapshot);
  assert.deepEqual(loaded, s);
  sleep(loaded);
  talk(loaded, "goblin");
  gift(loaded, "goblin", "fish");
  assert.equal(loaded.bonds.goblin.points, 10);
  assert.equal(loaded.inventory.fish, 0);
});

test("additive migration still rejects malformed goblin bonds and missing original bonds", () => {
  const s = freshState();
  s.coins = 999;
  assert.deepEqual(
    restore(JSON.stringify({ ...s, bonds: { ...s.bonds, goblin: null } })),
    freshState(),
  );
  delete s.bonds.rowan;
  delete s.bonds.goblin;
  assert.deepEqual(restore(JSON.stringify(s)), freshState());
});
