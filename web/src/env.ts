import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Typed, validated environment variables.
 * Imported in `next.config.ts` so a missing/invalid var fails the build.
 *
 * Security: the secret (service_role) key is server-only and must never be
 * exposed to the client. Only the publishable (anon) key + URL are public.
 */
export const env = createEnv({
  server: {
    SUPABASE_SECRET_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
  emptyStringAsUndefined: true,
});
