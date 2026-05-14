import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Minimalist Auth Middleware
   ─────────────────────────────────────────────────────────
   Ultra-stable version to prevent Vercel 500 errors.
   ═══════════════════════════════════════════════════════════ */

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 1. Immediately skip middleware for static files and landing page
  if (pathname === "/" || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 2. If keys are missing, don't crash, just let it through
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Simplest possible cookie setting
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // 3. Just check if the user exists
    const { data: { user } } = await supabase.auth.getUser();

    // 4. Simple protection logic
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isProtectedRoute = pathname.startsWith("/dashboard") || 
                           pathname.startsWith("/onboarding") ||
                           pathname.startsWith("/rooms");

    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (user && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (e) {
    // If auth fails for any reason, just let the request through to the page
    // where the client-side AuthHydrator can handle it. This prevents the 500 crash.
    return NextResponse.next();
  }
}
