import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

import { isSupabaseConfigured } from "@/lib/public-config";
import { supabase } from "@/lib/supabase";

export type AdminAuth = {
  loading: boolean;
  /** Null while signed out, and for anonymous chat visitors. */
  user: User | null;
  isAdmin: boolean;
  error: string | null;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export function useAdminAuth(): AdminAuth {
  const configured = isSupabaseConfigured();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyUser = useCallback(async (next: User | null | undefined) => {
    // A visitor with the chat widget open holds a real session — it is just an
    // anonymous one, and anonymous is never staff.
    const candidate = next && !next.is_anonymous ? next : null;
    setUser(candidate);

    if (!candidate) {
      setIsAdmin(false);
      return;
    }

    // Ask the `admins` table rather than reading a claim out of the token: the
    // list can change without the user signing in again, and a claim is only
    // as fresh as the JWT carrying it.
    const { data, error: lookupError } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", candidate.id)
      .maybeSingle();

    if (lookupError) {
      setError(lookupError.message);
      setIsAdmin(false);
      return;
    }
    setIsAdmin(Boolean(data));
  }, []);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      setError(
        "Supabase is not configured for this deployment. Set SUPABASE_URL and SUPABASE_ANON_KEY (see /api/health), then redeploy.",
      );
      return;
    }

    let cancelled = false;

    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      await applyUser(data.session?.user);
      if (!cancelled) setLoading(false);
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      void applyUser(session?.user);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [configured, applyUser]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        await applyUser(data.user);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : String(caught));
      } finally {
        setLoading(false);
      }
    },
    [applyUser],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }, []);

  return { loading, user, isAdmin, error, configured, signIn, signOut };
}
