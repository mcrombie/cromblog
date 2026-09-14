"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { SiteShell } from "@/components/site-shell";

type RootShellProps = {
  children: ReactNode;
};

export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname();
  const isStandaloneProject =
    pathname === "/cromblog/doodle-lab" ||
    pathname.startsWith("/games/cromb-coo-coo") ||
    pathname.startsWith("/games/cromonsters") ||
    pathname.startsWith("/projects/react-chess") ||
    pathname.startsWith("/projects/phoneme-chart") ||
    pathname.startsWith("/projects/polity") ||
    pathname.startsWith("/projects/clashvergence-demo") ||
    pathname.startsWith("/projects/world-builder") ||
    pathname.startsWith("/cromblog/simulating-civilizations-iii/viewer");
  const isArtRoute = pathname === "/art" || pathname.startsWith("/art/");

  if (isStandaloneProject) {
    return <main className="standalone-experience">{children}</main>;
  }

  return (
    <SiteShell showAmbientDoodles={!isArtRoute}>
      {children}
    </SiteShell>
  );
}
