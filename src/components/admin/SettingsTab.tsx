import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { DEFAULT_SITE_SETTINGS, parseOffices, type Office, type SiteSettings } from "@/lib/site";
import { supabase } from "@/lib/supabase";

import { PanelError } from "./primitives";

type TextKey = "email" | "website" | "hours";

const FIELDS: { key: TextKey; label: string; hint: string; type: string }[] = [
  {
    key: "email",
    label: "Email address",
    hint: "Shown in the footer, on the contact page and in the chat widget's fallback.",
    type: "email",
  },
  {
    key: "website",
    label: "Website",
    hint: "Displayed text only, not a link target.",
    type: "text",
  },
  {
    key: "hours",
    label: "Studio hours",
    hint: "Contact page only; the footer omits it.",
    type: "text",
  },
];

const OFFICE_FIELDS: { key: keyof Office; label: string; hint: string }[] = [
  { key: "label", label: "City", hint: "The short name the office goes by." },
  {
    key: "address",
    label: "Street address",
    hint: "One line, as you would write it on an envelope.",
  },
  { key: "phone", label: "Phone", hint: "Leave empty to print the address on its own." },
];

const EMPTY_OFFICE: Office = { label: "", address: "", phone: "" };

const MISSING_TABLE =
  "Contact settings are not set up on this project. Apply supabase/migrations/0003_site_settings.sql, then reload.";
const MISSING_OFFICES =
  "The offices column is not on this project yet. Apply supabase/migrations/0005_offices.sql, then reload. Until then the site prints the three built-in studio addresses.";

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
      // `*`, not a column list: a project that has not run 0005 yet still
      // returns its email, website and hours instead of failing outright.
      const { data, error: loadError } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();

      if (cancelled) return;
      if (loadError) {
        setError(/site_settings/.test(loadError.message) ? MISSING_TABLE : loadError.message);
      } else if (data) {
        setValues({
          email: String(data["email"] ?? ""),
          website: String(data["website"] ?? ""),
          hours: String(data["hours"] ?? ""),
          offices: parseOffices(data["offices"]),
        });
        if (!("offices" in data)) setError(MISSING_OFFICES);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  function setOffice(index: number, key: keyof Office, next: string) {
    setValues((current) => ({
      ...current,
      offices: current.offices.map((office, i) =>
        i === index ? { ...office, [key]: next } : office,
      ),
    }));
    setSaved(false);
  }

  function addOffice() {
    setValues((current) => ({ ...current, offices: [...current.offices, { ...EMPTY_OFFICE }] }));
    setSaved(false);
  }

  function removeOffice(index: number) {
    setValues((current) => ({
      ...current,
      offices: current.offices.filter((_, i) => i !== index),
    }));
    setSaved(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaved(false);
    setError(null);

    void (async () => {
      // Drop rows left blank rather than writing an office with no address.
      const offices = values.offices.filter((office) => office.address.trim() !== "");

      const { error: saveError } = await supabase
        .from("site_settings")
        .update({
          email: values.email,
          website: values.website,
          hours: values.hours,
          offices,
        })
        .eq("id", "default");

      if (saveError) {
        setError(/offices/.test(saveError.message) ? MISSING_OFFICES : saveError.message);
      } else {
        setValues((current) => ({ ...current, offices }));
        setSaved(true);
      }
      setSaving(false);
    })();
  }

  if (loading) return <p className="px-1 py-8 text-sm text-muted-foreground">Loading settings…</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <PanelError message={error} />

      <p className="text-sm leading-relaxed text-muted-foreground">
        These appear in the site footer and on the contact page. Changes go live on the next page
        load, there is nothing to redeploy.
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

        <div className="space-y-6 border-t border-border pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="eyebrow text-muted-foreground">Offices</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Every office listed here prints in the footer and on the contact page, in this
                order.
              </p>
            </div>
            <button
              type="button"
              onClick={addOffice}
              className="eyebrow inline-flex items-center gap-2 border border-border px-4 py-2 transition-colors hover:border-accent hover:text-accent"
            >
              <Plus size={14} strokeWidth={1.6} />
              Add office
            </button>
          </div>

          {values.offices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No offices listed. The site falls back to the three built-in studio addresses until
              you add one.
            </p>
          ) : null}

          {values.offices.map((office, index) => (
            <fieldset key={index} className="border border-border p-6">
              <legend className="eyebrow px-2 text-muted-foreground">Office {index + 1}</legend>
              <div className="space-y-6">
                {OFFICE_FIELDS.map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={`office-${index}-${field.key}`}
                      className="eyebrow text-muted-foreground"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`office-${index}-${field.key}`}
                      type={field.key === "phone" ? "tel" : "text"}
                      maxLength={300}
                      value={office[field.key]}
                      onChange={(event) => setOffice(index, field.key, event.target.value)}
                      className="mt-3 w-full border-b border-border bg-transparent pb-3 text-base outline-none transition-colors focus:border-accent"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">{field.hint}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => removeOffice(index)}
                className="eyebrow mt-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 size={14} strokeWidth={1.6} />
                Remove this office
              </button>
            </fieldset>
          ))}
        </div>

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
