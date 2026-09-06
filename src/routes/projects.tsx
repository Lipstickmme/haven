import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import arc1 from "@/assets/arc1.webp";
import arc2 from "@/assets/arc2.webp";
import arc3 from "@/assets/arc3.webp";
import arc4 from "@/assets/arc4.webp";
import arc5 from "@/assets/arc5.webp";
import arc6 from "@/assets/arc6.webp";
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
    blurb: "A double-height apartment reorganised around a single north-facing window wall.",
  },
  {
    src: arc2,
    title: "Halden Civic Centre",
    cat: "Civic",
    place: "Oslo",
    year: "2025",
    blurb: "Council chamber, library and public hall under one board-marked concrete roof.",
  },
  {
    src: project2,
    title: "Fold Museum Annex",
    cat: "Cultural",
    place: "Rotterdam",
    year: "2024",
    blurb: "A folded roof plane that brings even daylight into the print collection below.",
  },
  {
    src: arc6,
    title: "Lantern House",
    cat: "Residential",
    place: "Connecticut",
    year: "2024",
    blurb: "Two storeys of glass and render that read as a lantern once the light drops.",
  },
  {
    src: project3,
    title: "Travertine House Hotel",
    cat: "Hospitality",
    place: "Lisbon",
    year: "2024",
    blurb: "Thirty-one rooms cut into a hillside, each with its own shaded loggia.",
  },
  {
    src: arc4,
    title: "Bastion Arts Foundation",
    cat: "Cultural",
    place: "Antwerp",
    year: "2025",
    blurb: "A cantilevered gallery box held clear of the street on a rusticated plinth.",
  },
  {
    src: project4,
    title: "Ironworks Studio",
    cat: "Workplace",
    place: "Rochester",
    year: "2023",
    blurb: "A former foundry reworked into forty studio desks and a shared making floor.",
  },
  {
    src: arc5,
    title: "Carriage Lane House",
    cat: "Residential",
    place: "Rochester",
    year: "2023",
    blurb: "Dark brick above, open carport below, on a tight suburban corner plot.",
  },
  {
    src: project5,
    title: "Cliff Terrace Residence",
    cat: "Residential",
    place: "Amalfi",
    year: "2023",
    blurb: "Four stepped terraces that follow the rock rather than cutting into it.",
  },
  {
    src: project6,
    title: "Marble Line Flagship",
    cat: "Retail",
    place: "Milan",
    year: "2022",
    blurb: "A single slab of Carrara drawn through the shop as counter, stair and sill.",
  },
];

const CATS = [
  "All",
  "Residential",
  "Cultural",
  "Civic",
  "Hospitality",
  "Workplace",
  "Retail",
] as const;

function Projects() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const list = useMemo(
    () => (cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.cat === cat)),
    [cat],
  );

  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Projects"
        crumb="Projects"
        image={arc1}
        lead="Ten built and in-progress projects across residential, cultural, civic, hospitality, workplace and retail work."
      />

      <section className="relative bg-background py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 plan-grid opacity-60" />
        <div className="relative mx-auto max-w-[92rem] px-5 md:px-10">
          <Reveal className="flex flex-wrap items-center gap-3 border-b border-border pb-8">
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
            <span className="ml-auto eyebrow text-muted-foreground">
              {list.length} {list.length === 1 ? "project" : "projects"}
            </span>
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

      <section className="border-t border-border bg-secondary py-24 md:py-32">
        <div className="mx-auto grid max-w-[92rem] items-center gap-16 px-5 md:px-10 lg:grid-cols-2">
          <Reveal>
            <img
              src={arc3}
              alt="Four studies from the studio archive: a coastal villa, a timber house, a white courtyard and a facade detail"
              loading="lazy"
              width={1344}
              height={576}
              className="w-full object-cover"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow text-accent">From the archive</p>
            <h2 className="mt-6 font-display text-4xl leading-tight md:text-5xl">
              Every project starts as four or five studies.
            </h2>
            <p className="mt-6 max-w-xl text-muted-foreground">
              We test a brief against the site in physical models and full-height sections before a
              single visual is made. Most of what we draw never gets built — that is the point. By
              the time a scheme reaches planning it has already survived the alternatives.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { v: "250+", l: "Projects" },
                { v: "22", l: "Years" },
                { v: "11", l: "Awards" },
              ].map((stat) => (
                <div key={stat.l}>
                  <dt className="font-display text-3xl md:text-4xl">{stat.v}</dt>
                  <dd className="mt-2 eyebrow text-muted-foreground">{stat.l}</dd>
                </div>
              ))}
            </dl>
            <Link
              to="/contact"
              className="eyebrow mt-10 inline-flex items-center gap-4 bg-primary px-9 py-4 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Start a project
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
