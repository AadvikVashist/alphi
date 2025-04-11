'use client';

import { createClient } from '@/utils/supabase/client';
import { getAuthUser } from '@/utils/auth-helpers';

// Types
interface GoogleTokens {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  lastFetched: number;
}

// Session storage keys
const SESSION_STORAGE_KEYS = {
  ACCESS_TOKEN: 'google_access_token',
  REFRESH_TOKEN: 'google_refresh_token',
  EXPIRES_AT: 'google_expires_at',
  LAST_FETCHED: 'google_last_fetched'
};

// Global state
let tokenCache: GoogleTokens | null = null;
let tokenFetchPromise: Promise<GoogleTokens | null> | null = null;
let lastUserCheck: number = 0;
let cachedUserId: string | null = null;

// Debounce time in milliseconds
const DEBOUNCE_TIME = 2000; // 2 seconds
const USER_CACHE_TIME = 60000; // 1 minute

/**
 * Saves tokens to session storage
 */
function saveTokensToSessionStorage(tokens: GoogleTokens) {
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
function getTokensFromSessionStorage(): GoogleTokens | null {
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
 * Gets the current user ID with caching
 */
async function getCurrentUserId(): Promise<string | null> {
  // Use cached user ID if available and recent
  if (cachedUserId && Date.now() - lastUserCheck < USER_CACHE_TIME) {
    return cachedUserId;
  }
  
  try {
    // Get user from the global auth state
    const user = await getAuthUser();
    
    if (!user) {
      console.error('Error getting user: Not authenticated');
      return null;
    }
    
    // Update cache
    cachedUserId = user.id;
    lastUserCheck = Date.now();
    
    return user.id;
  } catch (error) {
    console.error('Error in getCurrentUserId:', error);
    return null;
  }
}

/**
 * Fetches tokens from the API with debouncing and caching
 */
async function fetchTokensFromApi(): Promise<GoogleTokens | null> {
  // If we already have a request in progress, return that promise
  if (tokenFetchPromise) {
    return tokenFetchPromise;
  }
  
  // Create a new promise for this fetch
  tokenFetchPromise = (async () => {
    try {
      console.log('[TokenService] Fetching tokens from API');
      
      const response = await fetch('/api/auth/google-tokens', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[TokenService] API error:', errorData.error || response.statusText);
        return null;
      }
      
      const data = await response.json();
      
      // Update cache
      const newTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at,
        lastFetched: Date.now()
      };
      
      tokenCache = newTokens;
      
      // Save to session storage
      saveTokensToSessionStorage(newTokens);
      
      return newTokens;
    } catch (error) {
      console.error('[TokenService] Error fetching tokens from API:', error);
      return null;
    } finally {
      // Clear the promise with a delay to prevent rapid successive calls
      setTimeout(() => {
        tokenFetchPromise = null;
      }, DEBOUNCE_TIME);
    }
  })();
  
  return tokenFetchPromise;
}

/**
 * Checks if a token is valid and not about to expire
 */
function isTokenValid(tokens: GoogleTokens | null): boolean {
  if (!tokens || !tokens.accessToken || !tokens.expiresAt) {
    return false;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  // Consider token valid if it has more than 5 minutes before expiry
  return tokens.expiresAt - currentTime > 300;
}

/**
 * Gets a valid access token, refreshing if necessary
 */
export async function getValidAccessToken(): Promise<string | null> {
  // First check memory cache
  if (isTokenValid(tokenCache)) {
    return tokenCache!.accessToken;
  }
  
  // Then check session storage
  const sessionTokens = getTokensFromSessionStorage();
  if (isTokenValid(sessionTokens)) {
    tokenCache = sessionTokens; // Update memory cache
    return sessionTokens!.accessToken;
  }
  
  // Otherwise fetch fresh tokens
  const freshTokens = await fetchTokensFromApi();
  return freshTokens?.accessToken || null;
}

/**
 * Gets the refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  // First check memory cache
  if (tokenCache?.refreshToken) {
    return tokenCache.refreshToken;
  }
  
  // Then check session storage
  const sessionTokens = getTokensFromSessionStorage();
  if (sessionTokens?.refreshToken) {
    tokenCache = sessionTokens; // Update memory cache
    return sessionTokens.refreshToken;
  }
  
  // Otherwise fetch fresh tokens
  const freshTokens = await fetchTokensFromApi();
  return freshTokens?.refreshToken || null;
}

/**
 * Gets token expiration time
 */
export async function getTokenExpiration(): Promise<number | null> {
  // First check memory cache
  if (tokenCache?.expiresAt) {
    return tokenCache.expiresAt;
  }
  
  // Then check session storage
  const sessionTokens = getTokensFromSessionStorage();
  if (sessionTokens?.expiresAt) {
    tokenCache = sessionTokens; // Update memory cache
    return sessionTokens.expiresAt;
  }
  
  // Otherwise fetch fresh tokens
  const freshTokens = await fetchTokensFromApi();
  return freshTokens?.expiresAt || null;
}

/**
 * Force refreshes the tokens
 */
export async function refreshTokens(): Promise<GoogleTokens | null> {
  // Clear any existing fetch promise
  tokenFetchPromise = null;
  
  // Fetch fresh tokens
  return await fetchTokensFromApi();
}

/**
 * Clears token cache (useful for logout)
 */
export function clearTokenCache(): void {
  tokenCache = null;
  tokenFetchPromise = null;
  
  // Clear session storage
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.REFRESH_TOKEN);
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.EXPIRES_AT);
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.LAST_FETCHED);
  }
}

// Export a singleton instance
const TokenService = {
  getValidAccessToken,
  getRefreshToken,
  getTokenExpiration,
  refreshTokens,
  clearTokenCache,
};

export default TokenService; 