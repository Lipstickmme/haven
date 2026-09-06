import { Link } from "@tanstack/react-router";

export function PageHero({
  eyebrow,
  title,
  crumb,
}: {
  eyebrow: string;
  title: string;
  crumb: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink pt-40 pb-24 text-ink-foreground md:pt-52 md:pb-32">
      <div className="pointer-events-none absolute inset-0 plan-grid-dark" />
      <div className="relative mx-auto max-w-[92rem] px-5 md:px-10">
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">{title}</h1>
        <p className="mt-8 flex items-center gap-3 eyebrow text-ink-foreground/50">
          <Link to="/" className="hover:text-accent">
            Home
          </Link>
          <span className="h-px w-8 bg-ink-foreground/30" />
          {crumb}
        </p>
      </div>
    </section>
  );
}
