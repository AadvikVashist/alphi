import { createClient } from '@/utils/supabase/server';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

/**
 * Get the access token from server session cookies
 */
export async function getAccessTokenFromSession(cookies: ReadonlyRequestCookies) {
  const supabase = await createClient();
  const { data: sessionData, error } = await supabase.auth.getSession();
  
  if (error || !sessionData.session) {
    console.error('No server session found:', error);
    return null;
  }
  
  // Get raw data from the session
  const { data: userData, error: userError } = await supabase
    .from('user_google_tokens')
    .select('access_token, expires_at')
    .eq('user_id', sessionData.session.user.id)
    .single();
  
  if (userError || !userData) {
    console.error('No access token found:', userError);
    return null;
  }
  
  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  if (userData.expires_at && userData.expires_at < now) {
    console.log('Access token expired, need refresh');
    return null;
  }
  
  return userData.access_token;
}

/**
 * Get the refresh token from server session cookies
 */
export async function getRefreshTokenFromSession(cookies: ReadonlyRequestCookies) {
  const supabase = await createClient();
  const { data: sessionData, error } = await supabase.auth.getSession();
  
  if (error || !sessionData.session) {
    console.error('No server session found:', error);
    return null;
  }
  
  // Get refresh token from the session
  const { data: userData, error: userError } = await supabase
    .from('user_google_tokens')
    .select('refresh_token')
    .eq('user_id', sessionData.session.user.id)
    .single();
  
  if (userError || !userData) {
    console.error('No refresh token found:', userError);
    return null;
  }
  
  return userData.refresh_token;
} 