import type { Metadata } from "next";

import { CrombCooCooGame } from "@/components/cromb-coo-coo/game";

export const metadata: Metadata = {
  title: "Cromb Coo Coo — The First Crossing",
  description:
    "An animated 3D adventure through the world of Cromb Coo Coo. Meet its inhabitants, discover a call and response, and find your way across the roots.",
  openGraph: {
    title: "Cromb Coo Coo — The First Crossing",
    description:
      "A small, strange 3D adventure among animated floating forests, enormous roots, and unfamiliar friends.",
    images: [
      {
        url: "/cromblog/doodle-experiments/round-21/at-the-center-of-cromb-coo-coo.png",
        width: 1672,
        height: 941,
        alt: "The Visitor among the inhabitants and floating forest islands of Cromb Coo Coo"
      }
    ]
  }
};

export default function CrombCooCooPage() {
  return <CrombCooCooGame />;
}
