import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ─── OAuth Callback Handler ───
   Supabase redirects here after Google/GitHub login.
   Exchanges the auth code for a session and syncs User to Prisma.
   ─────────────────────────────────────────────────── */

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error, data: sessionData } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && sessionData?.user) {
      const user = sessionData.user;
      
      // Sync user to Prisma
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
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
            },
          });
        }
      } catch (dbError) {
        console.error("Failed to sync user to database:", dbError);
        // Continue anyway so auth is not blocked
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
