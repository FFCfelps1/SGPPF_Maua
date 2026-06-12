-- Add groups:read and groups:manage permissions
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'groups:read';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'groups:manage';

-- Grant groups:read to admins and managers
INSERT INTO role_permissions (role, permission)
VALUES 
  ('admin', 'groups:read'),
  ('admin', 'groups:manage'),
  ('dept_manager', 'groups:read'),
  ('dept_manager', 'groups:manage'),
  ('cp_manager', 'groups:read'),
  ('maua_manager', 'groups:read')
ON CONFLICT DO NOTHING;

-- Also ensure dept_manager can read researchers
INSERT INTO role_permissions (role, permission)
VALUES ('dept_manager', 'researchers:read')
ON CONFLICT DO NOTHING;
