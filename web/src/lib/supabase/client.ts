import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";
import type { Database } from "@/lib/database.types";

/** Supabase client for Client Components (publishable key only). */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
