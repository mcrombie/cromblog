"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DoodleSpecimen } from "@/components/doodle-specimen";
import { VibeCycleButton } from "@/components/vibe-cycle-button";

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
  { href: "/projects", label: "Projects", symbol: "◇" },
  { href: "/games", label: "Games", symbol: "\u265F" },
  { href: "/art", label: "Art", symbol: "\u273F" },
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

  return (
    <aside className="site-sidebar" aria-label="Site navigation">
      <Link href="/" className="slow-garden-brand" aria-label="Cromblog home">
        <span className="slow-garden-brand-art" aria-hidden="true" />
        <span className="slow-garden-brand-name">Cromblog</span>
        <span className="slow-garden-brand-caption">Michael Crombie</span>
      </Link>
      <div>
        <div className="sidebar-ornament" aria-hidden="true" />
      </div>

      <nav className="site-nav" aria-label="Primary navigation">
        {navLinks.map((link) => {
          const label = link.label;
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

      <VibeCycleButton variant="navigation" />
      {pathname !== "/art" && !pathname.startsWith("/art/") ? <DoodleSpecimen /> : null}

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
