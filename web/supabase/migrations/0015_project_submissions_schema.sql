-- Part 2: Tables, RLS and Permissions.
-- This file depends on the types created in 0014 being committed.

CREATE TABLE public.project_submissions (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  researcher_id         UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  abstract              TEXT,
  objectives            TEXT,
  methodology           TEXT,
  estimated_budget      NUMERIC(14, 2) DEFAULT 0 CHECK (estimated_budget >= 0),
  funding_agency        TEXT,
  fapesp_modality       TEXT,
  status                public.submission_status NOT NULL DEFAULT 'draft',
  funding_agency_status TEXT,
  internal_feedback     TEXT,
  dept_approval_at      TIMESTAMPTZ,
  cp_approval_at        TIMESTAMPTZ,
  maua_approval_at      TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

-- Permissions seeding.
INSERT INTO public.role_permissions (role, permission) VALUES
  ('admin', 'submissions:read'), ('admin', 'submissions:write'), ('admin', 'submissions:approve'),
  ('researcher', 'submissions:read'), ('researcher', 'submissions:write'),
  ('dept_manager', 'submissions:read'), ('dept_manager', 'submissions:approve'),
  ('cp_manager', 'submissions:read'), ('cp_manager', 'submissions:approve'),
  ('maua_manager', 'submissions:read'), ('maua_manager', 'submissions:approve')
ON CONFLICT DO NOTHING;

-- Policies using the new permission values.
CREATE POLICY "submissions_researcher_select" ON public.project_submissions
  FOR SELECT TO authenticated
  USING (authorize('submissions:read') AND (researcher_id = auth.uid() OR authorize('submissions:approve')));

CREATE POLICY "submissions_researcher_insert" ON public.project_submissions
  FOR INSERT TO authenticated
  WITH CHECK (authorize('submissions:write') AND researcher_id = auth.uid());

CREATE POLICY "submissions_researcher_update" ON public.project_submissions
  FOR UPDATE TO authenticated
  USING (
    (researcher_id = auth.uid() AND status = 'draft') OR 
    (authorize('submissions:approve')) OR
    (status = 'approved_maua')
  );

-- Trigger for updated_at.
CREATE TRIGGER on_project_submissions_updated
  BEFORE UPDATE ON public.project_submissions
  FOR EACH ROW EXECUTE FUNCTION public.touch_timestamps();

COMMENT ON TABLE public.project_submissions IS 'Propostas de projetos para submissão e aprovação interna/externa.';
