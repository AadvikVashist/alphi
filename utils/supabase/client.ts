'use client';

import { createBrowserClient } from "@supabase/ssr";

// Global client instance
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Return existing client if available
  if (supabaseClient) {
    return supabaseClient;
  }
  
  // Create a new client if none exists
  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  return supabaseClient;
}
