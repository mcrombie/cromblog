"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { projectOrder, projects, siteMeta } from "@/content/site";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" }
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card lg:sticky lg:top-8 lg:min-h-[calc(100vh-4rem)]">
      <div className="content-flow">
        <Link href="/" className="inline-block">
          <span className="font-serif text-3xl text-ink">Cromblog</span>
        </Link>
        <p className="max-w-xs text-sm leading-7 text-pine-700">
          A personal site for thoughtful software, history, and long-form work.
        </p>
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

      <section className="mt-10">
        <p className="text-xs uppercase tracking-[0.18em] text-pine-700">
          Projects
        </p>
        <div className="mt-4 content-flow">
          {projectOrder.map((slug) => {
            const project = projects[slug];
            const active = pathname === project.href;

            return (
              <Link
                key={project.slug}
                href={project.href}
                className={`block rounded-2xl px-4 py-3 text-sm leading-6 transition ${
                  active
                    ? "bg-pine-100 text-pine-900"
                    : "text-pine-700 hover:bg-white/60 hover:text-pine-900"
                }`}
              >
                {project.title}
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mt-10 rounded-3xl border border-[color:var(--border)] bg-pine-50/70 p-5">
        <p className="font-serif text-lg text-ink">About</p>
        <p className="mt-3 text-sm leading-7 text-pine-700">
          Quiet, durable work across software, historical inquiry, and writing
          that rewards sustained attention.
        </p>
      </div>

      <div className="mt-auto flex gap-3 pt-10 text-sm text-pine-700">
        <Link
          href={siteMeta.githubHref}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[color:var(--border)] px-4 py-2 hover:bg-white/60"
        >
          GitHub
        </Link>
        <Link
          href={siteMeta.linkedinHref}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[color:var(--border)] px-4 py-2 hover:bg-white/60"
        >
          LinkedIn
        </Link>
      </div>
    </aside>
  );
}

