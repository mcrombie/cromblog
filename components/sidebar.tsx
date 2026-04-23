"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { href: "/about", label: "About" },
  { href: "/cromblog", label: "Cromblog" },
  { href: "/projects", label: "Projects" }
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card lg:fixed lg:inset-y-0 lg:left-0 lg:w-[20rem] lg:rounded-none lg:rounded-r-[2.25rem] lg:border-l-0 lg:px-7 lg:py-8 lg:shadow-[0_24px_60px_rgba(39,52,37,0.12)]">
      <div className="content-flow">
        <span className="font-serif text-3xl text-ink">Michael Crombie</span>
      </div>

      <nav className="mt-10 content-flow" aria-label="Primary">
        {primaryLinks.map((link) => {
          const active = isActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-2xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-pine-800 text-pine-50"
                  : "border border-transparent text-pine-800 hover:border-[color:var(--border)] hover:bg-white/50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
