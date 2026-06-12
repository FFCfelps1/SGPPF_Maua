-- Add UPDATE policy for submission_members to allow updating dedication hours
CREATE POLICY "submission_members_update" ON public.submission_members
  FOR UPDATE TO authenticated
  USING (authorize('submissions:write'))
  WITH CHECK (authorize('submissions:write'));
