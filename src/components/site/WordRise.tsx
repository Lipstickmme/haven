import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * A heading whose words arrive in sequence once it scrolls into view.
 *
 * Words are wrapped individually rather than the whole line, so a long headline
 * still reads as one sentence settling rather than a list assembling. Spaces are
 * preserved between spans so text selection and copy still behave.
 */
export function WordRise({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  step = 55,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Milliseconds between consecutive words. */
  step?: number;
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
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as ElementType;
  const words = text.split(" ");

  return (
    <Component ref={ref as never} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span
            className={`word-rise ${shown ? "word-rise-in" : ""}`}
            style={{ transitionDelay: `${delay + i * step}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Component>
  );
}
