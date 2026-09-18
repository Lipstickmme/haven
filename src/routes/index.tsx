import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { HeroShutter } from "@/components/site/HeroShutter";
import { WordRise } from "@/components/site/WordRise";
import { FrameReveal } from "@/components/site/FrameReveal";
import { PROJECTS, projectLabels } from "@/lib/projects";
import { ProjectCover } from "@/components/site/ProjectCover";
import arc2 from "@/assets/arc2.webp";
import arc5 from "@/assets/arc5.webp";
import arc6 from "@/assets/arc6.webp";
import arc4 from "@/assets/arc4.webp";
import about2 from "@/assets/about-2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meastro Architecture. Architecture & Interior Design" },
      {
        name: "description",
        content:
          "Award-winning architecture and interior design studio crafting spaces that balance beauty, function and sustainability.",
      },
      { property: "og:title", content: "Meastro Architecture" },
      {
        property: "og:description",
        content:
          "Architecture and interior design studio crafting spaces that balance beauty, function and sustainability.",
      },
    ],
  }),
  component: Home,
});

/** Exteriors only. The hero is the practice's shopfront; it shows buildings. */
const SLIDES = [
  { src: arc6, title: "Designing Your Dream, Building Your Vision" },
  { src: arc5, title: "Quiet Volumes, Carefully Placed" },
  { src: arc2, title: "Civic Rooms Built to Outlast Us" },
];

const STATS = [
  { value: "250+", label: "Projects" },
  { value: "200+", label: "Clients" },
  { value: "11", label: "Awards" },
  { value: "62", label: "Experts" },
];

const SERVICES = [
  {
    n: "01",
    title: "Architectural Design",
    body: "Concept to construction documentation, resolved down to the last junction.",
  },
  {
    n: "02",
    title: "Interior Architecture",
    body: "Material palettes, joinery and lighting designed as one continuous idea.",
  },
  {
    n: "03",
    title: "Urban & Masterplanning",
    body: "Reading the site, the light and the street before drawing a single line.",
  },
  {
    n: "04",
    title: "Sustainable Consulting",
    body: "Low-carbon strategies, passive comfort and honest lifecycle thinking.",
  },
];

/** Three built projects, straight from the project record. */
const FEATURED = PROJECTS.filter((p) => p.status === "Built").slice(0, 3);

