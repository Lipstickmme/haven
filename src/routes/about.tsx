import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import about1 from "@/assets/about-1.jpg";
import about2 from "@/assets/about-2.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Blueprint Haven Architects" },
      {
        name: "description",
        content:
          "A studio of 62 architects, designers and researchers building calm, durable, low-carbon architecture.",
      },
      { property: "og:title", content: "About Blueprint Haven Architects" },
      {
        property: "og:description",
        content: "A studio building calm, durable, low-carbon architecture since 2004.",
      },
    ],
  }),
  component: About,
});

const VALUES = [
  {
    n: "01",
    title: "Site before style",
    body: "Orientation, climate and street life set the rules. The aesthetic follows.",
  },
  {
    n: "02",
    title: "Detail as ethics",
    body: "A well-made junction lasts longer, wastes less and reads as care.",
  },
  {
    n: "03",
    title: "Quiet longevity",
    body: "We design for the building's second and third decade, not its launch photos.",
  },
];

const TIMELINE = [
  { year: "2004", text: "Studio founded in Rochester with three people and one drawing board." },
  { year: "2011", text: "First cultural commission; the practice grows to twenty." },
  { year: "2018", text: "Sustainability unit formed; all projects modelled for embodied carbon." },
  { year: "2026", text: "62 people across architecture, interiors and research." },
];

function About() {
  return (
    <>
      <PageHero eyebrow="The studio" title="Architecture made to age well" crumb="About" />

      <section className="relative bg-background py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 plan-grid opacity-60" />
        <div className="relative mx-auto grid max-w-[92rem] gap-16 px-5 md:px-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative">
            <img
              src={about2}
              alt="Minimal interior with woven screen and dried branches"
              loading="lazy"
              width={900}
              height={900}
              className="w-[80%] object-cover"
            />
            <img
              src={about1}
              alt="Amber pendant lights against linen curtains"
              loading="lazy"
              width={900}
              height={1100}
              className="absolute -bottom-10 right-0 w-[52%] border-8 border-background object-cover"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow text-accent">Our approach</p>
            <h2 className="mt-6 text-4xl leading-[1.08] md:text-5xl">
              We draw slowly so buildings can be built quickly
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              Blueprint Haven works across housing, culture and hospitality. Each project begins
              with a week of looking: sun paths, sightlines, the noise of the street at seven in the
              morning. What follows is a set of drawings precise enough that the contractor never
              has to guess.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We keep the team deliberately mixed — architects beside interior designers,
              researchers beside model makers — so that structure, light and material are decided in
              the same room.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary py-24 md:py-32">
        <div className="mx-auto max-w-[92rem] px-5 md:px-10">
          <div className="grid gap-10 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.n} delay={i * 110} className="border-t border-foreground/20 pt-8">
                <p className="eyebrow text-accent">{v.n}</p>
                <h3 className="mt-5 text-2xl">{v.title}</h3>
                <p className="mt-3 text-muted-foreground">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24 md:py-32">
        <div className="mx-auto max-w-[92rem] px-5 md:px-10">
          <Reveal>
            <p className="eyebrow text-accent">Timeline</p>
            <h2 className="mt-6 text-4xl leading-[1.08] md:text-5xl">
              Twenty-two years of building
            </h2>
          </Reveal>
          <div className="mt-14 border-t border-border">
            {TIMELINE.map((t, i) => (
              <Reveal
                key={t.year}
                delay={i * 90}
                className="grid gap-4 border-b border-border py-8 md:grid-cols-[10rem_1fr] md:py-10"
              >
                <p className="font-display text-3xl text-accent">{t.year}</p>
                <p className="max-w-2xl text-lg text-muted-foreground">{t.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
