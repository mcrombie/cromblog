/* Run with: node scripts/test-cromb-coo-coo.cjs */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const ts = require("typescript");

const sourcePath = path.resolve(__dirname, "../lib/cromb-coo-coo.ts");
const source = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText;
const storyModule = { exports: {} };
vm.runInThisContext(`(function (exports, require, module) { ${source}\n})`, {
  filename: sourcePath,
})(storyModule.exports, createRequire(sourcePath), storyModule);
const story = storyModule.exports;
const { initialState, getScene, getTargets, getDialogue, choose, move, canMoveForward, isComplete, restoreState } = story;
const clone = (value) => JSON.parse(JSON.stringify(value));
const fresh = () => clone(initialState);
const choiceIds = (target, state) => getDialogue(target, state).choices.map((choice) => choice.id);
const greet = (state) => choose("resident", "greet", state).state;

const cases = [];
const test = (name, body) => cases.push([name, body]);

test("the opening offers just talking to the frog and the way forward", () => {
  const state = fresh();
  assert.equal(getScene(state).resident, "Frog");
  assert.deepEqual(getTargets(state).map((target) => target.id), ["resident", "path"]);
  assert.equal(canMoveForward(state), false);
  assert.equal(move(state, "forward"), state);
  assert.equal(choose("path", "forward", state).state, state);
  assert.equal(move(state, "back"), state);

  getDialogue("resident", state);
  assert.equal(canMoveForward(state), false, "opening the conversation is not a reply");
  assert.equal(canMoveForward(choose("resident", "leave", state).state), false);
  assert.equal(canMoveForward(choose("detail", "examine", state).state), false);
});

test("one reply opens the path but only navigation changes islands", () => {
  const before = fresh();
  const after = greet(before);
  assert.equal(after.sceneIndex, 0);
  assert.equal(canMoveForward(after), true);
  assert.equal(before.greeted[0], false);
  assert.ok(choiceIds("path", after).includes("forward"));
  const arrived = choose("path", "forward", after).state;
  assert.equal(arrived.sceneIndex, 1);
  assert.equal(getScene(arrived).resident, "Woodgrain Bird");
  assert.equal(canMoveForward(arrived), false);
  assert.equal(choose("path", "forward", arrived).state, arrived, "a stale forward choice cannot skip the new conversation");
});

test("all five distinct scenes can be visited, inspected optionally, and revisited", () => {
  let state = fresh();
  const visited = [];
  for (let index = 0; index < 5; index += 1) {
    assert.equal(state.sceneIndex, index);
    visited.push(getScene(state).id);
    assert.equal(isComplete(state), false);
    assert.equal(move(state, "forward"), state, "every new island begins with its own hello");
    if (index > 0) {
      const inspected = choose("detail", "examine", state).state;
      assert.equal(canMoveForward(inspected), false, "an observation never substitutes for a greeting");
      assert.equal(inspected.sceneIndex, index);
      assert.ok(story.getJournal(inspected).some((entry) => entry.title === getScene(state).detail));
      const prior = move(state, "back");
      assert.equal(prior.sceneIndex, index - 1);
      state = move(prior, "forward");
      assert.equal(state.sceneIndex, index, "a visited island does not require a repeated greeting");
    }
    state = greet(state);
    if (index < 4) state = move(state, "forward");
  }
  assert.equal(new Set(visited).size, 5);
  assert.equal(isComplete(state), false, "arrival and talking do not automatically end the journey");
  assert.equal(canMoveForward(state), false, "there is no sixth island");
  assert.equal(move(state, "forward"), state);
  state = choose("path", "finish", state).state;
  assert.equal(isComplete(state), true);
  for (let index = 3; index >= 0; index -= 1) {
    state = move(state, "back");
    assert.equal(state.sceneIndex, index);
    assert.equal(isComplete(state), true);
  }
  assert.equal(move(state, "back"), state);
  assert.equal(story.getJournal(state).filter((entry) => visited.includes(story.islandScenes.find((scene) => scene.name === entry.title)?.id)).length, 5);
  for (let index = 1; index < 5; index += 1) state = move(state, "forward");
  assert.equal(state.sceneIndex, 4);
  assert.ok(restoreState(state), "a completed journey remains a valid save while revisiting islands");
});

