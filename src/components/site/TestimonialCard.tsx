import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { TESTIMONIALS, initialsFor, portraitFor } from "@/lib/testimonials";

const ROTATE_MS = 22000;
const FADE_MS = 800;

/**
 * A floating client quote in the top left.
 *
 * It waits until the hero has scrolled past before appearing. The card has no
 * background of its own, as asked, and a transparent card can only stay legible
 * if it sits on a predictable ground: below the hero every page is the pale
 * one, so the type reads without a panel behind it.
 */
export function TestimonialCard() {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(() => {
      if (reduced) {
        setIndex((value) => (value + 1) % TESTIMONIALS.length);
        return;
      }
      // Fade out, swap, fade back in, so quotes cross rather than jump.
      setVisible(false);
      window.setTimeout(() => {
        setIndex((value) => (value + 1) % TESTIMONIALS.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [dismissed]);

  if (dismissed) return null;

  const item = TESTIMONIALS[index]!;
  const portrait = portraitFor(item.id);

  return (
    <aside
      aria-label="What our clients say"
      className={`group pointer-events-none fixed top-28 left-5 z-40 hidden w-[27rem] transition-all duration-700 md:left-8 lg:block ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
      }`}
    >
      {/* Not a solid card: a soft blur and the faintest wash, which is the
          least it takes to stay readable where the quote lands over a
          photograph. Fully transparent was illegible over the project imagery. */}
      <div
        className={`pointer-events-auto relative flex flex-col gap-4 rounded-sm bg-background/60 p-6 backdrop-blur-md transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="eyebrow text-accent">Testimonials</p>
          <span className="flex gap-1.5" aria-hidden="true">
            {TESTIMONIALS.map((entry, i) => (
              <span
                key={entry.id}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === index ? "w-4 bg-accent" : "w-1 bg-foreground/20"
                }`}
              />
            ))}
          </span>
        </div>

        <div className="flex gap-5">
          {portrait ? (
            <img
              src={portrait}
              alt=""
              className="h-20 w-20 shrink-0 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <span
              aria-hidden="true"
              className="eyebrow flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent"
            >
              {initialsFor(item.name)}
            </span>
          )}

          <figure className="m-0 min-w-0">
            <blockquote className="text-[1.05rem] leading-relaxed text-foreground/90">
              {item.quote}
            </blockquote>
            <figcaption className="mt-3 text-[0.8rem] text-muted-foreground">
              <span className="text-foreground">{item.name}</span>
              <span className="mx-1.5 opacity-40">/</span>
              {item.role}
            </figcaption>
          </figure>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Hide client quotes"
          className="absolute top-3 right-3 h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
