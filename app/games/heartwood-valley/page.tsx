import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play Heartwood Valley",
  description: "Grow a little farm, date any or all six adult neighbors, and celebrate together in this original browser farming and romance game."
};

export default function HeartwoodValleyGamePage() {
  return (
    <iframe
      title="Heartwood Valley farming and romance game"
      src="/games/heartwood-valley/index.html"
      className="block h-screen w-full border-0"
      allow="fullscreen"
    />
  );
}
