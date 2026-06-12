-- Remove foreign key constraint from profiles to auth.users to allow pre-registration
-- The id will still be the user's ID once they sign up, but it doesn't have to exist in auth.users immediately.
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- We still want a weak link, but our handle_new_user trigger in 0006 already handles 
-- linking signups to existing profiles via email if we adjust it.
