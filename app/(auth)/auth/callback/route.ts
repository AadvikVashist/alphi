import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { exchangeCodeForTokens, storeGoogleTokens } from "@/utils/google/auth";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, error_description);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error_description || error)}`
    );
  }

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(`${origin}/login?error=No authorization code provided`);
  }

  try {
    const supabase = await createClient();
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (sessionError) {
      console.error("Error exchanging code for session:", sessionError);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(sessionError.message)}`
      );
    }
    
    // If this is a Google OAuth callback and we have a user
    if (data?.user) {
      try {
        // Get the session to extract provider tokens
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        
        if (session) {
          // Get provider refresh token from the session
          const providerRefreshToken = session.provider_refresh_token;
          const providerToken = session.provider_token; // This is the access token
          
          if (providerRefreshToken && providerToken) {
            // Calculate expiration time (default to 1 hour if not available)
            const expiresIn = session.expires_in || 3600;
            const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
            
            // Store the tokens in Supabase
            await storeGoogleTokens(data.user.id, {
              access_token: providerToken,
              refresh_token: providerRefreshToken,
              id_token: session.provider_token || "",
              expires_at: expiresAt,
              scope: "email profile https://www.googleapis.com/auth/gmail.readonly",
            });
            
            console.log("Successfully stored Google tokens from session");
            
            // Add script to store user ID in localStorage and Zustand store
            const script = `
              <script>
                // Store user ID in localStorage for backward compatibility
                localStorage.setItem('userId', '${data.user.id}');
                
                // Redirect to dashboard
                window.location.href = '${redirectTo ? `${origin}${redirectTo}` : `${origin}/memories`}';
              </script>
            `;
            
            return new NextResponse(script, {
              headers: {
                'Content-Type': 'text/html',
              },
            });
          } else {
            // Fallback to the original method if provider tokens are not in the session
            console.log("Provider tokens not found in session, using code exchange method");
            const googleTokens = await exchangeCodeForTokens(code);
            await storeGoogleTokens(data.user.id, googleTokens);
          }
        } else {
          throw new Error("No session available");
        }
      } catch (googleError: Error | unknown) {
        console.error("Error handling Google tokens:", googleError);
        // We don't redirect here because the authentication was successful,
        // even if storing the Google tokens failed
      }
    }

    // Successful authentication
    if (redirectTo) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    return NextResponse.redirect(`${origin}/memories`);
  } catch (error: Error | unknown) {
    console.error("Error in callback route:", error);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error instanceof Error ? error.message : 'Authentication failed')}`
    );
  }
}
