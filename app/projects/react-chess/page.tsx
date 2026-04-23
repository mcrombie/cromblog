import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "React-Chess"
};

export default function ReactChessPage() {
  return (
    <iframe
      title="React-Chess"
      src="/react-chess/index.html"
      className="block h-screen w-full border-0"
    />
  );
}
