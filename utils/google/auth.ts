import { createClient } from '@/utils/supabase/server';
import { Session } from '@supabase/supabase-js';

// Types for Google tokens
export interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_at: number;
  scope: string;
}

/**
 * Gets the Google refresh token from a Supabase session
 */
export async function getRefreshTokenFromSession(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }
    
    if (!data.session) {
      console.error('No session available');
      return null;
    }
    
    // Get the provider refresh token from the session
    const providerRefreshToken = data.session.provider_refresh_token;
    
    if (!providerRefreshToken) {
      console.error('No provider refresh token in session');
      
      // Try to get it from the database as fallback
      const userId = data.session.user.id;
      const tokens = await getGoogleTokens(userId);
      return tokens?.refresh_token || null;
    }
    
    return providerRefreshToken;
  } catch (error) {
    console.error('Error in getRefreshTokenFromSession:', error);
    return null;
  }
}

/**
 * Exchanges an authorization code for Google OAuth tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
  const tokenEndpoint = 'https://oauth2.googleapis.com/token';
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;

  const params = new URLSearchParams({
    code,
    client_id: clientId!,
    client_secret: clientSecret!,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to exchange code for tokens: ${errorData.error_description || errorData.error}`);
  }

  const data = await response.json();
  
  // Calculate expiration time (current time + expires_in seconds)
  const expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
  
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    id_token: data.id_token,
    expires_at: expiresAt,
    scope: data.scope,
  };
}

/**
 * Refreshes an expired Google access token using the refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<Partial<GoogleTokens>> {
  const tokenEndpoint = 'https://oauth2.googleapis.com/token';
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId!,
    client_secret: clientSecret!,
    grant_type: 'refresh_token',
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to refresh token: ${errorData.error_description || errorData.error}`);
  }

  const data = await response.json();
  
  // Calculate expiration time (current time + expires_in seconds)
  const expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
  
  return {
    access_token: data.access_token,
    id_token: data.id_token,
    expires_at: expiresAt,
    scope: data.scope,
  };
}

/**
 * Stores Google OAuth tokens in Supabase for a user
 */
export async function storeGoogleTokens(userId: string, tokens: GoogleTokens): Promise<void> {
  const supabase = await createClient();
  
  // Store tokens in a secure table
  const { error } = await supabase
    .from('user_google_tokens')
    .upsert({
      user_id: userId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      id_token: tokens.id_token,
      expires_at: tokens.expires_at,
      scope: tokens.scope,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    });

  if (error) {
    console.error('Error storing Google tokens:', error);
    throw new Error(`Failed to store Google tokens: ${error.message}`);
  }
}

/**
 * Retrieves Google OAuth tokens for a user from Supabase
 */
export async function getGoogleTokens(userId: string): Promise<GoogleTokens | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_google_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error retrieving Google tokens:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    id_token: data.id_token,
    expires_at: data.expires_at,
    scope: data.scope,
  };
}

/**
 * Gets a valid access token for a user, refreshing if necessary
 */
export async function getValidAccessToken(userId: string): Promise<string | null> {
  // Get the stored tokens
  const tokens = await getGoogleTokens(userId);
  
  if (!tokens) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  
  // Check if the token is expired or about to expire (within 5 minutes)
  if (tokens.expires_at - currentTime < 300) {
    try {
      // Token is expired or about to expire, refresh it
      const newTokens = await refreshAccessToken(tokens.refresh_token);
      
      // Update the stored tokens
      await storeGoogleTokens(userId, {
        ...tokens,
        ...newTokens,
      });
      
      return newTokens.access_token || null;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }
  
  // Token is still valid
  return tokens.access_token;
}

/**
 * Revokes Google OAuth tokens for a user
 */
export async function revokeGoogleTokens(userId: string): Promise<void> {
  const tokens = await getGoogleTokens(userId);
  
  if (!tokens) {
    return;
  }

  // Revoke access token
  if (tokens.access_token) {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${tokens.access_token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }
  
  // Revoke refresh token
  if (tokens.refresh_token) {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${tokens.refresh_token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  // Remove tokens from database
  const supabase = await createClient();
  await supabase
    .from('user_google_tokens')
    .delete()
    .eq('user_id', userId);
} 