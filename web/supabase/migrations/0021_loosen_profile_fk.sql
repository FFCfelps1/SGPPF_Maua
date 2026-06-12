-- Use the enum value added in the previous migration. PostgreSQL requires the
-- transaction that adds an enum value to commit before the value is used.
INSERT INTO role_permissions (role, permission)
SELECT r, 'researchers:create'
FROM unnest(enum_range(null::app_role)) AS r
WHERE r NOT IN ('researcher', 'consultant')
ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (authorize('researchers:create') OR authorize('users:manage'));

-- Remove foreign key constraint from profiles to auth.users to allow pre-registration
-- The id will still be the user's ID once they sign up, but it doesn't have to exist in auth.users immediately.
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- We still want a weak link, but our handle_new_user trigger in 0006 already handles 
-- linking signups to existing profiles via email if we adjust it.
