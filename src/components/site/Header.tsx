import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Every public page opens on a dark hero band, so the header can float
  // transparently over it. The staff surfaces open on white, where a
  // transparent header renders near-white text on white — so pin it solid.
  const onPaleSurface = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  const solid = scrolled || open || onPaleSurface;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-border bg-background/90 text-foreground backdrop-blur-xl"
          : "bg-transparent text-ink-foreground"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[92rem] items-center justify-between px-5 md:px-10">
        <Link to="/" className="text-current" onClick={() => setOpen(false)}>
          <Logo tone={solid ? "dark" : "light"} variant="mark" />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="eyebrow text-current/70 transition-colors hover:text-accent link-underline"
              activeProps={{ className: "eyebrow text-accent link-underline" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center text-current/70 transition-colors hover:text-accent md:flex"
          >
            <Search size={17} strokeWidth={1.4} />
          </button>
          <span className="hidden h-5 w-px bg-current/25 md:block" />
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center text-current transition-colors hover:text-accent"
          >
            {open ? <X size={20} strokeWidth={1.4} /> : <Menu size={20} strokeWidth={1.4} />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-border bg-background transition-[max-height,opacity] duration-500 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-[92rem] flex-col px-5 py-4 md:px-10">
          {NAV.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${i * 40}ms` }}
              className="border-b border-border/60 py-4 font-display text-2xl text-foreground transition-colors last:border-0 hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
