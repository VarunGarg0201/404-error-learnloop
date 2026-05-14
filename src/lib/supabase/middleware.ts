import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Auth Middleware
   ─────────────────────────────────────────────────────────
   1. Refreshes Supabase auth tokens on every request
   2. Protects dashboard routes (redirects to /login)
   3. Redirects authenticated users away from auth pages
   ═══════════════════════════════════════════════════════════ */

const PUBLIC_ROUTES = ["/", "/login", "/register", "/onboarding"];
const AUTH_ROUTES = ["/login", "/register"];

export async function updateSession(request: NextRequest) {
  // If env vars are missing, let the request through to avoid crashing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables in middleware");
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refresh the auth token
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // ─── Redirect unauthenticated users from protected routes ───
    if (
      !user &&
      !PUBLIC_ROUTES.includes(pathname) &&
      !pathname.startsWith("/auth/") &&
      !pathname.startsWith("/api/")
    ) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ─── Redirect authenticated users away from auth pages ───
    if (user && AUTH_ROUTES.includes(pathname)) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      return NextResponse.redirect(dashboardUrl);
    }

    return supabaseResponse;
  } catch (error) {
    console.error("Middleware auth error:", error);
    // On error, let the request through instead of crashing
    return NextResponse.next({ request });
  }
}
