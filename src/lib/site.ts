/**
 * Defaults for the studio's identity and contact details.
 *
 * Contact rows are editable from the dashboard (Settings tab) and stored in
 * `site_settings`; these values are the fallback used when that row is absent
 * or the database is unreachable, so the footer never renders blank.
 */
export const SITE = {
  name: "Meastro Architecture",
  shortName: "Meastro",
  domain: "meastroarchitecture.com",
  website: "www.meastroarchitecture.com",
  email: "frontdesk@meastroarchitecture.com",
  hours: "Monday – Friday, 09:00 – 18:00",
} as const;

/** The editable subset. Keys match the columns of `site_settings`. */
export type SiteSettings = {
  email: string;
  website: string;
  hours: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  email: SITE.email,
  website: SITE.website,
  hours: SITE.hours,
};

/** Footer rows — website and email only, it already runs long. */
export function contactDetails(settings: SiteSettings) {
  return [
    { label: "Website", value: settings.website },
    { label: "Email Address", value: settings.email },
  ];
}

/** Contact page rows, which have room for opening hours too. */
export function contactDetailsFull(settings: SiteSettings) {
  return [...contactDetails(settings), { label: "Studio Hours", value: settings.hours }];
}
