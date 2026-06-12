-- Add researchers:create permission
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'researchers:create';

-- Grant researchers:create to all roles except researcher and consultant
INSERT INTO role_permissions (role, permission)
SELECT r, 'researchers:create'
FROM unnest(enum_range(null::app_role)) AS r
WHERE r NOT IN ('researcher', 'consultant')
ON CONFLICT DO NOTHING;

-- Update profiles RLS to allow insertion by anyone with researchers:create
-- Note: We DROP and CREATE because CHECK cannot be easily updated.
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (authorize('researchers:create') OR authorize('users:manage'));
