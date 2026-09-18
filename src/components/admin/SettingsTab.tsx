import { useEffect, useState, type FormEvent } from "react";

import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site";
import { supabase } from "@/lib/supabase";

import { PanelError } from "./primitives";

const FIELDS: { key: keyof SiteSettings; label: string; hint: string; type: string }[] = [
  {
    key: "email",
    label: "Email address",
    hint: "Shown in the footer, on the contact page and in the chat widget's fallback.",
    type: "email",
  },
  {
    key: "website",
    label: "Website",
    hint: "Displayed text only — not a link target.",
    type: "text",
  },
  {
    key: "hours",
    label: "Studio hours",
    hint: "Contact page only; the footer omits it.",
    type: "text",
  },
];

/**
 * The contact block, editable. Writes straight to `site_settings` under the
 * admin's own session — the table carries an admin-only update policy, same
 * shape as the status controls on the other tabs.
 */
export function SettingsTab({ enabled }: { enabled: boolean }) {
  const [values, setValues] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    void (async () => {
      const { data, error: loadError } = await supabase
        .from("site_settings")
        .select("email, website, address, hours")
        .eq("id", "default")
        .maybeSingle();

      if (cancelled) return;
      if (loadError) {
        setError(
          /site_settings/.test(loadError.message)
            ? "Contact settings are not set up on this project. Apply supabase/migrations/0003_site_settings.sql, then reload."
            : loadError.message,
        );
      } else if (data) {
        setValues({
          email: String(data["email"] ?? ""),
          website: String(data["website"] ?? ""),
          address: String(data["address"] ?? ""),
          hours: String(data["hours"] ?? ""),
        });
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaved(false);
    setError(null);

    void (async () => {
      const { error: saveError } = await supabase
        .from("site_settings")
        .update({
          email: values.email,
          website: values.website,
          address: values.address,
          hours: values.hours,
        })
        .eq("id", "default");

      if (saveError) setError(saveError.message);
      else setSaved(true);
      setSaving(false);
    })();
  }

  if (loading) return <p className="px-1 py-8 text-sm text-muted-foreground">Loading settings…</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <PanelError message={error} />

      <p className="text-sm leading-relaxed text-muted-foreground">
        These appear in the site footer and on the contact page. Changes go live on the next page
        load — there is nothing to redeploy.
      </p>

      <form onSubmit={onSubmit} className="space-y-8">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label htmlFor={`setting-${field.key}`} className="eyebrow text-muted-foreground">
              {field.label}
            </label>
            <input
              id={`setting-${field.key}`}
              type={field.type}
              required
              maxLength={300}
              value={values[field.key]}
              onChange={(event) => {
                const next = event.target.value;
                setValues((current) => ({ ...current, [field.key]: next }));
                setSaved(false);
              }}
              className="mt-3 w-full border-b border-border bg-transparent pb-3 text-lg outline-none transition-colors focus:border-accent"
            />
            <p className="mt-2 text-xs text-muted-foreground">{field.hint}</p>
          </div>
        ))}

        <div className="flex items-center gap-5">
          <button
            type="submit"
            disabled={saving}
            className="eyebrow bg-primary px-8 py-3.5 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved ? <span className="text-sm text-muted-foreground">Saved.</span> : null}
        </div>
      </form>
    </div>
  );
}
