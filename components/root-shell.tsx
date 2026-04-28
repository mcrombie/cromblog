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
    pathname.startsWith("/projects/react-chess") ||
    pathname.startsWith("/projects/polity");

  if (isStandaloneProject) {
    return <>{children}</>;
  }

  return <SiteShell>{children}</SiteShell>;
}
