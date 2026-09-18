import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { FrameReveal } from "@/components/site/FrameReveal";
import { CATEGORIES, DISCIPLINES, PROJECTS, coverFor, type Discipline } from "@/lib/projects";
import arc1 from "@/assets/arc1.webp";

type Search = { discipline?: Discipline };

export const Route = createFileRoute("/projects")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const value = search["discipline"];
    return DISCIPLINES.includes(value as Discipline) ? { discipline: value as Discipline } : {};
  },
  head: () => ({
    meta: [
      { title: "Projects. Meastro Architecture" },
      {
        name: "description",
        content:
          "Twenty residential, cultural, civic, education, hospitality, workplace and retail projects by Meastro Architecture.",
      },
      { property: "og:title", content: "Projects. Meastro Architecture" },
      {
        property: "og:description",
        content: "Built and in-progress work, each with a before-and-after record.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { discipline } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");

  const byDiscipline = useMemo(
    () => (discipline ? PROJECTS.filter((p) => p.discipline === discipline) : PROJECTS),
    [discipline],
  );
  const list = useMemo(
    () => (cat === "All" ? byDiscipline : byDiscipline.filter((p) => p.category === cat)),
    [byDiscipline, cat],
  );

  const setDiscipline = (next: Discipline | undefined) => {
    setCat("All");
    void navigate({ search: next ? { discipline: next } : {}, replace: true });
  };

  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Projects"
        crumb="Projects"
        image={arc1}
        lead={`${PROJECTS.length} built and in-progress projects. Each one has its own record, what was there before, what is there now, and the parts worth looking at closely.`}
      />

      <section className="relative bg-background py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 plan-grid opacity-40" />
        <div className="relative mx-auto max-w-[92rem] px-5 md:px-10">
          <Reveal className="flex flex-wrap items-center gap-8 border-b border-border pb-6">
            {[undefined, ...DISCIPLINES].map((value) => (
              <button
                key={value ?? "all"}
                onClick={() => setDiscipline(value)}
                className={`font-display text-2xl transition-colors md:text-3xl ${
                  discipline === value
                    ? "text-foreground"
                    : "text-muted-foreground/50 hover:text-muted-foreground"
                }`}
              >
                {value ?? "All work"}
              </button>
            ))}
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap items-center gap-3 border-b border-border pb-8">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`border px-5 py-2 eyebrow transition-colors ${
                  cat === c
                    ? "border-accent text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
            <span className="ml-auto eyebrow text-muted-foreground">
              {list.length} {list.length === 1 ? "project" : "projects"}
            </span>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2">
            {list.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 100} className={i % 2 === 1 ? "md:mt-20" : ""}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="card-lift card-rule group block pb-5 hover:card-rule-active"
                >
                  <FrameReveal className="relative" delay={(i % 2) * 80}>
                    <img
                      src={coverFor(p)!}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-4/3 w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                    <span className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/12" />
                    <span className="absolute right-6 bottom-6 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-background text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={18} strokeWidth={1.4} />
                    </span>
                    {p.status !== "Built" ? (
                      <span className="eyebrow absolute top-5 left-5 bg-background/90 px-3 py-1.5 text-foreground">
                        {p.status}
                      </span>
                    ) : null}
                  </FrameReveal>
                  <div className="mt-6 flex items-baseline justify-between gap-6 border-t border-border pt-5">
                    <div>
                      <h2 className="text-2xl transition-colors group-hover:text-accent md:text-3xl">
                        {p.title}
                      </h2>
                      <p className="mt-2 eyebrow text-muted-foreground">
                        {p.category} · {p.place}
                      </p>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                        {p.blurb}
                      </p>
                    </div>
                    <span className="eyebrow text-muted-foreground">{p.year}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
