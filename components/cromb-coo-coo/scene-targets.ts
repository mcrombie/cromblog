import type { Target } from "@/lib/cromb-coo-coo";

export const sceneTargets: { id: Target; label: string; action: string; x: number; y: number; kind: "talk" | "look" }[] = [
  { id: "bird", label: "Woodgrain Bird", action: "Talk to the Woodgrain Bird", x: 17, y: 36, kind: "talk" },
  { id: "turtle", label: "Trumpet Turtle", action: "Talk to the Trumpet Turtle", x: 32, y: 73, kind: "talk" },
  { id: "juggler", label: "Orb Juggler", action: "Talk to the Orb Juggler", x: 81, y: 74, kind: "talk" },
  { id: "visitor", label: "The Visitor", action: "Check in with the Visitor", x: 49, y: 55, kind: "talk" },
  { id: "roots", label: "Listening roots", action: "Examine the roots", x: 48, y: 9, kind: "look" },
  { id: "gap", label: "The crossing", action: "Examine the crossing", x: 66.5, y: 86, kind: "look" },
  { id: "islands", label: "Distant islands", action: "Look at the distant islands", x: 63, y: 24, kind: "look" }
];
