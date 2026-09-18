import { createServerFn } from "@tanstack/react-start";

import { DEFAULT_SITE_SETTINGS, parseOffices, type SiteSettings } from "./site";

/**
 * Contact details for the footer and contact page, read server-side so the
 * first paint already has them.
 *
 * Degrades to the defaults in site.ts on any failure — an unapplied migration,
 * an unreachable database, a missing row. A studio's address block going blank
 * is a worse outcome than it being briefly stale. The select is `*` rather than
 * a column list for the same reason: a deployment running ahead of its
 * migrations still gets the columns that do exist.
 */
export const loadSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => {
    try {
      const shared = await import("./api/_shared.server");
      if (!shared.SUPABASE_URL || !shared.SERVICE_ROLE_KEY) return DEFAULT_SITE_SETTINGS;

      const { data, error } = await shared
        .adminClient()
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();

      if (error || !data) return DEFAULT_SITE_SETTINGS;

      return {
        email: String(data["email"] ?? "") || DEFAULT_SITE_SETTINGS.email,
        website: String(data["website"] ?? "") || DEFAULT_SITE_SETTINGS.website,
        hours: String(data["hours"] ?? "") || DEFAULT_SITE_SETTINGS.hours,
        offices: parseOffices(data["offices"]),
      };
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  },
);
