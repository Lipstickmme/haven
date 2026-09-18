import type { Project } from "@/lib/projects";
import { coverFor } from "@/lib/projects";

/**
 * A project's index photograph, or an honest stand-in when it has not been
 * shot yet.
 *
 * A project record can land before its photography does. Rendering an `img`
 * with a null source gives a broken frame, and dropping the project from the
 * index hides a page that exists, so the gap is drawn instead: the same
 * proportion, the same rule, and a line saying what is missing.
 */
export function ProjectCover({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const src = coverFor(project);

  if (src) {
    return (
      <img
        src={src}
        alt={project.title}
        loading="lazy"
        decoding="async"
        className={`aspect-4/3 w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${project.title}, photography in progress`}
      className={`relative flex aspect-4/3 w-full items-center justify-center border border-border bg-secondary ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 plan-grid opacity-70" />
      <div className="relative px-8 text-center">
        <p className="font-display text-2xl leading-tight text-foreground/70">{project.title}</p>
        <p className="eyebrow mt-4 text-muted-foreground">Photography in progress</p>
      </div>
    </div>
  );
}
