'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

/**
 * Gets the current authenticated user
 * This is a utility function that can be used in non-React contexts
 * where the useAuth hook cannot be used
 */
export async function getAuthUser(): Promise<User | null> {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error in getAuthUser:', error);
    return null;
  }
}

/**
 * Checks if the user is authenticated
 * This is a utility function that can be used in non-React contexts
 * where the useAuth hook cannot be used
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthUser();
  return !!user;
}

/**
 * Signs the user out
 * This is a utility function that can be used in non-React contexts
 * where the useAuth hook cannot be used
 */
export async function signOut(): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
} 