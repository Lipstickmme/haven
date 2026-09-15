import { createContext, useContext, type ReactNode } from "react";

import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site";

const Ctx = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

/** Request-scoped, not module scope: SSR shares module state between requests. */
export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettings;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSiteSettings(): SiteSettings {
  return useContext(Ctx);
}
