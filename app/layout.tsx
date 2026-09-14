import type { Metadata } from "next";
import { Patrick_Hand } from "next/font/google";

import { RootShell } from "@/components/root-shell";
import { siteMeta } from "@/content/site";
import { DEFAULT_DOODLE_DESIGN, DOODLE_DESIGNS, DOODLE_DESIGN_QUERY_KEY, DOODLE_DESIGN_STORAGE_KEY } from "@/lib/doodle-designs";
import {
  DEFAULT_VIBE,
  VIBES,
  VIBE_DISMISSED_SESSION_KEY,
  VIBE_STORAGE_KEY
} from "@/lib/vibes";

import "./globals.css";
import "./vibes.css";
import "./vibe-doodle.css";

const notebookHand = Patrick_Hand({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-hand", preload: false });

const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: siteMeta.title,
    template: `%s | ${siteMeta.title}`
  },
  description: siteMeta.description,
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Michael Crombie — software, stories, and simulated worlds"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
    images: ["/og.png"]
  }
};

const vibeInitializer = `(() => {
  try {
    const storedVibe = window.localStorage.getItem(${JSON.stringify(VIBE_STORAGE_KEY)});
    const validVibes = ${JSON.stringify(VIBES.map((vibe) => vibe.id))};
    document.documentElement.dataset.vibe = validVibes.includes(storedVibe)
      ? storedVibe
      : ${JSON.stringify(DEFAULT_VIBE)};
  } catch {
    document.documentElement.dataset.vibe = ${JSON.stringify(DEFAULT_VIBE)};
  }

  try {
    if (window.sessionStorage.getItem(${JSON.stringify(VIBE_DISMISSED_SESSION_KEY)}) === "1") {
      document.documentElement.dataset.vibeControl = "dismissed";
    }
  } catch {}

  try {
    const validDesigns = ${JSON.stringify(DOODLE_DESIGNS.map(design => design.id))};
    const queryDesign = new URL(window.location.href).searchParams.get(${JSON.stringify(DOODLE_DESIGN_QUERY_KEY)});
    let storedDesign;
    try { storedDesign = window.localStorage.getItem(${JSON.stringify(DOODLE_DESIGN_STORAGE_KEY)}); } catch {}
    document.documentElement.dataset.doodleDesign = validDesigns.includes(queryDesign)
      ? queryDesign : validDesigns.includes(storedDesign) ? storedDesign : ${JSON.stringify(DEFAULT_DOODLE_DESIGN)};
    if (validDesigns.includes(queryDesign)) {
      document.documentElement.dataset.vibe = "doodle";
      try {
        window.localStorage.setItem(${JSON.stringify(DOODLE_DESIGN_STORAGE_KEY)}, queryDesign);
        window.localStorage.setItem(${JSON.stringify(VIBE_STORAGE_KEY)}, "doodle");
      } catch {}
    }
  } catch {
    document.documentElement.dataset.doodleDesign = ${JSON.stringify(DEFAULT_DOODLE_DESIGN)};
  }
})();`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-vibe={DEFAULT_VIBE} data-doodle-design={DEFAULT_DOODLE_DESIGN} className={notebookHand.variable} suppressHydrationWarning>
      <head>
        <script
          id="cromblog-vibe-initializer"
          dangerouslySetInnerHTML={{ __html: vibeInitializer }}
        />
      </head>
      <body>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
