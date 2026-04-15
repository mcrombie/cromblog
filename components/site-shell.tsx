import type { ReactNode } from "react";

import { Sidebar } from "@/components/sidebar";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Sidebar />
        <main className="min-w-0 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-card sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

