import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Reveals its children once they scroll into view, then stops observing.
 *
 * `stagger` splits the children across successive delays, so a heading and its
 * paragraph arrive a beat apart instead of together.
 */
export function Rise({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  rule = false,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  /** Draw the short accent rule beneath, for section labels. */
  rule?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as ElementType;
  return (
    <Component
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms` }}
      className={`rise ${shown ? "rise-in" : ""} ${rule ? `draw-rule ${shown ? "draw-rule-in" : ""}` : ""} ${className}`}
    >
      {children}
    </Component>
  );
}
