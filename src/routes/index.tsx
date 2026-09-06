import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import about1 from "@/assets/about-1.jpg";
import about2 from "@/assets/about-2.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blueprint Haven Architects — Architecture & Interior Design" },
      {
        name: "description",
        content:
          "Award-winning architecture and interior design studio crafting spaces that balance beauty, function and sustainability.",
      },
      { property: "og:title", content: "Blueprint Haven Architects" },
      {
        property: "og:description",
        content:
          "Architecture and interior design studio crafting spaces that balance beauty, function and sustainability.",
      },
    ],
  }),
  component: Home,
});

const SLIDES = [
  { src: hero1, title: "Designing Your Dream, Building Your Vision" },
  { src: hero2, title: "Structures That Hold Light and Time" },
];

const STATS = [
  { value: "250+", label: "Projects" },
  { value: "200+", label: "Clients" },
  { value: "11", label: "Awards" },
  { value: "62", label: "Experts" },
];

const SKILLS = [
  { label: "Architecture", value: 98 },
  { label: "Interior Design", value: 99 },
  { label: "Sustainable Design Solutions", value: 95 },
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

const FEATURED = [
  { src: project1, title: "Solstice Penthouse", meta: "Residential · New York" },
  { src: project2, title: "Fold Museum Annex", meta: "Cultural · Rotterdam" },
  { src: project3, title: "Travertine House Hotel", meta: "Hospitality · Lisbon" },
];

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
        {SLIDES.map((s, idx) => (
          <div
            key={s.title}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={s.src}
              alt={s.title}
              width={1920}
              height={1080}
              className={`h-full w-full object-cover ${idx === i ? "kenburns" : ""}`}
            />
            <div className="absolute inset-0 bg-ink/55" />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 plan-grid-dark" />

        <div className="relative z-10 mx-auto flex h-full max-w-[92rem] flex-col justify-center px-5 text-center md:px-10">
          <p className="eyebrow text-accent">Architecture · Interiors · Since 2004</p>
          <h1
            key={i}
            className="mx-auto mt-8 max-w-5xl animate-fade-in font-display text-[2.75rem] leading-[1.02] text-ink-foreground md:text-[5.5rem]"
          >
            {SLIDES[i]!.title}
          </h1>
          <div className="mt-12 flex justify-center">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-4 border border-ink-foreground/40 px-8 py-4 eyebrow text-ink-foreground transition-colors hover:border-accent hover:text-accent"
            >
              View Selected Work
              <ArrowUpRight
                size={16}
                strokeWidth={1.4}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-10 z-10 mx-auto flex max-w-[92rem] items-center justify-between px-5 md:px-10">
          <span className="eyebrow text-ink-foreground/60">
            0{i + 1} <span className="mx-2 opacity-40">/</span> 0{SLIDES.length}
          </span>
          <div className="flex gap-3">
            {[-1, 1].map((d) => (
              <button
                key={d}
                aria-label={d === -1 ? "Previous slide" : "Next slide"}
                onClick={() => go(d)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-foreground/40 text-ink-foreground transition-colors hover:border-accent hover:text-accent"
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
              src={about1}
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
            <p className="eyebrow text-accent">About the studio</p>
            <h2 className="mt-6 text-4xl leading-[1.08] md:text-6xl">
              About Blueprint Haven Architects
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We are an architecture and interior design studio drawn to clarity: rooms that hold
              daylight well, plans that make sense at walking speed, and details that will still
              feel considered in thirty years. Every project starts with the site and ends with the
              people who live in it.
            </p>

            <div className="mt-12 space-y-8">
              {SKILLS.map((s, idx) => (
                <Reveal key={s.label} delay={200 + idx * 100}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">{s.label}</span>
                    <span className="text-sm font-medium">{s.value}%</span>
                  </div>
                  <div className="mt-3 h-px w-full bg-border">
                    <div
                      className="h-px bg-accent transition-[width] duration-[1400ms] ease-out"
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
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
              <p className="eyebrow text-accent">What we do</p>
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
                <p className="eyebrow text-accent">{s.n}</p>
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
            <p className="eyebrow text-accent">Selected work</p>
            <h2 className="mt-6 text-4xl leading-[1.08] md:text-6xl">Recent projects</h2>
          </Reveal>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {FEATURED.map((p, idx) => (
              <Reveal key={p.title} delay={idx * 120}>
                <Link to="/projects" className="group block">
                  <div className="overflow-hidden">
                    <img
                      src={p.src}
                      alt={p.title}
                      loading="lazy"
                      width={1200}
                      height={900}
                      className="aspect-4/3 w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-6 text-2xl transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-2 eyebrow text-muted-foreground">{p.meta}</p>
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
          <h2 className="text-4xl leading-[1.08] md:text-6xl">
            Have a site, a brief, or just an instinct?
          </h2>
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
