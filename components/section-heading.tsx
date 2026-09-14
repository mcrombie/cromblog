import { NotebookDoodle } from "@/components/notebook-doodle";
import type { VibeDoodleId } from "@/content/doodle-vibe";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  doodle?: VibeDoodleId;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  doodle
}: SectionHeadingProps) {
  return (
    <header className={`section-heading${doodle ? " has-notebook-doodle" : ""}`}>
      {eyebrow ? (
        <p className="section-eyebrow">{eyebrow}</p>
      ) : null}
      <h1 className="section-title">{title}</h1>
      {description ? (
        <p className="section-description">{description}</p>
      ) : null}
      <span className="printer-rule" aria-hidden="true" />
      {doodle ? <NotebookDoodle id={doodle} className="section-heading-doodle" /> : null}
    </header>
  );
}
