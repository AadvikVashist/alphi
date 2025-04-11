import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user } } = await supabase.auth.getUser();

    // Handle protected routes
    const url = new URL(request.url);
    const isAuthPage = url.pathname === "/login";
    
    // Define protected routes
    const protectedRoutes = [
      "/memories",
      "/emails",
      "/dashboard",
      "/ai-settings",
      "/creators", 
      "/writing-style-synthesis"
    ];
    
    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
      url.pathname === route || url.pathname.startsWith(`${route}/`)
    );
    
    // If user is signed in and tries to access login page, redirect to dashboard
    if (isAuthPage && user) {
      return NextResponse.redirect(new URL("/memories", request.url));
    }
    
    // If user is not signed in and tries to access protected route, redirect to login
    if (isProtectedRoute && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    console.error("Supabase client error:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
