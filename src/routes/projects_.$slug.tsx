import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { BeforeAfter } from "@/components/site/BeforeAfter";
import { ProjectImage } from "@/components/site/ProjectImage";
import { Reveal } from "@/components/site/Reveal";
import { PROJECTS, coverFor, projectBySlug, projectImage, type ImageRole } from "@/lib/projects";

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
        { title: `${project.title} — Meastro Architecture` },
        { name: "description", content: project.summary },
        { property: "og:title", content: `${project.title} — Meastro Architecture` },
        { property: "og:description", content: project.summary },
      ],
    };
  },
  component: ProjectProfile,
});

const PART_ROLES: ImageRole[] = ["part-1", "part-2", "part-3", "part-4"];

function ProjectProfile() {
  const { slug } = Route.useLoaderData();
  const project = projectBySlug(slug)!;

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]!;
  const next = PROJECTS[(index + 1) % PROJECTS.length]!;

  const facts = [
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
          <p className="eyebrow text-accent-ink">
            {project.category} · {project.place}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
            {project.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-foreground/75">
            {project.summary}
          </p>
          <p className="mt-8 flex items-center gap-3 eyebrow text-ink-foreground/50">
            <Link to="/projects" className="hover:text-accent-ink">
              Projects
            </Link>
            <span className="h-px w-8 bg-ink-foreground/30" />
            {project.title}
          </p>
        </div>
      </section>

      {/* Facts ----------------------------------------------------------- */}
      <section className="border-b border-border bg-background">
        <dl className="mx-auto grid max-w-[92rem] grid-cols-2 gap-px bg-border px-5 md:grid-cols-6 md:px-10">
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
            <p className="eyebrow text-accent">The project</p>
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
      <section className="border-t border-border bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-[92rem] px-5 md:px-10">
          <Reveal>
            <p className="eyebrow text-accent">Before and after</p>
            <h2 className="mt-5 max-w-2xl font-display text-3xl leading-tight md:text-4xl">
              What was here, and what is here now.
            </h2>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <BeforeAfter
              title={project.title}
              before={projectImage(project.slug, "before")}
              after={projectImage(project.slug, "after") ?? coverFor(project)}
              beforeCaption={project.beforeCaption}
              afterCaption={project.afterCaption}
            />
          </Reveal>
        </div>
      </section>

      {/* Parts of the building ------------------------------------------- */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[92rem] px-5 md:px-10">
          <Reveal>
            <p className="eyebrow text-accent">Parts of the building</p>
          </Reveal>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {project.parts.map((part, i) => (
              <Reveal key={part.title} delay={i * 90}>
                <figure className="card-lift card-rule group m-0 pb-5">
                  <div className="overflow-hidden">
                    <ProjectImage
                      src={projectImage(project.slug, PART_ROLES[i] ?? "part-1")}
                      alt={`${project.title} — ${part.title}`}
                      label={part.title}
                      className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
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
