import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play Stardate Valley",
  description: "A Stardew-inspired farm-life spoof. Inherit a farm, grow turnips, and date all six adult neighbors in a village with no exclusivity clauses."
};

export default function HeartwoodValleyGamePage() {
  return (
    <iframe
      title="Stardate Valley farming and romance spoof"
      src="/games/heartwood-valley/index.html"
      className="block h-screen w-full border-0"
      allow="fullscreen"
    />
  );
}
