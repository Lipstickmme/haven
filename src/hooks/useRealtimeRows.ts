import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export type RealtimeRows<T> = {
  rows: T[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

type Options = {
  /** Column to sort on, newest first. */
  orderBy: string;
  /** Skip everything until the caller is actually an admin. */
  enabled: boolean;
  /** Narrow to one parent row, e.g. `{ column: "session_id", value: id }`. */
  filter?: { column: string; value: string };
  ascending?: boolean;
};

/**
 * A table's rows plus a live subscription to it. Every dashboard tab is the
 * same shape: read once, then let postgres_changes keep it current.
 */
export function useRealtimeRows<T extends { id: string }>(
  table: string,
  options: Options,
): RealtimeRows<T> {
  const { orderBy, enabled, filter, ascending = false } = options;
  // Destructured so the effects depend on stable primitives, not a fresh
  // object literal on every render.
  const filterColumn = filter?.column;
  const filterValue = filter?.value;
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((value) => value + 1), []);

  useEffect(() => {
    if (!enabled) {
      setRows([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      let query = supabase.from(table).select("*").order(orderBy, { ascending });
      if (filterColumn && filterValue) query = query.eq(filterColumn, filterValue);

      const { data, error: queryError } = await query;
      if (cancelled) return;

      if (queryError) setError(queryError.message);
      else {
        setError(null);
        setRows((data ?? []) as T[]);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [table, orderBy, ascending, filterColumn, filterValue, enabled, nonce]);

  useEffect(() => {
    if (!enabled) return;

    const sort = (list: T[]) =>
      [...list].sort((a, b) => {
        const left = String((a as Record<string, unknown>)[orderBy] ?? "");
        const right = String((b as Record<string, unknown>)[orderBy] ?? "");
        return ascending ? left.localeCompare(right) : right.localeCompare(left);
      });

    const channel = supabase
      .channel(`rows:${table}:${filterColumn ?? "all"}:${filterValue ?? ""}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          ...(filterColumn && filterValue ? { filter: `${filterColumn}=eq.${filterValue}` } : {}),
        },
        (payload) => {
          setRows((current) => {
            if (payload.eventType === "DELETE") {
              const gone = (payload.old as Partial<T>).id;
              return current.filter((row) => row.id !== gone);
            }
            const next = payload.new as T;
            if (!next?.id) return current;
            const without = current.filter((row) => row.id !== next.id);
            return sort([...without, next]);
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [table, filterColumn, filterValue, enabled, orderBy, ascending]);

  return { rows, loading, error, refresh };
}
