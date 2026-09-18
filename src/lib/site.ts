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
  hours: "Monday to Friday, 09:00 to 18:00",
} as const;

/** One studio location. `label` is the city, which is how people refer to them. */
export type Office = {
  label: string;
  address: string;
  phone: string;
};

export const DEFAULT_OFFICES: Office[] = [
  {
    label: "Rochester",
    address: "54-A Sager Dr, Rochester, NY 14607, United States",
    phone: "+1 929 647 6610",
  },
  {
    label: "Jacksonville",
    address: "5646 St Augustine Rd, Jacksonville, FL 32206, United States",
    phone: "+1 945 216 0576",
  },
  {
    label: "Richmond",
    address: "13353 Commerce Parkway, Richmond, BC V6V 3A1, Canada",
    phone: "+1 604 243 2243",
  },
];

/** The editable subset. Keys match the columns of `site_settings`. */
export type SiteSettings = {
  email: string;
  website: string;
  hours: string;
  offices: Office[];
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  email: SITE.email,
  website: SITE.website,
  hours: SITE.hours,
  offices: DEFAULT_OFFICES,
};

/**
 * Coerce whatever came back from the `offices` jsonb column into a list we can
 * render. Anything malformed, or a column that predates the migration, falls
 * back to the three studios above rather than leaving the footer without a
 * single address on it.
 */
export function parseOffices(value: unknown): Office[] {
  if (!Array.isArray(value)) return DEFAULT_OFFICES;

  const offices = value
    .map((entry): Office | null => {
      if (!entry || typeof entry !== "object") return null;
      const row = entry as Record<string, unknown>;
      const address = String(row["address"] ?? "").trim();
      if (!address) return null;
      return {
        label: String(row["label"] ?? "").trim() || "Studio",
        address,
        phone: String(row["phone"] ?? "").trim(),
      };
    })
    .filter((office): office is Office => office !== null);

  return offices.length > 0 ? offices : DEFAULT_OFFICES;
}

/** The studio's first listed address, where one line is all there is room for. */
export function primaryOffice(settings: SiteSettings): Office {
  return settings.offices[0] ?? DEFAULT_OFFICES[0]!;
}

/**
 * The rows that are the same wherever you are. The offices print separately,
 * one block each, because each has its own phone number.
 */
export function contactDetails(settings: SiteSettings) {
  return [
    { label: "Website", value: settings.website },
    { label: "Email Address", value: settings.email },
    { label: "Studio Hours", value: settings.hours },
  ];
}
