import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Root of Civilization"
};

export default function PolityPage() {
  return (
    <iframe
      title="The Root of Civilization"
      src="/polity/index.html"
      className="block h-screen w-full border-0"
    />
  );
}
