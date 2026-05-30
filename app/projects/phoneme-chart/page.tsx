import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Phoneme Chart"
};

export default function PhonemeChartPage() {
  return (
    <iframe
      title="Interactive Phoneme Chart"
      src="/phoneme-chart/index.html"
      className="block h-screen w-full border-0"
    />
  );
}
