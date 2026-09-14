import { getTargets, type GameState, type Target } from "@/lib/cromb-coo-coo";

// The logical controls are shared with the story; these positions follow each plate.
const illustratedPositions: Partial<Record<Target, [number, number]>>[] = [
  { resident: [81, 74], path: [66.5, 86] },
  { resident: [17, 36], detail: [48, 15], path: [68, 78], back: [10, 82] },
  { resident: [67, 57], detail: [47, 52], path: [88, 65], back: [11, 53] },
  { resident: [50, 37], detail: [62, 30], path: [89, 54], back: [12, 45] },
  { resident: [69, 34], detail: [68, 44], path: [64, 53], back: [13, 53] }
];

export function sceneTargets(state: GameState) {
  return getTargets(state).map(target => {
    const position = illustratedPositions[state.sceneIndex][target.id];
    return position ? { ...target, x: position[0], y: position[1] } : target;
  });
}
