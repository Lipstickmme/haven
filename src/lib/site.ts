/**
 * One source of truth for the studio's contact details. The footer and the
 * contact page both render these; keeping two copies is how they drift.
 */
export const SITE = {
  name: "Blueprint Haven Architects",
  shortName: "Blueprint Haven",
  domain: "blueprinthavenltd.com",
  website: "www.blueprinthavenltd.com",
  email: "info@blueprinthavenltd.com",
  phone: "+1-929-647-6610",
  address: "54-A Sager Dr, Rochester, NY 14607, United States",
  hours: "Monday – Friday, 09:00 – 18:00 EST",
} as const;

/** Rows for the footer — no studio hours, it already runs long. */
export const CONTACT_DETAILS = [
  { label: "Website", value: SITE.website },
  { label: "Email Address", value: SITE.email },
  { label: "Phone No", value: SITE.phone },
  { label: "Office Address", value: SITE.address },
] as const;

/** Rows for the contact page, which has room for opening hours too. */
export const CONTACT_DETAILS_FULL = [
  ...CONTACT_DETAILS,
  { label: "Studio Hours", value: SITE.hours },
] as const;
