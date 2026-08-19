import type { ReactNode } from "react";

import { DoodleLabStage } from "@/components/doodle-lab-stage";
import { Sidebar } from "@/components/sidebar";
import { VibeCycleButton } from "@/components/vibe-cycle-button";

type SiteShellProps = {
  children: ReactNode;
  showAmbientDoodles?: boolean;
};

export function SiteShell({
  children,
  showAmbientDoodles = true
}: SiteShellProps) {
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
        {showAmbientDoodles ? <DoodleLabStage /> : null}
        <div className="site-main-content">{children}</div>
      </main>
    </div>
  );
}
