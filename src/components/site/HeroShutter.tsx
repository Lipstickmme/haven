import { useEffect, useRef, useState } from "react";

/** Matches the seven columns of the `plan-grid-dark` overlay. */
const SLATS = 7;
const STAGGER_MS = 80;
/** Long enough for the last slat (6 × 80ms) plus its 900ms travel. */
const WIPE_MS = SLATS * STAGGER_MS + 1000;

export type Slide = { src: string; title: string };

/**
 * Slide transition as a shutter: the image is cut into the same seven columns
 * the drafting grid already draws, and each one wipes down in turn over the
 * outgoing photograph.
 *
 * The first slide renders fully open so server-rendered HTML — and anyone
 * without JavaScript — sees a complete image rather than an empty band.
 */
export function HeroShutter({ slides, index }: { slides: Slide[]; index: number }) {
  const [open, setOpen] = useState(true);
  const [beneath, setBeneath] = useState(index);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    // Close, then re-open on the next frame so the browser has two distinct
    // states to interpolate between.
    setOpen(false);
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setOpen(true));
    });
    const done = setTimeout(() => setBeneath(index), WIPE_MS);

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      clearTimeout(done);
    };
  }, [index]);

  return (
    <div className="absolute inset-0">
      {slides.map((slide, idx) => {
        const active = idx === index;
        const outgoing = idx === beneath && beneath !== index;
        if (!active && !outgoing) return null;

        return (
          <div key={slide.title} className="absolute inset-0" style={{ zIndex: active ? 2 : 1 }}>
            {Array.from({ length: SLATS }, (_, slat) => (
              <div
                key={slat}
                className={
                  active
                    ? `shutter-slat shutter-seam absolute inset-y-0 overflow-hidden ${open ? "shutter-slat-open" : ""}`
                    : "shutter-slat-open absolute inset-y-0 overflow-hidden"
                }
                style={{
                  left: `${(slat * 100) / SLATS}%`,
                  width: `${100 / SLATS}%`,
                  transitionDelay: active ? `${slat * STAGGER_MS}ms` : "0ms",
                }}
              >
                {/* The slat is a window onto a full-width image: widen the
                    image by the slat count and shift it back into place. */}
                <img
                  src={slide.src}
                  alt={active ? slide.title : ""}
                  aria-hidden={!active}
                  className={`absolute inset-y-0 h-full max-w-none object-cover ${active ? "kenburns" : ""}`}
                  style={{ width: `${SLATS * 100}%`, left: `-${slat * 100}%` }}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
