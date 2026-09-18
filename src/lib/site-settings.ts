import { createServerFn } from "@tanstack/react-start";

import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "./site";

/**
 * Contact details for the footer and contact page, read server-side so the
 * first paint already has them.
 *
 * Degrades to the defaults in site.ts on any failure — an unapplied migration,
 * an unreachable database, a missing row. A studio's address block going blank
 * is a worse outcome than it being briefly stale.
 */
export const loadSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => {
    try {
      const shared = await import("./api/_shared.server");
      if (!shared.SUPABASE_URL || !shared.SERVICE_ROLE_KEY) return DEFAULT_SITE_SETTINGS;

      const { data, error } = await shared
        .adminClient()
        .from("site_settings")
        .select("email, website, address, hours")
        .eq("id", "default")
        .maybeSingle();

      if (error || !data) return DEFAULT_SITE_SETTINGS;

      return {
        email: String(data["email"] ?? "") || DEFAULT_SITE_SETTINGS.email,
        website: String(data["website"] ?? "") || DEFAULT_SITE_SETTINGS.website,
        address: String(data["address"] ?? "") || DEFAULT_SITE_SETTINGS.address,
        hours: String(data["hours"] ?? "") || DEFAULT_SITE_SETTINGS.hours,
      };
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  },
);
