import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";
import project6 from "@/assets/project-6.jpg";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Blueprint Haven Architects" },
      {
        name: "description",
        content:
          "Selected residential, cultural, hospitality, workplace and retail projects by Blueprint Haven Architects.",
      },
      { property: "og:title", content: "Projects — Blueprint Haven Architects" },
      {
        property: "og:description",
        content: "Residential, cultural, hospitality, workplace and retail architecture.",
      },
    ],
  }),
  component: Projects,
});

const PROJECTS = [
  {
    src: project1,
    title: "Solstice Penthouse",
    cat: "Residential",
    place: "New York",
    year: "2025",
  },
  { src: project2, title: "Fold Museum Annex", cat: "Cultural", place: "Rotterdam", year: "2024" },
  {
    src: project3,
    title: "Travertine House Hotel",
    cat: "Hospitality",
    place: "Lisbon",
    year: "2024",
  },
  { src: project4, title: "Ironworks Studio", cat: "Workplace", place: "Rochester", year: "2023" },
  {
    src: project5,
    title: "Cliff Terrace Residence",
    cat: "Residential",
    place: "Amalfi",
    year: "2023",
  },
  { src: project6, title: "Marble Line Flagship", cat: "Retail", place: "Milan", year: "2022" },
];

const CATS = ["All", "Residential", "Cultural", "Hospitality", "Workplace", "Retail"] as const;

function Projects() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const list = useMemo(
    () => (cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.cat === cat)),
    [cat],
  );

  return (
    <>
      <PageHero eyebrow="Selected work" title="Projects" crumb="Projects" />

      <section className="relative bg-background py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 plan-grid opacity-60" />
        <div className="relative mx-auto max-w-[92rem] px-5 md:px-10">
          <Reveal className="flex flex-wrap gap-3 border-b border-border pb-8">
            {CATS.map((c) => (
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
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2">
            {list.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 100} className={i % 2 === 1 ? "md:mt-20" : ""}>
                <Link to="/contact" className="group block">
                  <div className="relative overflow-hidden">
                    <img
                      src={p.src}
                      alt={p.title}
                      loading="lazy"
                      width={1200}
                      height={900}
                      className="aspect-4/3 w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/25" />
                    <span className="absolute bottom-6 right-6 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-background text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={18} strokeWidth={1.4} />
                    </span>
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-6 border-t border-border pt-5">
                    <div>
                      <h2 className="text-2xl transition-colors group-hover:text-accent md:text-3xl">
                        {p.title}
                      </h2>
                      <p className="mt-2 eyebrow text-muted-foreground">
                        {p.cat} · {p.place}
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
