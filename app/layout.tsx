import type { Metadata } from "next";

import { RootShell } from "@/components/root-shell";
import { siteMeta } from "@/content/site";

import "./globals.css";

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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
