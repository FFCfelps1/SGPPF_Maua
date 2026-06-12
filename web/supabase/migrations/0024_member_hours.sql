-- Add dedication hours to project and submission members
ALTER TABLE project_members 
ADD COLUMN IF NOT EXISTS dedication_hours INTEGER DEFAULT 0;

ALTER TABLE submission_members 
ADD COLUMN IF NOT EXISTS dedication_hours INTEGER DEFAULT 0;

COMMENT ON COLUMN project_members.dedication_hours IS 'Horas de dedicação semanal do pesquisador ao projeto.';
COMMENT ON COLUMN submission_members.dedication_hours IS 'Horas de dedicação semanal previstas para o pesquisador na submissão.';