test("wrong targets, obsolete puzzle choices, and early rest cannot advance the story", () => {
  const state = fresh();
  for (const [target, id] of [["resident", "forward"], ["path", "greet"], ["detail", "greet"], ["back", "back"], ["path", "finish"], ["resident", "begin-crossing"]]) {
    assert.equal(choose(target, id, state).state, state, `${target}:${id} must be inert`);
  }
  let final = state;
  for (let index = 0; index < 4; index += 1) final = move(greet(final), "forward");
  assert.equal(final.sceneIndex, 4);
  assert.equal(choose("path", "finish", final).state, final);
  assert.equal(isComplete(final), false);
  assert.ok(!choiceIds("path", final).includes("finish"));
  assert.ok(choiceIds("path", greet(final)).includes("finish"));
});

test("story updates preserve prior states and leave a pristine restart", () => {
  const original = clone(initialState);
  const before = fresh();
  Object.freeze(before.greeted);
  Object.freeze(before.inspected);
  Object.freeze(before);
  const after = greet(before);
  assert.notEqual(after.greeted, before.greeted);
  const second = move(after, "forward");
  const inspected = choose("detail", "examine", second).state;
  assert.notEqual(inspected.inspected, second.inspected);
  assert.equal(second.inspected[1], false);
  assert.deepEqual(before, original);
  assert.deepEqual(initialState, original);
  assert.deepEqual(fresh(), original);
});

test("supported saves round trip without sharing their mutable flags", () => {
  const raw = move(greet(fresh()), "forward");
  const restored = restoreState(raw);
  assert.deepEqual(restored, raw);
  assert.notEqual(restored.greeted, raw.greeted);
  assert.notEqual(restored.inspected, raw.inspected);
  raw.greeted[1] = true;
  raw.inspected[1] = true;
  assert.equal(restored.greeted[1], false);
  assert.equal(restored.inspected[1], false);
});

test("malformed or impossible new saves cannot bypass an island", () => {
  const bad = [null, [], {}, "saved", { ...fresh(), version: 3 }, { ...fresh(), sceneIndex: -1 }, { ...fresh(), sceneIndex: 5 }, { ...fresh(), sceneIndex: 0.5 }, { ...fresh(), sceneIndex: "1" }, { ...fresh(), greeted: [false] }, { ...fresh(), inspected: [false, false, false, false, "false"] }, { ...fresh(), complete: "false" }, { ...fresh(), sceneIndex: 2 }, { ...fresh(), greeted: [true, false, true, false, false] }, { ...fresh(), complete: true }];
  for (const raw of bad) assert.equal(restoreState(raw), null, JSON.stringify(raw));
});

const legacy = (complete = false) => ({
  version: 1, examinedGap: complete, watchedJuggler: complete, examinedRoots: complete,
  learnedResponse: complete, turtleWilling: complete, jugglerReady: complete,
  bridgeOpen: complete, complete, approach: "quiet",
});

test("old unfinished saves restart at the simpler opening and finished saves resume on island two", () => {
  const unfinished = restoreState({ ...legacy(), examinedGap: true, approach: "playful" });
  assert.deepEqual(unfinished, fresh());
  const finished = restoreState(legacy(true));
  assert.equal(finished.sceneIndex, 1);
  assert.deepEqual(finished.greeted, [true, false, false, false, false]);
  assert.equal(finished.complete, false);
  assert.equal(canMoveForward(finished), false);
  assert.equal(move(finished, "back").sceneIndex, 0);
});

test("partial and contradictory legacy saves are rejected", () => {
  const bad = [{ version: 1, complete: true, bridgeOpen: true }, { ...legacy(true), bridgeOpen: false }, { ...legacy(true), jugglerReady: false }, { ...legacy(), approach: "broken" }, { ...legacy(), examinedGap: undefined }];
  for (const raw of bad) assert.equal(restoreState(raw), null, JSON.stringify(raw));
});

let failed = 0;
for (const [name, body] of cases) {
  try { body(); console.log(`PASS ${name}`); }
  catch (error) { failed += 1; console.error(`FAIL ${name}\n${error.stack}`); }
}
console.log(`${cases.length - failed}/${cases.length} story checks passed.`);
process.exitCode = failed ? 1 : 0;
