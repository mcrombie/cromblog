import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export default function NotFoundPage() {
  return (
    <div className="content-flow">
      <SectionHeading
        eyebrow="Lost path / 404"
        title="This trail ends here."
        description="The page may have moved, or perhaps it never made it out of the mapmaker’s margins."
      />

      <section className="editorial-panel editorial-copy">
        <p>
          Return to the workshop, browse the field notes, or choose another
          route through the project cabinet.
        </p>
        <div className="home-actions">
          <Link href="/" className="folio-button folio-button-primary">
            Return home
          </Link>
          <Link href="/cromblog" className="folio-button">
            Browse Cromblog
          </Link>
          <Link href="/projects" className="folio-button">
            Browse projects
          </Link>
        </div>
      </section>
    </div>
  );
}
