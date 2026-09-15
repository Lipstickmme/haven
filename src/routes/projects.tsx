import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { ProjectImage } from "@/components/site/ProjectImage";
import { Reveal } from "@/components/site/Reveal";
import { CATEGORIES, PROJECTS, coverFor } from "@/lib/projects";
import arc1 from "@/assets/arc1.webp";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Meastro Architecture" },
      {
        name: "description",
        content:
          "Twenty residential, cultural, civic, education, hospitality, workplace and retail projects by Meastro Architecture.",
      },
      { property: "og:title", content: "Projects — Meastro Architecture" },
      {
        property: "og:description",
        content: "Built and in-progress work, each with a before-and-after record.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const list = useMemo(
    () => (cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === cat)),
    [cat],
  );

  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Projects"
        crumb="Projects"
        image={arc1}
        lead={`${PROJECTS.length} built and in-progress projects. Each one has its own record — what was there before, what is there now, and the parts worth looking at closely.`}
      />

      <section className="relative bg-background py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 plan-grid opacity-40" />
        <div className="relative mx-auto max-w-[92rem] px-5 md:px-10">
          <Reveal className="flex flex-wrap items-center gap-3 border-b border-border pb-8">
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
                  <div className="relative overflow-hidden">
                    <ProjectImage
                      src={coverFor(p)}
                      alt={p.title}
                      label={p.title}
                      className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
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
                  </div>
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
