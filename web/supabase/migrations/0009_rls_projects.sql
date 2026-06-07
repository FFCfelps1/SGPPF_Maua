-- projects: read-all; create/edit/delete by the lead (or admin).
create policy "projects_select" on projects
  for select to authenticated using (authorize('projects:read'));

create policy "projects_insert" on projects
  for insert to authenticated
  with check (authorize('projects:write') and (lead_id = auth.uid() or authorize('users:manage')));

create policy "projects_update" on projects
  for update to authenticated
  using (authorize('projects:write') and (lead_id = auth.uid() or authorize('users:manage')))
  with check (authorize('projects:write') and (lead_id = auth.uid() or authorize('users:manage')));

create policy "projects_delete" on projects
  for delete to authenticated
  using (authorize('projects:delete') and (lead_id = auth.uid() or authorize('users:manage')));

-- funding: read-all; writes re-derive the parent project's lead (RLS does not inherit).
create policy "funding_select" on funding
  for select to authenticated using (authorize('funding:read'));

create policy "funding_insert" on funding
  for insert to authenticated
  with check (
    authorize('funding:write')
    and (authorize('users:manage') or exists (
      select 1 from projects p where p.id = funding.project_id and p.lead_id = auth.uid()
    ))
  );

create policy "funding_update" on funding
  for update to authenticated
  using (
    authorize('funding:write')
    and (authorize('users:manage') or exists (
      select 1 from projects p where p.id = funding.project_id and p.lead_id = auth.uid()
    ))
  )
  with check (
    authorize('funding:write')
    and (authorize('users:manage') or exists (
      select 1 from projects p where p.id = funding.project_id and p.lead_id = auth.uid()
    ))
  );

create policy "funding_delete" on funding
  for delete to authenticated
  using (
    authorize('funding:delete')
    and (authorize('users:manage') or exists (
      select 1 from projects p where p.id = funding.project_id and p.lead_id = auth.uid()
    ))
  );
