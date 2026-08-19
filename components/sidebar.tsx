"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ART_NAV_LABELS_BY_VIBE,
  DEFAULT_VIBE,
  isVibeId,
  VIBE_CHANGE_EVENT,
  VIBE_STORAGE_KEY,
  type VibeId
} from "@/lib/vibes";

type NavItem = {
  label: string;
  href?: string;
  symbol?: string;
  icon?: "github" | "linkedin";
  external?: boolean;
  disabled?: boolean;
};

const navLinks: NavItem[] = [
  { href: "/about", label: "About", symbol: "✦" },
  { href: "/cromblog", label: "Blog", symbol: "❧" },
  { href: "/art", label: "Doodles", symbol: "✎" },
  { href: "/projects", label: "Projects", symbol: "◇" },
  {
    href: "https://github.com/mcrombie",
    label: "GitHub",
    icon: "github",
    external: true
  },
  {
    label: "LinkedIn",
    icon: "linkedin",
    disabled: true
  }
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const [vibe, setVibe] = useState<VibeId>(DEFAULT_VIBE);

  useEffect(() => {
    const documentVibe = document.documentElement.dataset.vibe;

    if (isVibeId(documentVibe)) {
      setVibe(documentVibe);
    }

    const syncVisibleVibe = (event: Event) => {
      const changedVibe = (event as CustomEvent<unknown>).detail;

      if (isVibeId(changedVibe)) {
        setVibe(changedVibe);
      }
    };

    const syncStoredVibe = (event: StorageEvent) => {
      if (event.key === VIBE_STORAGE_KEY) {
        setVibe(isVibeId(event.newValue) ? event.newValue : DEFAULT_VIBE);
      }
    };

    window.addEventListener(VIBE_CHANGE_EVENT, syncVisibleVibe);
    window.addEventListener("storage", syncStoredVibe);
    return () => {
      window.removeEventListener(VIBE_CHANGE_EVENT, syncVisibleVibe);
      window.removeEventListener("storage", syncStoredVibe);
    };
  }, []);

  return (
    <aside className="site-sidebar" aria-label="Site navigation">
      <div>
        <div className="sidebar-ornament" aria-hidden="true" />
      </div>

      <nav className="site-nav" aria-label="Primary navigation">
        {navLinks.map((link) => {
          const label =
            link.href === "/art" ? ART_NAV_LABELS_BY_VIBE[vibe] : link.label;
          const active = Boolean(
            link.href && !link.external && !link.disabled && isActive(pathname, link.href)
          );
          const className = `site-nav-link${active ? " is-active" : ""}${
            link.disabled ? " is-disabled" : ""
          }`;
          const symbolClassName = `nav-symbol${
            link.icon ? ` nav-symbol-${link.icon}` : " nav-symbol-glyph"
          }`;

          const content = (
            <>
              <span className={symbolClassName} aria-hidden="true">
                {link.icon === "linkedin" ? "in" : link.symbol}
              </span>
              <span className="nav-label">{label}</span>
              {link.disabled ? (
                <span className="nav-status">Soon</span>
              ) : link.external ? (
                <span className="nav-external" aria-hidden="true">
                  ↗
                </span>
              ) : null}
            </>
          );

          if (link.disabled) {
            return (
              <span
                key={link.href ?? link.label}
                className={className}
                role="link"
                aria-disabled="true"
                title="LinkedIn profile coming soon"
              >
                {content}
              </span>
            );
          }

          if (!link.href) {
            return null;
          }

          return link.external ? (
            <a
              key={link.href ?? link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              aria-label={`${label} (opens in a new tab)`}
            >
              {content}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className={className}
              aria-current={active ? "page" : undefined}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-sprig" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <p className="sidebar-note">
          Essays, software, and simulated worlds.
        </p>
      </div>
    </aside>
  );
}
