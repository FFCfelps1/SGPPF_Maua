-- Profiles RLS: read-all (capability-gated), self-or-admin writes, role not self-writable.

-- Read: any authenticated user with researchers:read sees all profiles (the app filters
-- is_active in the list query). Inserts happen via the handle_new_user trigger on signup;
-- direct inserts are admin-only.
create policy "profiles_select" on profiles
  for select to authenticated
  using (authorize('researchers:read'));

create policy "profiles_insert" on profiles
  for insert to authenticated
  with check (authorize('users:manage'));

create policy "profiles_update" on profiles
  for update to authenticated
  using (
    authorize('researchers:write')
    and (id = auth.uid() or authorize('users:manage'))
  )
  with check (
    authorize('researchers:write')
    and (id = auth.uid() or authorize('users:manage'))
  );

-- Role is privilege-bearing: only users:manage may change it. RLS gates rows, not
-- columns, so a column guard is required (otherwise a researcher could self-escalate).
create or replace function public.guard_profile_role()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  -- Only block role changes made by an authenticated non-admin user. Server-side
  -- contexts with no user (seed, migrations, service role) have auth.uid() = null.
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.authorize('users:manage') then
    raise exception 'Apenas administradores podem alterar o papel.'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger guard_profile_role
  before update on profiles
  for each row execute function public.guard_profile_role();
