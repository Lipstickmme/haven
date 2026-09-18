import { useCallback, useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase";

export type RealtimeRows<T> = {
  rows: T[];
  loading: boolean;
  error: string | null;
  /** False when the realtime channel is not subscribed; the list then polls. */
  live: boolean;
  refresh: () => void;
  /** Merge a row written by this client, without waiting for the round trip. */
  upsert: (row: T) => void;
};

type Options = {
  orderBy: string;
  enabled: boolean;
  filter?: { column: string; value: string };
  ascending?: boolean;
};

/** Safety net when realtime is healthy, and the actual transport when it is not. */
const POLL_LIVE_MS = 20000;
const POLL_FALLBACK_MS = 4000;

export function useRealtimeRows<T extends { id: string }>(
  table: string,
  options: Options,
): RealtimeRows<T> {
  const { orderBy, enabled, filter, ascending = false } = options;
  const filterColumn = filter?.column;
  const filterValue = filter?.value;

  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [nonce, setNonce] = useState(0);
  // Only the first load shows a spinner; polls must not flash the list.
  const loadedOnce = useRef(false);

  const refresh = useCallback(() => setNonce((value) => value + 1), []);

  const sortRows = useCallback(
    (list: T[]) =>
      [...list].sort((a, b) => {
        const left = String((a as Record<string, unknown>)[orderBy] ?? "");
        const right = String((b as Record<string, unknown>)[orderBy] ?? "");
        return ascending ? left.localeCompare(right) : right.localeCompare(left);
      }),
    [orderBy, ascending],
  );

  const upsert = useCallback(
    (row: T) =>
      setRows((current) => sortRows([...current.filter((item) => item.id !== row.id), row])),
    [sortRows],
  );

  useEffect(() => {
    if (!enabled) {
      setRows([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    if (!loadedOnce.current) setLoading(true);

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
      loadedOnce.current = true;
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [table, orderBy, ascending, filterColumn, filterValue, enabled, nonce]);

  useEffect(() => {
    if (!enabled) return;

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
            return sortRows([...without, next]);
          });
        },
      )
      // Without this callback a CHANNEL_ERROR or TIMED_OUT is swallowed and the
      // list silently stops updating while still looking healthy.
      .subscribe((status, err) => {
        setLive(status === "SUBSCRIBED");
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn(`[realtime] ${table} channel ${status}`, err ?? "");
        }
      });

    return () => {
      setLive(false);
      void supabase.removeChannel(channel);
    };
  }, [table, filterColumn, filterValue, enabled, sortRows]);

  // Poll regardless: slowly as a safety net when the channel is subscribed,
  // quickly when it is not, so the dashboard keeps working even where realtime
  // is unavailable on the project.
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(refresh, live ? POLL_LIVE_MS : POLL_FALLBACK_MS);
    return () => clearInterval(id);
  }, [enabled, live, refresh]);

  return { rows, loading, error, live, refresh, upsert };
}
