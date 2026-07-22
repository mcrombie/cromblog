import type { ReactNode } from "react";

import { Sidebar } from "@/components/sidebar";
import { VibeCycleButton } from "@/components/vibe-cycle-button";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-ambient" aria-hidden="true" />
      <div className="site-ambient" aria-hidden="true" />
      <Sidebar />
      <VibeCycleButton />
      <main id="main-content" className="site-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
