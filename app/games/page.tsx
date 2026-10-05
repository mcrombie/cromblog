import { redirect } from "next/navigation";

// The games are listed among the projects now; old links to /games land on that tab.
export default function GamesPage() {
  redirect("/projects#games");
}
