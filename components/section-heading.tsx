type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description
}: SectionHeadingProps) {
  return (
    <header className="section-heading">
      {eyebrow ? (
        <p className="section-eyebrow">{eyebrow}</p>
      ) : null}
      <h1 className="section-title">{title}</h1>
      {description ? (
        <p className="section-description">{description}</p>
      ) : null}
      <span className="printer-rule" aria-hidden="true" />
    </header>
  );
}
