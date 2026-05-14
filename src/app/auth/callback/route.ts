import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/* ─── OAuth Callback Handler ───
   Supabase redirects here after Google/GitHub login.
   Exchanges the auth code for a session.
   ─────────────────────────────────────────────────── */

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
