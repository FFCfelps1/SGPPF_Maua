-- advisings: read-all; create/edit/delete by the advisor (or admin).
create policy "advisings_select" on advisings
  for select to authenticated using (authorize('advisings:read'));

create policy "advisings_insert" on advisings
  for insert to authenticated
  with check (authorize('advisings:write') and (advisor_id = auth.uid() or authorize('users:manage')));

create policy "advisings_update" on advisings
  for update to authenticated
  using (authorize('advisings:write') and (advisor_id = auth.uid() or authorize('users:manage')))
  with check (authorize('advisings:write') and (advisor_id = auth.uid() or authorize('users:manage')));

create policy "advisings_delete" on advisings
  for delete to authenticated
  using (authorize('advisings:delete') and (advisor_id = auth.uid() or authorize('users:manage')));
