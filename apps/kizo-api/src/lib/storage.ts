import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | undefined;

export function initSupabase(url: string, key: string) {
  supabase = createClient(url, key);
}

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error("Supabase not initialized");
  }
  return supabase;
}
