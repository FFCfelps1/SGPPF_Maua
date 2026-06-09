-- Allow researchers to update if status is 'draft' OR 'rejected'.
-- Also ensure managers can always update (useful for fixing small typos during approval).
DROP POLICY IF EXISTS "submissions_researcher_update" ON public.project_submissions;

CREATE POLICY "submissions_researcher_update" ON public.project_submissions
  FOR UPDATE TO authenticated
  USING (
    (researcher_id = auth.uid() AND status IN ('draft', 'rejected')) OR 
    (authorize('submissions:approve')) OR
    (status = 'approved_maua') -- For the agency tag
  );
