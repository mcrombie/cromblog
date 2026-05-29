import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Azhora Map"
};

export default function AzhoraMapPage() {
  return (
    <iframe
      title="Azhora Map Editor"
      src="/azhora-map/index.html"
      className="block h-screen w-full border-0"
    />
  );
}
