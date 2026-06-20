interface PageHeroProps {
  title: string;
  accent: string;
  subtitle?: string;
}

export function PageHero({ title, accent, subtitle }: PageHeroProps) {
  const base = title.replace(accent, '').trim();

  return (
    <section className="relative pt-36 pb-16 text-center">
      <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/10 blur-[100px] dark:bg-accent/5" />
      <div className="relative mx-auto max-w-3xl px-4">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Techloom
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          {base}{base ? ' ' : ''}
          <span className="text-gradient-shimmer">{accent}</span>
        </h1>
        {subtitle && (
          <p className="mt-5 text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </section>
  );
}