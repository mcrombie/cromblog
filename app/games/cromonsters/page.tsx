import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play Cromonsters",
  description: "Play the current Cromonsters prototype: learn the estate’s farming tasks, survive a goblin raid, and explore its aftermath."
};

export default function CromonstersGamePage() {
  return (
    <iframe
      title="Cromonsters"
      src="/games/cromonsters/index.html"
      className="block h-screen w-full border-0"
      allow="fullscreen"
    />
  );
}