function Home() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, []);

  const go = (d: number) => setI((v) => (v + d + SLIDES.length) % SLIDES.length);

  return (
    <>
      {/* Hero slider */}
      <section className="relative h-[100svh] overflow-hidden bg-ink">
        <HeroShutter slides={SLIDES} index={i} />
        {/* z-3: the shutter's slides paint at z-index 1 and 2, so an unlayered
            overlay lands underneath the photograph and does nothing. */}
        <div className="hero-scrim pointer-events-none absolute inset-0 z-3" />
        <div className="plan-grid-dark pointer-events-none absolute inset-0 z-3" />

        <div className="relative z-10 mx-auto flex h-full max-w-[92rem] flex-col justify-center px-5 text-center md:px-10">
          {/* Near-white rather than coffee: this kicker sits directly on the
              photograph, where the brand brown drops to about 2:1. The accent
              still carries every section on a solid ground. */}
          <p className="eyebrow text-ink-foreground/85">Architecture · Interiors · Since 2004</p>
          <h1
            key={i}
            className="mx-auto mt-8 max-w-5xl animate-fade-in font-display text-[2.75rem] leading-[1.02] text-ink-foreground md:text-[5.5rem]"
          >
            {SLIDES[i]!.title}
          </h1>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/projects"
              search={{ discipline: "Architecture" }}
              className="group eyebrow inline-flex items-center gap-4 bg-ink-foreground px-8 py-4 text-ink transition-colors hover:bg-accent-ink"
            >
              Architecture
              <ArrowUpRight
                size={16}
                strokeWidth={1.4}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/projects"
              search={{ discipline: "Interior Design" }}
              className="group eyebrow inline-flex items-center gap-4 border border-ink-foreground/40 px-8 py-4 text-ink-foreground transition-colors hover:border-accent-ink hover:text-accent-ink"
            >
              Interior Design
              <ArrowUpRight
                size={16}
                strokeWidth={1.4}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* pr-24 keeps the arrows clear of the fixed chat launcher in the corner. */}
        <div className="absolute inset-x-0 bottom-10 z-10 mx-auto flex max-w-[92rem] items-center justify-between px-5 pr-24 md:px-10 md:pr-28">
          <span className="eyebrow text-ink-foreground/60">
            0{i + 1} <span className="mx-2 opacity-40">/</span> 0{SLIDES.length}
          </span>
          <div className="flex gap-3">
            {[-1, 1].map((d) => (
              <button
                key={d}
                aria-label={d === -1 ? "Previous slide" : "Next slide"}
                onClick={() => go(d)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-foreground/40 text-ink-foreground transition-colors hover:border-accent-ink hover:text-accent-ink"
              >
                {d === -1 ? (
                  <ArrowLeft size={18} strokeWidth={1.3} />
                ) : (
                  <ArrowRight size={18} strokeWidth={1.3} />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="relative bg-background py-24 md:py-36">
        <div className="pointer-events-none absolute inset-0 plan-grid opacity-60" />
        <div className="relative mx-auto grid max-w-[92rem] gap-16 px-5 md:px-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative">
            <img
              src={arc4}
              alt="Amber glass pendant lights in a warm interior"
              loading="lazy"
              width={900}
              height={1100}
              className="w-[78%] object-cover"
            />
            <img
              src={about2}
              alt="Minimal plaster wall with woven screen and dried branches"
              loading="lazy"
              width={900}
              height={900}
              className="absolute bottom-[-3rem] right-0 w-[62%] border-8 border-background object-cover"
            />
          </Reveal>

          <Reveal delay={120} className="lg:pl-6">
            <p className="eyebrow draw-rule draw-rule-in text-accent">About the studio</p>
            <WordRise
              text="About Meastro Architecture"
              className="mt-6 text-4xl leading-[1.08] md:text-6xl"
            />
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We are an architecture and interior design studio drawn to clarity: rooms that hold
              daylight well, plans that make sense at walking speed, and details that will still
              feel considered in thirty years. Every project starts with the site and ends with the
              people who live in it.
            </p>

            <Reveal delay={220}>
              <Link
                to="/about"
                className="eyebrow link-underline mt-10 inline-flex items-center gap-3 hover:text-accent"
              >
                More about the studio
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </Link>
            </Reveal>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-ink py-20 text-ink-foreground md:py-28">
        <div className="pointer-events-none absolute inset-0 plan-grid-dark" />
        <div className="relative mx-auto grid max-w-[92rem] grid-cols-2 gap-y-14 px-5 md:grid-cols-4 md:px-10">
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 120} className="text-center">
              <p className="font-display text-5xl md:text-7xl">{s.value}</p>
              <p className="mt-4 eyebrow text-ink-foreground/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-background py-24 md:py-36">
        <div className="mx-auto max-w-[92rem] px-5 md:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="eyebrow draw-rule draw-rule-in text-accent">What we do</p>
              <h2 className="mt-6 max-w-2xl text-4xl leading-[1.08] md:text-6xl">
                Four disciplines, one drawing set
              </h2>
            </div>
            <Link to="/services" className="eyebrow link-underline hover:text-accent">
              All services
            </Link>
          </Reveal>

          <div className="mt-16 grid border-t border-border md:grid-cols-2">
            {SERVICES.map((s, idx) => (
              <Reveal
                key={s.n}
                delay={idx * 90}
                className="group border-b border-border p-8 transition-colors hover:bg-secondary md:p-12 md:[&:nth-child(odd)]:border-r"
              >
                <p className="eyebrow draw-rule draw-rule-in text-accent">{s.n}</p>
                <h3 className="mt-6 text-2xl md:text-3xl">{s.title}</h3>
                <p className="mt-4 max-w-md text-muted-foreground">{s.body}</p>
                <ArrowUpRight
                  size={20}
                  strokeWidth={1.3}
                  className="mt-8 text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="bg-secondary py-24 md:py-36">
        <div className="mx-auto max-w-[92rem] px-5 md:px-10">
          <Reveal>
            <p className="eyebrow draw-rule draw-rule-in text-accent">Selected work</p>
            <WordRise text="Recent projects" className="mt-6 text-4xl leading-[1.08] md:text-6xl" />
          </Reveal>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {FEATURED.map((p, idx) => (
              <Reveal key={p.slug} delay={idx * 120}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="card-lift card-rule group block pb-5 hover:card-rule-active"
                >
                  <div className="overflow-hidden">
                    <ProjectCover project={p} />
                  </div>
                  <h3 className="mt-6 text-2xl transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-2 eyebrow text-muted-foreground">
                    {projectLabels(p).join(" · ")}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee CTA */}
      <section className="overflow-hidden border-y border-border bg-background py-10">
        <div className="flex w-max marquee-track gap-14 pr-14">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex gap-14">
              {["Architecture", "Interiors", "Masterplanning", "Sustainability", "Research"].map(
                (w) => (
                  <span
                    key={w + dup}
                    className="flex items-center gap-14 font-display text-4xl text-foreground/70 md:text-6xl"
                  >
                    {w}
                    <span className="h-2 w-2 rounded-full bg-accent" />
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-24 md:py-32">
        <Reveal className="mx-auto max-w-3xl px-5 text-center md:px-10">
          <WordRise
            text="Have a site, a brief, or just an instinct?"
            className="text-4xl leading-[1.08] md:text-6xl"
          />
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-4 bg-primary px-9 py-4 eyebrow text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Start a conversation
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
