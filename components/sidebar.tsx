"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <aside className="site-sidebar" aria-label="Site identity and navigation">
      <div>
        <Link
          href="/"
          className="site-brand"
          aria-label="Michael Crombie, home"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <span className="brand-seal" aria-hidden="true">
            MC
          </span>
          <span className="brand-copy">
            <span className="brand-name">Michael Crombie</span>
            <span className="brand-tagline">Software developer &amp; writer</span>
          </span>
        </Link>

        <div className="sidebar-ornament" aria-hidden="true" />
      </div>

      <nav className="site-nav" aria-label="Primary navigation">
        {navLinks.map((link) => {
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
              <span className="nav-label">{link.label}</span>
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
                key={link.label}
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
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              aria-label={`${link.label} (opens in a new tab)`}
            >
              {content}
            </a>
          ) : (
            <Link
              key={link.label}
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
