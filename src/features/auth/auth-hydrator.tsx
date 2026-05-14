"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/user-store";

/* ═══════════════════════════════════════════════════════════
   Auth Hydrator
   ─────────────────────────────────────────────────────────
   Runs on mount inside the dashboard layout.
   Fetches the current Supabase user and hydrates Zustand.
   Listens for auth state changes (sign out from another tab).
   ═══════════════════════════════════════════════════════════ */

export function AuthHydrator() {
  const { setUser, clearUser, setLoading } = useUserStore();

  useEffect(() => {
    const supabase = createClient();

    // Initial hydration
    async function hydrate() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({
          id: user.id,
          email: user.email || "",
          username: user.user_metadata?.username || "",
          displayName:
            user.user_metadata?.display_name ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Student",
          avatarUrl:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null,
          campus: user.user_metadata?.campus || null,
          stream: user.user_metadata?.stream || null,
          year: user.user_metadata?.year || null,
          bio: user.user_metadata?.bio || null,
          knowledgeCredits: 0,
          trustScore: 0,
          isOnboarded: user.user_metadata?.is_onboarded || false,
          createdAt: user.created_at,
        });
      } else {
        clearUser();
      }
    }

    hydrate();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        clearUser();
      }
      if (event === "SIGNED_IN" && session?.user) {
        hydrate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, clearUser, setLoading]);

  return null; // This component renders nothing
}
