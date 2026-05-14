"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Auth Actions (Server Actions)
   ─────────────────────────────────────────────────────────
   Secure, type-safe auth mutations called from client forms.
   ═══════════════════════════════════════════════════════════ */

export type AuthResult = {
  error: string | null;
  success: boolean;
};

/* ─── Email / Password Sign In ─── */
export async function signInWithEmail(
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required.", success: false };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  redirect("/dashboard");
}

/* ─── Email / Password Sign Up ─── */
export async function signUpWithEmail(
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required.", success: false };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters.", success: false };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name,
      },
    },
  });

  if (error) {
    return { error: error.message, success: false };
  }

  redirect("/onboarding");
}

/* ─── OAuth (Google / GitHub) ─── */
export async function signInWithOAuth(provider: "google" | "github") {
  const supabase = await createClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin") || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message, success: false };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: "Something went wrong.", success: false };
}

/* ─── Sign Out ─── */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/* ─── Get Current User (for Server Components) ─── */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
