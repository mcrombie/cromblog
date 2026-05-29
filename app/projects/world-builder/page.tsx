import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "World Builder"
};

export default function WorldBuilderPage() {
  return (
    <iframe
      title="World Builder"
      src="/world-builder/index.html"
      className="block h-screen w-full border-0"
    />
  );
}
