import { useId, useState } from "react";

/**
 * Before/after comparison.
 *
 * The handle is a real range input stretched over the frame — dragging it feels
 * native, and it comes with keyboard and touch support rather than needing them
 * bolted on afterwards.
 */
export function BeforeAfter({
  before,
  after,
  beforeCaption,
  afterCaption,
  title,
}: {
  before: string;
  after: string;
  beforeCaption: string;
  afterCaption: string;
  title: string;
}) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <figure className="m-0">
      <div className="group relative overflow-hidden select-none">
        <img
          src={after}
          alt={`${title} after completion`}
          loading="lazy"
          decoding="async"
          className="aspect-16/9 w-full object-cover"
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={before}
            alt={`${title} before works`}
            loading="lazy"
            decoding="async"
            className="aspect-16/9 w-full object-cover"
          />
        </div>

        {/* Divider */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-ink-foreground/80"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink-foreground/70 bg-ink/60 text-ink-foreground backdrop-blur-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
              <path d="M6 3 2 8l4 5M10 3l4 5-4 5" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </span>
        </div>

        <span className="eyebrow pointer-events-none absolute top-4 left-4 bg-ink/70 px-2.5 py-1 text-ink-foreground">
          Before
        </span>
        <span className="eyebrow pointer-events-none absolute top-4 right-4 bg-ink/70 px-2.5 py-1 text-ink-foreground">
          After
        </span>

        <label htmlFor={id} className="sr-only">
          Reveal the before and after photographs of {title}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(event) => setPos(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>

      <figcaption className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
        <span>
          <span className="eyebrow mr-2 text-accent">Before</span>
          {beforeCaption}
        </span>
        <span>
          <span className="eyebrow mr-2 text-accent">After</span>
          {afterCaption}
        </span>
      </figcaption>
    </figure>
  );
}
