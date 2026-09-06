import { useState } from "react";

import { useRealtimeRows } from "@/hooks/useRealtimeRows";
import { ITEM_STATUSES, type Enquiry } from "@/lib/database.types";

import {
  EmptyState,
  Field,
  ListDetail,
  ListRow,
  PanelError,
  StatusSelect,
  formatWhen,
} from "./primitives";

export function EnquiriesTab({ enabled }: { enabled: boolean }) {
  const { rows, loading, error } = useRealtimeRows<Enquiry>("enquiries", {
    orderBy: "created_at",
    enabled,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = rows.find((row) => row.id === selectedId) ?? rows[0] ?? null;

  return (
    <div className="space-y-4">
      <PanelError message={error} />
      <ListDetail
        list={
          loading ? (
            <EmptyState>Loading enquiries…</EmptyState>
          ) : rows.length === 0 ? (
            <EmptyState>No enquiries yet.</EmptyState>
          ) : (
            rows.map((row) => (
              <ListRow
                key={row.id}
                active={selected?.id === row.id}
                onSelect={() => setSelectedId(row.id)}
                title={row.name}
                subtitle={row.subject || row.scope || ""}
                meta={formatWhen(row.created_at)}
                status={row.status}
              />
            ))
          )
        }
        detail={
          selected ? (
            <div className="space-y-6 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-display text-2xl">{selected.name}</h3>
                <StatusSelect
                  table="enquiries"
                  id={selected.id}
                  value={selected.status}
                  options={ITEM_STATUSES}
                />
              </div>
              <dl>
                <Field
                  label="Email"
                  value={<a href={`mailto:${selected.email}`}>{selected.email}</a>}
                />
                <Field label="Company" value={selected.company} />
                <Field label="Phone" value={selected.phone} />
                <Field label="Subject" value={selected.subject} />
                <Field label="Brief" value={selected.scope} />
                <Field label="Notes" value={selected.notes} />
                <Field label="Received" value={formatWhen(selected.created_at)} />
              </dl>
            </div>
          ) : (
            <EmptyState>Select an enquiry to read it.</EmptyState>
          )
        }
      />
    </div>
  );
}
