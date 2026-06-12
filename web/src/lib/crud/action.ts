import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { labels } from "@/lib/labels";

export type ActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

type Ctx = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  formData: FormData;
};

type ActionOptions = { revalidate?: string };

/**
 * Wraps a mutation handler into a Server Action. Every mutation goes through here:
 * authenticate (getClaims), validate with one shared zod schema, return typed field
 * errors (never throws across the boundary), then revalidate the route.
 *
 * Use from a "use server" file:
 *   export const createResearcher = action(schema, handler, { revalidate: "/researchers" })
 *
 * Defense-in-depth only — the real gate is RLS. The handler runs the user-scoped
 * Supabase client, so RLS still applies even if this auth check were bypassed.
 */
export function action<S extends z.ZodType>(
  schema: S,
  handler: (input: z.infer<S>, ctx: Ctx) => Promise<void>,
  opts: ActionOptions = {},
) {
  return async (
    _prevState: ActionState,
    formData: FormData,
  ): Promise<ActionState> => {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;
    if (!userId) return { ok: false, message: labels.errors.unauthorized };

    const parsed = schema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
    }

    try {
      await handler(parsed.data, { supabase, userId, formData });
    } catch (err) {
      // The client only ever sees the generic message, but the real cause
      // (most often an RLS denial — e.g. a missing user_role JWT claim) must
      // be visible in server logs rather than swallowed.
      console.error("[action] mutation failed", { userId }, err);
      return { ok: false, message: labels.errors.generic };
    }

    if (opts.revalidate) revalidatePath(opts.revalidate);
    return { ok: true };
  };
}
