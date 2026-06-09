-- Refine project_submissions table and add members.
ALTER TABLE public.project_submissions RENAME COLUMN fapesp_modality TO modality;

ALTER TABLE public.project_submissions
  ADD COLUMN knowledge_area   TEXT,
  ADD COLUMN department       TEXT,
  ADD COLUMN unit             TEXT,
  ADD COLUMN research_duration TEXT, -- "Tempo de pesquisa"
  ADD COLUMN partners          TEXT; -- "Parceiros"

-- Link researchers already registered.
CREATE TABLE public.submission_members (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id  BIGINT NOT NULL REFERENCES public.project_submissions (id) ON DELETE CASCADE,
  profile_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  role           TEXT, -- e.g. 'Pesquisador', 'Bolsista'
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (submission_id, profile_id)
);

-- RLS for submission_members.
ALTER TABLE public.submission_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "submission_members_select" ON public.submission_members
  FOR SELECT TO authenticated
  USING (authorize('submissions:read'));

CREATE POLICY "submission_members_insert" ON public.submission_members
  FOR INSERT TO authenticated
  WITH CHECK (authorize('submissions:write'));

CREATE POLICY "submission_members_delete" ON public.submission_members
  FOR DELETE TO authenticated
  USING (authorize('submissions:write'));

COMMENT ON TABLE public.submission_members IS 'Pesquisadores vinculados a uma submissão de projeto.';
