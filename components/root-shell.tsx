"use client";

import { Suspense, type ReactNode } from "react";

import { usePathname } from "next/navigation";

import { SiteShell } from "@/components/site-shell";
import { VibeLocationObserver } from "@/components/vibe-location-observer";

type RootShellProps = {
  children: ReactNode;
};

export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname();
  const isStandaloneProject =
    pathname.startsWith("/games/cromb-coo-coo") ||
    pathname.startsWith("/games/cromonsters") ||
    pathname.startsWith("/games/heartwood-valley") ||
    pathname.startsWith("/projects/react-chess") ||
    pathname.startsWith("/projects/phoneme-chart") ||
    pathname.startsWith("/projects/polity") ||
    pathname.startsWith("/projects/clashvergence-demo") ||
    pathname.startsWith("/projects/world-builder") ||
    pathname.startsWith("/cromblog/simulating-civilizations-iii/viewer");
  const isArtRoute = pathname === "/art" || pathname.startsWith("/art/");

  if (isStandaloneProject) {
    return <><Suspense fallback={null}><VibeLocationObserver /></Suspense><main className="standalone-experience">{children}</main></>;
  }

  return (
    <SiteShell showAmbientDoodles={!isArtRoute}>
      <Suspense fallback={null}><VibeLocationObserver /></Suspense>
      {children}
    </SiteShell>
  );
}
