/** Shared layout for plain text pages: H1 + narrow single column of sections. */
export function TextPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="pt-section">
      <h1 className="text-display">{title}</h1>
      <div className="mt-12 grid max-w-measure gap-12">{children}</div>
    </article>
  );
}

export function TextSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="scroll-mt-[calc(var(--spacing-nav)+1rem)]">
      <h2 id={id ? `${id}-title` : undefined} className="mb-3 font-sans text-meta text-muted">
        {title}
      </h2>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}
