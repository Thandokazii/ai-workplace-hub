export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-8">
      {eyebrow ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      AI-generated content may contain errors. Review and verify important information before using
      it.
    </p>
  );
}
