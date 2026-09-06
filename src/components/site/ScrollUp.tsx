import { useEffect, useState } from "react";

export function ScrollUp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      aria-label="Scroll back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-10 right-6 z-40 flex flex-col items-center transition-all duration-500 md:right-10 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="h-8 w-px bg-foreground/40" />
      <span className="group flex h-12 w-12 items-center justify-center border border-foreground/40 eyebrow text-foreground transition-colors hover:border-accent hover:text-accent">
        Up
      </span>
    </button>
  );
}
