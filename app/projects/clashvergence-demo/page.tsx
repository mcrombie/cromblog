import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clashvergence Live Demo",
  description:
    "Generate a world, watch an unbiased civilization simulation unfold, and create an in-world history of any faction.",
  openGraph: {
    title: "Clashvergence Live",
    description: "Generate a world. Watch history unfold.",
    images: [
      {
        url: "/clashvergence/og.png",
        width: 1731,
        height: 909,
        alt: "A generated hex world beside the Clashvergence historian's chronicle"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Clashvergence Live",
    description: "Generate a world. Watch history unfold.",
    images: ["/clashvergence/og.png"]
  }
};

export default function ClashvergenceDemoPage() {
  return (
    <iframe
      title="Clashvergence live civilization simulation"
      src="/world-builder/index.html?demo=clashvergence&api=/api/clashvergence"
      className="block h-screen w-full border-0"
      allow="clipboard-write"
    >
      <p>
        Your browser cannot display the Clashvergence demo. Visit the World
        Builder project page to generate a map instead.
      </p>
    </iframe>
  );
}
