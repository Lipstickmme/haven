import { Link } from "@tanstack/react-router";

export function PageHero({
  eyebrow,
  title,
  crumb,
  image,
  lead,
}: {
  eyebrow: string;
  title: string;
  crumb: string;
  /** Full-bleed backdrop. Without one the band falls back to flat ink. */
  image?: string;
  /** Optional standfirst under the title. */
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink pb-24 pt-40 text-ink-foreground md:pb-32 md:pt-52">
      {image ? (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            width={1344}
            height={576}
            className="kenburns absolute inset-0 h-full w-full object-cover"
          />
          {/* Weighted to the left, where the text is, instead of a flat wash
              over the whole photograph. */}
          <div className="page-hero-scrim absolute inset-0" />
        </>
      ) : null}
      <div className="pointer-events-none absolute inset-0 plan-grid-dark" />
      <div className="relative mx-auto max-w-[92rem] px-5 md:px-10">
        <p className="eyebrow text-accent-ink">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">{title}</h1>
        {lead ? (
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-foreground/70">{lead}</p>
        ) : null}
        <p className="mt-8 flex items-center gap-3 eyebrow text-ink-foreground/50">
          <Link to="/" className="hover:text-accent">
            Home
          </Link>
          <span className="opacity-40">/</span>
          {crumb}
        </p>
      </div>
    </section>
  );
}
