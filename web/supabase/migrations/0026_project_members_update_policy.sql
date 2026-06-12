-- Add UPDATE policy for project_members to allow updating dedication hours
CREATE POLICY "project_members_update" ON public.project_members
  FOR UPDATE TO authenticated
  USING (authorize('projects:write'))
  WITH CHECK (authorize('projects:write'));
