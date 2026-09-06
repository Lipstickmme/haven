import { useState } from "react";

import { useRealtimeRows } from "@/hooks/useRealtimeRows";
import { BOOKING_STATUSES, type Booking } from "@/lib/database.types";

import {
  EmptyState,
  Field,
  ListDetail,
  ListRow,
  PanelError,
  StatusSelect,
  formatWhen,
} from "./primitives";

export function BookingsTab({ enabled }: { enabled: boolean }) {
  const { rows, loading, error } = useRealtimeRows<Booking>("bookings", {
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
            <EmptyState>Loading bookings…</EmptyState>
          ) : rows.length === 0 ? (
            <EmptyState>No bookings yet.</EmptyState>
          ) : (
            rows.map((row) => (
              <ListRow
                key={row.id}
                active={selected?.id === row.id}
                onSelect={() => setSelectedId(row.id)}
                title={row.patient_name}
                subtitle={`${row.service} — ${row.preferred_date} ${row.preferred_time}`}
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
                <h3 className="font-display text-2xl">{selected.patient_name}</h3>
                <StatusSelect
                  table="bookings"
                  id={selected.id}
                  value={selected.status}
                  options={BOOKING_STATUSES}
                />
              </div>
              <dl>
                <Field
                  label="Email"
                  value={<a href={`mailto:${selected.email}`}>{selected.email}</a>}
                />
                <Field label="Phone" value={selected.phone} />
                <Field label="Consultation" value={selected.service} />
                <Field label="Preferred date" value={selected.preferred_date} />
                <Field label="Preferred time" value={selected.preferred_time} />
                <Field label="Notes" value={selected.notes} />
                <Field label="Requested" value={formatWhen(selected.created_at)} />
              </dl>
            </div>
          ) : (
            <EmptyState>Select a booking to read it.</EmptyState>
          )
        }
      />
    </div>
  );
}
