import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useAuth() {
  const utils = trpc.useUtils();
  const [authReady, setAuthReady] = useState(false);

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: authReady,
  });

  // Listen for Supabase auth state changes to trigger refetch
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthReady(!!session);
      if (session) {
        utils.auth.me.invalidate();
      } else {
        utils.auth.me.setData(undefined, null);
      }
    });

    // Check initial session
    supabase.auth.getSession().then(({ data }) => {
      setAuthReady(!!data.session);
    });

    return () => subscription.unsubscribe();
  }, [utils]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    utils.auth.me.setData(undefined, null);
    await utils.auth.me.invalidate();
  }, [utils]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    },
    []
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const signInWithKakao = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const state = useMemo(
    () => ({
      user: meQuery.data ?? null,
      loading: !authReady || meQuery.isLoading,
      error: meQuery.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    }),
    [authReady, meQuery.data, meQuery.error, meQuery.isLoading]
  );

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithKakao,
  };
}
