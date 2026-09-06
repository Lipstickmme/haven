import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import arc4 from "@/assets/arc4.webp";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Blueprint Haven Architects" },
      {
        name: "description",
        content:
          "Architectural design, interior architecture, masterplanning, sustainability consulting, visualisation and site supervision.",
      },
      { property: "og:title", content: "Services — Blueprint Haven Architects" },
      {
        property: "og:description",
        content: "Six disciplines, from first sketch to final site inspection.",
      },
    ],
  }),
  component: Services,
});

const SERVICES = [
  {
    n: "01",
    title: "Architectural Design",
    body: "Feasibility, concept, permits and construction documentation for new build and adaptive reuse.",
    tags: ["Feasibility", "Permits", "Tender sets"],
  },
  {
    n: "02",
    title: "Interior Architecture",
    body: "Spatial planning, joinery design, material palettes and lighting resolved as one system.",
    tags: ["Joinery", "Lighting", "FF&E"],
  },
  {
    n: "03",
    title: "Urban & Masterplanning",
    body: "Density studies, public realm strategy and phasing for sites from one block to one district.",
    tags: ["Density", "Public realm", "Phasing"],
  },
  {
    n: "04",
    title: "Sustainable Consulting",
    body: "Embodied carbon modelling, passive comfort strategy and low-impact material sourcing.",
    tags: ["Carbon", "Passive design", "Certification"],
  },
  {
    n: "05",
    title: "Visualisation & Models",
    body: "Physical models and calibrated renders used as design tools, not sales images.",
    tags: ["Models", "Renders", "Film"],
  },
  {
    n: "06",
    title: "Site Supervision",
    body: "Weekly site presence, shop-drawing review and quality control through handover.",
    tags: ["Inspection", "Shop drawings", "Handover"],
  },
];

const PROCESS = [
  {
    n: "Phase 01",
    title: "Listen & survey",
    body: "Brief workshops, site survey, sun and noise study.",
  },
  { n: "Phase 02", title: "Concept", body: "Two divergent options, tested in model and section." },
  {
    n: "Phase 03",
    title: "Develop",
    body: "Structure, services and materials coordinated in one model.",
  },
  {
    n: "Phase 04",
    title: "Build",
    body: "Documentation, tender support and supervision to handover.",
  },
];

function Services() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="Six disciplines, one drawing set"
        crumb="Services"
        image={arc4}
        lead="Architecture, interiors, landscape and delivery held in a single coordinated model, so nothing falls between consultants."
      />

      <section className="relative bg-background py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 plan-grid opacity-60" />
        <div className="relative mx-auto max-w-[92rem] px-5 md:px-10">
          <div className="grid border-t border-border md:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal
                key={s.n}
                delay={i * 80}
                className="group border-b border-border p-8 transition-colors hover:bg-secondary md:p-10 md:[&:not(:nth-child(3n))]:border-r"
              >
                <p className="eyebrow text-accent">{s.n}</p>
                <h2 className="mt-6 text-2xl md:text-3xl">{s.title}</h2>
                <p className="mt-4 text-muted-foreground">{s.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li
                      key={t}
                      className="border border-border px-3 py-1 eyebrow text-muted-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink py-24 text-ink-foreground md:py-32">
        <div className="pointer-events-none absolute inset-0 plan-grid-dark" />
        <div className="relative mx-auto max-w-[92rem] px-5 md:px-10">
          <Reveal>
            <p className="eyebrow text-accent">How we work</p>
            <h2 className="mt-6 text-4xl leading-[1.08] md:text-5xl">From brief to handover</h2>
          </Reveal>
          <div className="mt-16 grid gap-10 md:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 110} className="border-t border-ink-foreground/25 pt-8">
                <p className="eyebrow text-accent">{p.n}</p>
                <h3 className="mt-5 text-2xl">{p.title}</h3>
                <p className="mt-3 text-ink-foreground/60">{p.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <Link
              to="/contact"
              className="mt-16 inline-flex items-center gap-4 border border-ink-foreground/40 px-9 py-4 eyebrow transition-colors hover:border-accent hover:text-accent"
            >
              Request a proposal
              <ArrowUpRight size={16} strokeWidth={1.4} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
