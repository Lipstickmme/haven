import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Reveal } from "@/components/site/Reveal";
import { WordRise } from "@/components/site/WordRise";
import { FrameReveal } from "@/components/site/FrameReveal";
import {
  PROJECTS,
  coverFor,
  partsWithImages,
  projectBySlug,
  projectImage,
  projectLabels,
} from "@/lib/projects";

export const Route = createFileRoute("/projects_/$slug")({
  loader: ({ params }) => {
    const project = projectBySlug(params.slug);
    if (!project) throw notFound();
    return { slug: project.slug };
  },
  head: ({ loaderData }) => {
    const project = loaderData ? projectBySlug(loaderData.slug) : undefined;
    if (!project) return {};
    return {
      meta: [
        { title: `${project.title}. Meastro Architecture` },
        { name: "description", content: project.summary },
        { property: "og:title", content: `${project.title}. Meastro Architecture` },
        { property: "og:description", content: project.summary },
      ],
    };
  },
  component: ProjectProfile,
});

function ProjectProfile() {
  const { slug } = Route.useLoaderData();
  const project = projectBySlug(slug)!;

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]!;
  const next = PROJECTS[(index + 1) % PROJECTS.length]!;

  const before = projectImage(project.slug, "before");
  const after = projectImage(project.slug, "after") ?? coverFor(project);
  const parts = partsWithImages(project);
  // "The building" is the wrong noun for an interiors commission.
  const subject = project.discipline === "Interior Design" ? "interior" : "building";

  // Eight facts, four to a row, so the grid fills rather than leaving a gap.
  const facts = [
    { label: "Discipline", value: project.discipline },
    { label: "Sector", value: project.sector },
    { label: "Type", value: project.category },
    { label: "Location", value: project.place },
    { label: "Year", value: project.year },
    { label: "Status", value: project.status },
    { label: "Area", value: project.size },
    { label: "Client", value: project.client },
  ];

  return (
    <>
      {/* Hero ------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-ink pt-40 pb-20 text-ink-foreground md:pt-52 md:pb-28">
        {coverFor(project) ? (
          <img
            src={coverFor(project)!}
            alt=""
            aria-hidden="true"
            className="kenburns absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="page-hero-scrim absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 plan-grid-dark" />

        <div className="relative mx-auto max-w-[92rem] px-5 md:px-10">
          <p className="eyebrow text-accent-ink">{projectLabels(project).join(" · ")}</p>
          <WordRise
            as="h1"
            text={project.title}
            className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl"
          />
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-foreground/75">
            {project.summary}
          </p>
          <p className="mt-8 flex items-center gap-3 eyebrow text-ink-foreground/50">
            <Link to="/projects" className="hover:text-accent-ink">
              Projects
            </Link>
            <span className="opacity-40">/</span>
            {project.title}
          </p>
        </div>
      </section>

      {/* Facts ----------------------------------------------------------- */}
      <section className="border-b border-border bg-background">
        <dl className="mx-auto grid max-w-[92rem] grid-cols-2 gap-px bg-border px-5 sm:grid-cols-4 md:px-10">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-background py-7">
              <dt className="eyebrow text-muted-foreground">{fact.label}</dt>
              <dd className="mt-2 text-base">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Narrative ------------------------------------------------------- */}
      <section className="relative bg-background py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 plan-grid opacity-40" />
        <div className="relative mx-auto grid max-w-[92rem] gap-12 px-5 md:px-10 lg:grid-cols-[18rem_1fr]">
          <Reveal>
            <p className="eyebrow draw-rule draw-rule-in text-accent">The project</p>
          </Reveal>
          <Reveal delay={100} className="max-w-3xl space-y-6">
            {project.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-lg leading-relaxed text-foreground/85"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Before and after ------------------------------------------------ */}
      {before || after ? (
        <section className="border-t border-border bg-secondary py-20 md:py-28">
          <div className="mx-auto max-w-[92rem] px-5 md:px-10">
            <Reveal>
              <p className="eyebrow draw-rule draw-rule-in text-accent">
                {before && after ? "Before and after" : `The ${subject}`}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-3xl leading-tight md:text-4xl">
                {before && after
                  ? "What was here, and what is here now."
                  : before
                    ? "The space as we found it."
                    : `The ${subject} as completed.`}
              </h2>
            </Reveal>
            <Reveal delay={120} className="mt-10">
              {before && after ? (
                <BeforeAfter
                  title={project.title}
                  before={before}
                  after={after}
                  beforeCaption={project.beforeCaption}
                  afterCaption={project.afterCaption}
                />
              ) : (
                <figure className="m-0">
                  <img
                    src={(before ?? after)!}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-16/9 w-full object-cover"
                  />
                  <figcaption className="mt-5 text-sm text-muted-foreground">
                    {before ? project.beforeCaption : project.afterCaption}
                  </figcaption>
                </figure>
              )}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Parts of the building ------------------------------------------- */}
      {parts.length > 0 ? (
        <section className="bg-background py-20 md:py-28">
          <div className="mx-auto max-w-[92rem] px-5 md:px-10">
            <Reveal>
              <p className="eyebrow draw-rule draw-rule-in text-accent">Parts of the {subject}</p>
            </Reveal>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {parts.map((part, i) => (
                <Reveal key={part.title} delay={i * 90}>
                  <figure className="card-lift card-rule group m-0 pb-5">
                    <FrameReveal delay={i * 60}>
                      <img
                        src={part.src}
                        alt={`${project.title}, ${part.title}`}
                        loading="lazy"
                        decoding="async"
                        className="aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                      />
                    </FrameReveal>
                    <figcaption className="mt-5">
                      <h3 className="text-lg">{part.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {part.caption}
                      </p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Neighbours ------------------------------------------------------ */}
      <section className="border-t border-border bg-background py-16">
        <div className="mx-auto flex max-w-[92rem] flex-wrap items-center justify-between gap-6 px-5 md:px-10">
          <Link
            to="/projects/$slug"
            params={{ slug: prev.slug }}
            className="group flex items-center gap-3 eyebrow text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} strokeWidth={1.4} />
            {prev.title}
          </Link>
          <Link to="/projects" className="eyebrow link-underline hover:text-accent">
            All projects
          </Link>
          <Link
            to="/projects/$slug"
            params={{ slug: next.slug }}
            className="group flex items-center gap-3 eyebrow text-muted-foreground transition-colors hover:text-accent"
          >
            {next.title}
            <ArrowRight size={16} strokeWidth={1.4} />
          </Link>
        </div>
      </section>

      {/* Enquiry --------------------------------------------------------- */}
      <section className="bg-secondary py-20 md:py-28">
        <Reveal className="mx-auto max-w-3xl px-5 text-center md:px-10">
          <h2 className="font-display text-3xl leading-tight md:text-5xl">
            Something like this, on your site?
          </h2>
          <Link
            to="/contact"
            className="eyebrow mt-10 inline-flex items-center gap-4 bg-primary px-9 py-4 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Start a conversation
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
