'use client';

import { createClient } from '@/utils/supabase/client';

// Global promise for in-flight token requests
let tokenFetchPromise: Promise<TokenCache | null> | null = null;

// Cache for tokens to reduce API calls
interface TokenCache {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  lastFetched: number;
}

let tokenCache: TokenCache | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Session storage keys
const SESSION_STORAGE_KEYS = {
  ACCESS_TOKEN: 'google_access_token',
  REFRESH_TOKEN: 'google_refresh_token',
  EXPIRES_AT: 'google_expires_at',
  LAST_FETCHED: 'google_last_fetched'
};

/**
 * Saves tokens to session storage
 */
function saveTokensToSessionStorage(tokens: TokenCache) {
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken || '');
      sessionStorage.setItem(SESSION_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken || '');
      sessionStorage.setItem(SESSION_STORAGE_KEYS.EXPIRES_AT, String(tokens.expiresAt || ''));
      sessionStorage.setItem(SESSION_STORAGE_KEYS.LAST_FETCHED, String(tokens.lastFetched));
    }
  } catch (error) {
    console.error('Error saving tokens to session storage:', error);
  }
}

/**
 * Gets tokens from session storage
 */
function getTokensFromSessionStorage(): TokenCache | null {
  try {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = sessionStorage.getItem(SESSION_STORAGE_KEYS.REFRESH_TOKEN);
      const expiresAtStr = sessionStorage.getItem(SESSION_STORAGE_KEYS.EXPIRES_AT);
      const lastFetchedStr = sessionStorage.getItem(SESSION_STORAGE_KEYS.LAST_FETCHED);
      
      if (accessToken && refreshToken && lastFetchedStr) {
        return {
          accessToken,
          refreshToken,
          expiresAt: expiresAtStr ? parseInt(expiresAtStr, 10) : null,
          lastFetched: parseInt(lastFetchedStr, 10)
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting tokens from session storage:', error);
    return null;
  }
}

/**
 * Fetches tokens from the API and updates the cache
 */
async function fetchTokensFromApi(): Promise<TokenCache | null> {
  // Check if we already have a request in progress
  if (tokenFetchPromise) {
    return tokenFetchPromise;
  }

  // Create a new promise for this fetch
  tokenFetchPromise = (async () => {
    try {
      console.log('Fetching tokens from API');
      const response = await fetch('/api/auth/google-tokens');
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData.error || response.statusText);
        return null;
      }
      
      const data = await response.json();
      
      // Update cache
      tokenCache = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at,
        lastFetched: Date.now()
      };
      
      // Save to session storage
      saveTokensToSessionStorage(tokenCache);
      
      return tokenCache;
    } catch (error) {
      console.error('Error fetching tokens from API:', error);
      return null;
    } finally {
      // Clear the promise so future calls can make a new request
      setTimeout(() => {
        tokenFetchPromise = null;
      }, 100); // Small delay to prevent race conditions
    }
  })();

  return tokenFetchPromise;
}

/**
 * Gets tokens from cache or fetches fresh ones if needed
 */
async function getTokens(): Promise<TokenCache | null> {
  // First check memory cache
  if (tokenCache) {
    const currentTime = Math.floor(Date.now() / 1000);
    // If token exists and is not expired or about to expire (5 min buffer)
    if (tokenCache.accessToken && tokenCache.expiresAt && 
        (tokenCache.expiresAt - currentTime > 300)) {
      return tokenCache;
    }
  }
  
  // Then check session storage
  const sessionTokens = getTokensFromSessionStorage();
  if (sessionTokens) {
    const currentTime = Math.floor(Date.now() / 1000);
    // If token exists and is not expired or about to expire (5 min buffer)
    if (sessionTokens.accessToken && sessionTokens.expiresAt && 
        (sessionTokens.expiresAt - currentTime > 300)) {
      tokenCache = sessionTokens; // Update memory cache
      return sessionTokens;
    }
  }
  
  // Otherwise fetch fresh tokens
  return await fetchTokensFromApi();
}

/**
 * Gets the Google refresh token from a Supabase session (client-side version)
 */
export async function getRefreshTokenFromSession(): Promise<string | null> {
  try {
    // First check our cache/session storage
    const tokens = await getTokens();
    if (tokens?.refreshToken) {
      return tokens.refreshToken;
    }
    
    // If not in cache, try to get from Supabase session
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }
    
    if (!data.session) {
      console.warn('No session available');
      return null;
    }
    
    // Get the provider refresh token from the session
    const providerRefreshToken = data.session.provider_refresh_token;
    
    if (!providerRefreshToken) {
      console.warn('No provider refresh token in session');
      return null;
    }
    
    // Update our cache with the token from the session
    if (tokenCache) {
      tokenCache.refreshToken = providerRefreshToken;
      saveTokensToSessionStorage(tokenCache);
    } else {
      const newCache: TokenCache = {
        accessToken: data.session.provider_token || null,
        refreshToken: providerRefreshToken,
        expiresAt: null,
        lastFetched: Date.now()
      };
      tokenCache = newCache;
      saveTokensToSessionStorage(newCache);
    }
    
    return providerRefreshToken;
  } catch (error) {
    console.error('Error in getRefreshTokenFromSession:', error);
    
    // Try API as last resort
    const tokens = await fetchTokensFromApi();
    return tokens?.refreshToken || null;
  }
}

/**
 * Gets the Google access token from a Supabase session (client-side version)
 */
export async function getAccessTokenFromSession(): Promise<string | null> {
  try {
    // First check our cache/session storage
    const tokens = await getTokens();
    if (tokens?.accessToken) {
      // Check if token is expired or about to expire
      if (tokens.expiresAt) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokens.expiresAt - currentTime < 300) {
          // Token is about to expire, fetch a new one
          const newTokens = await fetchTokensFromApi();
          return newTokens?.accessToken || null;
        }
      }
      return tokens.accessToken;
    }
    
    // If not in cache, try to get from Supabase session
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }
    
    if (!data.session) {
      console.warn('No session available');
      return null;
    }
    
    // Get the provider token (access token) from the session
    const providerToken = data.session.provider_token;
    
    if (!providerToken) {
      console.warn('No provider token in session');
      return null;
    }
    
    // Update our cache with the token from the session
    if (tokenCache) {
      tokenCache.accessToken = providerToken;
      saveTokensToSessionStorage(tokenCache);
    } else {
      const newCache: TokenCache = {
        accessToken: providerToken,
        refreshToken: data.session.provider_refresh_token || null,
        expiresAt: null,
        lastFetched: Date.now()
      };
      tokenCache = newCache;
      saveTokensToSessionStorage(newCache);
    }
    
    return providerToken;
  } catch (error) {
    console.error('Error in getAccessTokenFromSession:', error);
    
    // Try API as last resort
    const tokens = await fetchTokensFromApi();
    return tokens?.accessToken || null;
  }
}

// Add this to the global Window interface
declare global {
  interface Window {
    _tokenFetchPromise: Promise<TokenCache | null> | null;
  }
}

// Initialize the promise property
if (typeof window !== 'undefined') {
  window._tokenFetchPromise = null;
} 