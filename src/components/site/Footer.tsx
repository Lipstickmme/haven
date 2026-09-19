import { Link } from "@tanstack/react-router";
import { contactDetails, SITE } from "@/lib/site";
import { useSiteSettings } from "./SiteSettingsContext";
import { Logo } from "./Logo";

/** `+1 929 647 6610` → `+19296476610`, which is what a dialler wants. */
function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function Footer() {
  const settings = useSiteSettings();
  const details = contactDetails(settings);

  return (
    <footer className="relative overflow-hidden bg-ink text-ink-foreground">
      <div className="pointer-events-none absolute inset-0 plan-grid-dark" />
      <div className="relative mx-auto max-w-[92rem] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr_1fr]">
          <h2 className="select-none font-display text-[22vw] leading-[0.8] text-ink-foreground/10 lg:text-[9rem] lg:[writing-mode:vertical-rl]">
            Contact
          </h2>

          <dl className="space-y-9">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-sm text-accent-ink">{d.label}</dt>
                <dd className="mt-2 text-lg text-ink-foreground/90">{d.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col justify-end gap-8">
            <div className="text-ink-foreground">
              <Logo tone="light" />
            </div>
            <div className="flex gap-6 eyebrow text-ink-foreground/60">
              <Link to="/contact" className="hover:text-accent-ink">
                Terms
              </Link>
              <Link to="/contact" className="hover:text-accent-ink">
                Condition
              </Link>
              <Link to="/contact" className="hover:text-accent-ink">
                Policy
              </Link>
            </div>
            <p className="max-w-xs text-sm text-ink-foreground/50">
              {SITE.name} 2026. All rights reserved.
            </p>
          </div>
        </div>

        {/* Offices. Each one prints its own phone, so nobody has to guess which
            studio a single switchboard number belongs to. */}
        <div className="mt-20 border-t border-ink-foreground/15 pt-12">
          <p className="eyebrow text-accent-ink">Offices</p>
          <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {settings.offices.map((office) => (
              <li key={`${office.label}-${office.address}`}>
                <p className="font-display text-2xl text-ink-foreground">{office.label}</p>
                <address className="mt-3 max-w-xs text-sm leading-relaxed text-ink-foreground/70 not-italic">
                  {office.address}
                </address>
                {office.phone ? (
                  <a
                    href={telHref(office.phone)}
                    className="-mx-1 mt-2 inline-block px-1 py-1.5 text-sm text-ink-foreground/90 transition-colors hover:text-accent-ink"
                  >
                    {office.phone}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
