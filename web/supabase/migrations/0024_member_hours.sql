-- Use the group permission enum values added in the previous migration.
INSERT INTO role_permissions (role, permission)
VALUES
  ('admin', 'groups:read'),
  ('admin', 'groups:manage'),
  ('dept_manager', 'groups:read'),
  ('dept_manager', 'groups:manage'),
  ('cp_manager', 'groups:read'),
  ('maua_manager', 'groups:read')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role, permission)
VALUES ('dept_manager', 'researchers:read')
ON CONFLICT DO NOTHING;

-- Add dedication hours to project and submission members
ALTER TABLE project_members 
ADD COLUMN IF NOT EXISTS dedication_hours INTEGER DEFAULT 0;

ALTER TABLE submission_members 
ADD COLUMN IF NOT EXISTS dedication_hours INTEGER DEFAULT 0;

COMMENT ON COLUMN project_members.dedication_hours IS 'Horas de dedicação semanal do pesquisador ao projeto.';
COMMENT ON COLUMN submission_members.dedication_hours IS 'Horas de dedicação semanal previstas para o pesquisador na submissão.';
