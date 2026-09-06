import { useState, type ReactNode } from "react";

import { supabase } from "@/lib/supabase";

export function formatWhen(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ListDetail({ list, detail }: { list: ReactNode; detail: ReactNode }) {
  return (
    <div className="grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-[22rem_1fr]">
      <div className="max-h-[34rem] overflow-y-auto bg-background">{list}</div>
      <div className="max-h-[34rem] overflow-y-auto bg-background">{detail}</div>
    </div>
  );
}

export function ListRow({
  active,
  onSelect,
  title,
  subtitle,
  meta,
  status,
}: {
  active: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
  meta: string;
  status: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full border-b border-border px-5 py-4 text-left transition-colors last:border-b-0 ${
        active ? "bg-secondary" : "hover:bg-secondary/60"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium text-foreground">{title || "—"}</span>
        <StatusDot status={status} />
      </div>
      <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>
      <p className="mt-1 text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
        {meta}
      </p>
    </button>
  );
}

export function StatusDot({ status }: { status: string }) {
  const tone =
    status === "new"
      ? "bg-accent"
      : status === "closed" || status === "cancelled" || status === "completed"
        ? "bg-muted-foreground"
        : "bg-foreground";
  return (
    <span className="flex shrink-0 items-center gap-1.5 text-[0.625rem] uppercase tracking-widest text-muted-foreground">
      <span className={`h-1.5 w-1.5 rounded-full ${tone}`} />
      {status.replace("_", " ")}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="px-5 py-10 text-sm text-muted-foreground">{children}</p>;
}

export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-b border-border py-3 last:border-b-0">
      <dt className="eyebrow text-muted-foreground">{label}</dt>
      <dd className="mt-1.5 whitespace-pre-wrap break-words text-sm text-foreground">
        {value || "—"}
      </dd>
    </div>
  );
}

/** Writes straight to the table — admins hold an update policy on each one. */
export function StatusSelect({
  table,
  id,
  value,
  options,
}: {
  table: string;
  id: string;
  value: string;
  options: readonly string[];
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={`status-${id}`} className="eyebrow text-muted-foreground">
        Status
      </label>
      <select
        id={`status-${id}`}
        value={value}
        disabled={saving}
        onChange={(event) => {
          const next = event.target.value;
          setSaving(true);
          setError(null);
          void (async () => {
            const { error: updateError } = await supabase
              .from(table)
              .update({ status: next })
              .eq("id", id);
            if (updateError) setError(updateError.message);
            setSaving(false);
          })();
        }}
        className="border border-border bg-background px-3 py-1.5 text-sm outline-none transition-colors focus:border-accent disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replace("_", " ")}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
}

export function PanelError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="border border-border bg-secondary px-4 py-3 text-sm text-muted-foreground">
      {message}
    </p>
  );
}
