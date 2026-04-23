import type { Metadata } from "next";

import { RootShell } from "@/components/root-shell";
import { siteMeta } from "@/content/site";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteMeta.title,
    template: `%s | ${siteMeta.title}`
  },
  description: siteMeta.description
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
