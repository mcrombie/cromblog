import { redirect } from "next/navigation";

// The bare address now means the map the game draws; the older World Builder map is at /world-builder-azhora-map.
export default function AzhoraMapPage() {
  redirect("/game-azhora-map");
}
