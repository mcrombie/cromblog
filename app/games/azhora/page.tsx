import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play Azhora",
  description: "A playable 3D adventure on the forested shores of Azhora."
};

/** The game is a static site on Render; this page shows it full-screen under mcrombie.com. */
export default function AzhoraGamePage() {
  return (
    <iframe
      title="Azhora, a 3D adventure game"
      src="https://azhora.onrender.com/"
      className="block h-screen w-full border-0"
      // dvh keeps the game's phone controls above mobile browser toolbars; h-screen is the fallback.
      style={{ height: "100dvh" }}
      allow="fullscreen; autoplay; gamepad"
    />
  );
}
