import type { ReactNode } from "react";

import { Sidebar } from "@/components/sidebar";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 sm:py-6 lg:px-0 lg:py-0">
      <Sidebar />
      <main className="min-w-0 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-card sm:p-8 lg:ml-[22rem] lg:mr-6 lg:mt-6 lg:min-h-[calc(100vh-3rem)] lg:max-w-none lg:p-10 xl:mr-8 xl:mt-8 xl:min-h-[calc(100vh-4rem)] xl:p-12">
        {children}
      </main>
    </div>
  );
}
