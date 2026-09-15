/**
 * A project photograph, or an honest placeholder when it has not been shot yet.
 *
 * Twenty projects need roughly six images each; the set arrives in batches, so
 * a missing file has to look deliberate rather than broken.
 */
export function ProjectImage({
  src,
  alt,
  label,
  className = "",
  ratio = "aspect-4/3",
  eager = false,
}: {
  src: string | null;
  alt: string;
  /** Shown on the placeholder so it is obvious which frame is outstanding. */
  label: string;
  className?: string;
  ratio?: string;
  eager?: boolean;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`${ratio} w-full object-cover ${className}`}
      />
    );
  }

  // A hatched panel rather than a blank one: inside the before/after slider the
  // frame is revealed a slice at a time, and a centred label alone disappears.
  return (
    <div
      role="img"
      aria-label={`${label} — photography in production`}
      className={`${ratio} placeholder-hatch flex w-full flex-col items-center justify-center gap-3 border border-border px-6 text-center ${className}`}
    >
      <span className="h-px w-10 bg-accent" />
      <span className="eyebrow text-muted-foreground">{label}</span>
      <span className="text-xs text-muted-foreground/70">Photography in production</span>
    </div>
  );
}
