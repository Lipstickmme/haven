import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import arc6 from "@/assets/arc6.webp";
import { Reveal } from "@/components/site/Reveal";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { CONTACT_DETAILS_FULL } from "@/lib/site";
import type { SubmitFormInput } from "@/lib/api/forms";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Blueprint Haven Architects" },
      {
        name: "description",
        content:
          "Talk to Blueprint Haven Architects in Rochester, NY about your site, brief or feasibility study.",
      },
      { property: "og:title", content: "Contact Blueprint Haven Architects" },
      {
        property: "og:description",
        content: "Rochester, NY studio — tell us about your site and brief.",
      },
    ],
  }),
  component: Contact,
});

const CONSULTATIONS = ["Initial consultation", "Site visit", "Feasibility study", "Design review"];

const fieldClass =
  "mt-3 w-full border-b border-border bg-transparent pb-3 text-lg outline-none transition-colors focus:border-accent";

/** Off-screen, unlabelled for people, irresistible to bots. Both forms on this
 *  page carry one, so the id has to be per-form or the document has duplicates. */
function Honeypot({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor={id}>Leave this field empty</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Tell us about the site"
        crumb="Contact"
        image={arc6}
        lead="Send the brief, the address, or just the question you cannot answer yet. We read everything ourselves."
      />

      <section className="relative bg-background py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 plan-grid opacity-60" />
        <div className="relative mx-auto grid max-w-[92rem] gap-16 px-5 md:px-10 lg:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <p className="eyebrow text-accent">Studio details</p>
            <dl className="mt-10 space-y-9">
              {CONTACT_DETAILS_FULL.map((detail) => (
                <div key={detail.label} className="border-b border-border pb-6">
                  <dt className="eyebrow text-muted-foreground">{detail.label}</dt>
                  <dd className="mt-3 text-lg">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={120}>
            <EnquiryForm />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-secondary py-24 md:py-32">
        <div className="mx-auto grid max-w-[92rem] gap-16 px-5 md:px-10 lg:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <p className="eyebrow text-accent">Book a consultation</p>
            <h2 className="mt-6 font-display text-4xl leading-tight md:text-5xl">
              An hour with the studio, at a time that suits you.
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Pick a slot and we will confirm by email. Consultations run from the Rochester studio
              or on site, whichever is more useful at this stage.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <BookingForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

const ENQUIRY_INITIAL = {
  name: "",
  company: "",
  email: "",
  phone: "",
  subject: "",
  scope: "",
  website: "",
};

function EnquiryForm() {
  const build = useCallback(
    (values: typeof ENQUIRY_INITIAL): SubmitFormInput => ({
      kind: "enquiry",
      name: values.name,
      company: values.company || undefined,
      email: values.email,
      phone: values.phone || undefined,
      subject: values.subject || undefined,
      scope: values.scope,
      website: values.website,
    }),
    [],
  );

  const form = useFormSubmit(ENQUIRY_INITIAL, build);

  if (form.success) {
    return (
      <div>
        <p className="eyebrow text-accent">Project enquiry</p>
        <p className="mt-10 font-display text-3xl leading-snug">
          Thank you — we have it. Someone from the studio will reply within a working day.
        </p>
        <button
          type="button"
          onClick={form.reset}
          className="eyebrow mt-8 border border-border px-6 py-3 transition-colors hover:border-accent hover:text-accent"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="eyebrow text-accent">Project enquiry</p>
      <form onSubmit={form.onSubmit} className="relative mt-10 space-y-8">
        <Honeypot
          id="enquiry-website"
          value={form.values.website}
          onChange={(next) => form.setField("website", next)}
        />

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="eyebrow text-muted-foreground">
              Your name
            </label>
            <input
              id="name"
              required
              maxLength={200}
              value={form.values.name}
              onChange={(event) => form.setField("name", event.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="company" className="eyebrow text-muted-foreground">
              Company (optional)
            </label>
            <input
              id="company"
              maxLength={200}
              value={form.values.company}
              onChange={(event) => form.setField("company", event.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="email" className="eyebrow text-muted-foreground">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              maxLength={320}
              value={form.values.email}
              onChange={(event) => form.setField("email", event.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className="eyebrow text-muted-foreground">
              Phone (optional)
            </label>
            <input
              id="phone"
              type="tel"
              maxLength={60}
              value={form.values.phone}
              onChange={(event) => form.setField("phone", event.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="eyebrow text-muted-foreground">
            Project or location
          </label>
          <input
            id="subject"
            maxLength={300}
            value={form.values.subject}
            onChange={(event) => form.setField("subject", event.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="scope" className="eyebrow text-muted-foreground">
            Brief
          </label>
          <textarea
            id="scope"
            rows={4}
            required
            maxLength={4000}
            value={form.values.scope}
            onChange={(event) => form.setField("scope", event.target.value)}
            className={`${fieldClass} resize-none`}
          />
        </div>

        {form.error ? <p className="text-sm text-destructive">{form.error}</p> : null}

        <button
          type="submit"
          disabled={form.submitting}
          className="eyebrow inline-flex items-center gap-4 bg-primary px-9 py-4 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
        >
          {form.submitting ? "Sending…" : "Send enquiry"}
          <ArrowUpRight size={16} strokeWidth={1.5} />
        </button>
      </form>
    </>
  );
}

const BOOKING_INITIAL = {
  name: "",
  email: "",
  phone: "",
  service: CONSULTATIONS[0] ?? "Initial consultation",
  preferredDate: "",
  preferredTime: "",
  notes: "",
  website: "",
};

function BookingForm() {
  const build = useCallback(
    (values: typeof BOOKING_INITIAL): SubmitFormInput => ({
      kind: "booking",
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      service: values.service,
      preferredDate: values.preferredDate,
      preferredTime: values.preferredTime,
      notes: values.notes || undefined,
      website: values.website,
    }),
    [],
  );

  const form = useFormSubmit(BOOKING_INITIAL, build);

  if (form.success) {
    return (
      <div>
        <p className="font-display text-3xl leading-snug">
          Booked in. We will email you to confirm the slot.
        </p>
        <button
          type="button"
          onClick={form.reset}
          className="eyebrow mt-8 border border-border px-6 py-3 transition-colors hover:border-accent hover:text-accent"
        >
          Book another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={form.onSubmit} className="relative space-y-8">
      <Honeypot
        id="booking-website"
        value={form.values.website}
        onChange={(next) => form.setField("website", next)}
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-name" className="eyebrow text-muted-foreground">
            Your name
          </label>
          <input
            id="booking-name"
            required
            maxLength={200}
            value={form.values.name}
            onChange={(event) => form.setField("name", event.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="booking-email" className="eyebrow text-muted-foreground">
            Email address
          </label>
          <input
            id="booking-email"
            type="email"
            required
            maxLength={320}
            value={form.values.email}
            onChange={(event) => form.setField("email", event.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="booking-phone" className="eyebrow text-muted-foreground">
            Phone (optional)
          </label>
          <input
            id="booking-phone"
            type="tel"
            maxLength={60}
            value={form.values.phone}
            onChange={(event) => form.setField("phone", event.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="booking-service" className="eyebrow text-muted-foreground">
            Consultation type
          </label>
          <select
            id="booking-service"
            required
            value={form.values.service}
            onChange={(event) => form.setField("service", event.target.value)}
            className={fieldClass}
          >
            {CONSULTATIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="booking-date" className="eyebrow text-muted-foreground">
            Preferred date
          </label>
          <input
            id="booking-date"
            type="date"
            required
            value={form.values.preferredDate}
            onChange={(event) => form.setField("preferredDate", event.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="booking-time" className="eyebrow text-muted-foreground">
            Preferred time
          </label>
          <input
            id="booking-time"
            type="time"
            required
            value={form.values.preferredTime}
            onChange={(event) => form.setField("preferredTime", event.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="booking-notes" className="eyebrow text-muted-foreground">
          Anything we should read first (optional)
        </label>
        <textarea
          id="booking-notes"
          rows={3}
          maxLength={4000}
          value={form.values.notes}
          onChange={(event) => form.setField("notes", event.target.value)}
          className={`${fieldClass} resize-none`}
        />
      </div>

      {form.error ? <p className="text-sm text-destructive">{form.error}</p> : null}

      <button
        type="submit"
        disabled={form.submitting}
        className="eyebrow inline-flex items-center gap-4 bg-primary px-9 py-4 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
      >
        {form.submitting ? "Booking…" : "Request booking"}
        <ArrowUpRight size={16} strokeWidth={1.5} />
      </button>
    </form>
  );
}
