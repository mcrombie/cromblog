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
    <header className="content-flow">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
      {description ? (
        <p className="editorial-copy text-base leading-8 text-pine-700">
          {description}
        </p>
      ) : null}
    </header>
  );
}

