-- 0031_dept_manager_access.sql

-- Grant publications and advisings access to dept_manager
INSERT INTO role_permissions (role, permission) VALUES
  ('dept_manager', 'publications:read'),
  ('dept_manager', 'publications:write'),
  ('dept_manager', 'publications:delete'),
  ('dept_manager', 'advisings:read'),
  ('dept_manager', 'advisings:write'),
  ('dept_manager', 'advisings:delete'),
  ('dept_manager', 'researchers:read'),
  ('dept_manager', 'projects:read'),
  ('dept_manager', 'funding:read')
ON CONFLICT DO NOTHING;

-- Grant read access to other managers (CP and Mauá)
INSERT INTO role_permissions (role, permission) VALUES
  ('cp_manager', 'publications:read'),
  ('cp_manager', 'advisings:read'),
  ('cp_manager', 'projects:read'),
  ('cp_manager', 'funding:read'),
  ('cp_manager', 'researchers:read'),
  ('maua_manager', 'publications:read'),
  ('maua_manager', 'advisings:read'),
  ('maua_manager', 'projects:read'),
  ('maua_manager', 'funding:read'),
  ('maua_manager', 'researchers:read')
ON CONFLICT DO NOTHING;
