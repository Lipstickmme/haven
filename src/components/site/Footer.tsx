import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const DETAILS = [
  { label: "Website", value: "www.blueprinthaven.com" },
  { label: "Email Address", value: "info@blueprinthaven.com" },
  { label: "Phone No", value: "+1-929-647-6610" },
  { label: "Office Address", value: "54-A Sager Dr, Rochester, NY 14607, United States" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-ink-foreground">
      <div className="pointer-events-none absolute inset-0 plan-grid-dark" />
      <div className="relative mx-auto max-w-[92rem] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr_1fr]">
          <h2 className="select-none font-display text-[22vw] leading-[0.8] text-ink-foreground/10 lg:text-[9rem] lg:[writing-mode:vertical-rl]">
            Contact
          </h2>

          <dl className="space-y-9">
            {DETAILS.map((d) => (
              <div key={d.label}>
                <dt className="text-sm text-accent">{d.label}</dt>
                <dd className="mt-2 text-lg text-ink-foreground/90">{d.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col justify-end gap-8">
            <div className="text-ink-foreground">
              <Logo />
            </div>
            <div className="flex gap-6 eyebrow text-ink-foreground/60">
              <Link to="/contact" className="hover:text-accent">
                Terms
              </Link>
              <Link to="/contact" className="hover:text-accent">
                Condition
              </Link>
              <Link to="/contact" className="hover:text-accent">
                Policy
              </Link>
            </div>
            <p className="max-w-xs text-sm text-ink-foreground/50">
              Blueprint Haven Architects 2026. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
