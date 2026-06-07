-- publications: read-all (capability-gated). Create needs publications:write; editing/
-- deleting needs the user to be an author (or admin) — AE1.
create policy "publications_select" on publications
  for select to authenticated using (authorize('publications:read'));

create policy "publications_insert" on publications
  for insert to authenticated with check (authorize('publications:write'));

create policy "publications_update" on publications
  for update to authenticated
  using (
    authorize('publications:write')
    and (
      authorize('users:manage')
      or exists (
        select 1 from publication_authors pa
        where pa.publication_id = publications.id and pa.profile_id = auth.uid()
      )
    )
  )
  with check (authorize('publications:write'));

create policy "publications_delete" on publications
  for delete to authenticated
  using (
    authorize('publications:delete')
    and (
      authorize('users:manage')
      or exists (
        select 1 from publication_authors pa
        where pa.publication_id = publications.id and pa.profile_id = auth.uid()
      )
    )
  );

-- publication_authors: read-all; a user links/unlinks only themselves (admin: anyone).
create policy "pub_authors_select" on publication_authors
  for select to authenticated using (authorize('publications:read'));

create policy "pub_authors_insert" on publication_authors
  for insert to authenticated
  with check (
    authorize('publications:write')
    and (profile_id = auth.uid() or authorize('users:manage'))
  );

create policy "pub_authors_delete" on publication_authors
  for delete to authenticated
  using (
    authorize('publications:write')
    and (profile_id = auth.uid() or authorize('users:manage'))
  );
