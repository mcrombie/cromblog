import type { Metadata } from "next";

import { CrombCooCooGame } from "@/components/cromb-coo-coo/game";

export const metadata: Metadata = {
  title: "Cromb Coo Coo — Five Floating Islands",
  description:
    "A gentle animated 3D adventure across five floating islands. Say hello to the frog, take your first steps, and meet a new friend on every island.",
  openGraph: {
    title: "Cromb Coo Coo — Five Floating Islands",
    description:
      "Start with a hello and a few steps. Explore five animated floating islands, from a frog's clearing to a lantern-lit archive.",
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
