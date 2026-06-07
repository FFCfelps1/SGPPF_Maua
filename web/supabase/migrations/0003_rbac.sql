-- Permission-based RBAC. role_permissions is seeded reference data (all environments).
-- Capability is gated by authorize() in RLS (U7+); row-scope is a separate predicate.

create table role_permissions (
  role       app_role not null,
  permission app_permission not null,
  primary key (role, permission)
);

-- v1 permission map.
-- admin: every permission + users:manage.
insert into role_permissions (role, permission)
select 'admin'::app_role, p from unnest(enum_range(null::app_permission)) as p
on conflict do nothing;

-- researcher: read everything; write/delete the resources they own (row-scope via RLS).
-- (Profile deletion is admin-only via users:manage, so no researchers:delete.)
insert into role_permissions (role, permission) values
  ('researcher', 'researchers:read'), ('researcher', 'researchers:write'),
  ('researcher', 'projects:read'),    ('researcher', 'projects:write'),    ('researcher', 'projects:delete'),
  ('researcher', 'publications:read'),('researcher', 'publications:write'),('researcher', 'publications:delete'),
  ('researcher', 'advisings:read'),   ('researcher', 'advisings:write'),   ('researcher', 'advisings:delete'),
  ('researcher', 'funding:read'),     ('researcher', 'funding:write'),     ('researcher', 'funding:delete')
on conflict do nothing;

-- consultant: read-only on all resources.
insert into role_permissions (role, permission) values
  ('consultant', 'researchers:read'), ('consultant', 'projects:read'),
  ('consultant', 'publications:read'),('consultant', 'advisings:read'),
  ('consultant', 'funding:read')
on conflict do nothing;

-- Capability check used by RLS policies. SECURITY DEFINER so it reads role_permissions
-- regardless of that table's RLS. search_path pinned for safety.
create or replace function authorize(requested_permission app_permission)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.role_permissions
    where permission = requested_permission
      and role = (auth.jwt() ->> 'user_role')::public.app_role
  );
$$;

-- The current user's permission set, for app nav/UI. SECURITY DEFINER so the app
-- can read it without direct access to role_permissions (which stays deny-all).
create or replace function my_permissions()
returns setof app_permission
language sql stable security definer set search_path = ''
as $$
  select permission from public.role_permissions
  where role = (auth.jwt() ->> 'user_role')::public.app_role;
$$;

-- Custom Access Token Hook: inject the user's app_role into the JWT as `user_role`.
create or replace function custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql stable
as $$
declare
  claims jsonb;
  v_role public.app_role;
begin
  select role into v_role from public.profiles where id = (event ->> 'user_id')::uuid;
  claims := event -> 'claims';
  if v_role is not null then
    claims := jsonb_set(claims, '{user_role}', to_jsonb(v_role));
  else
    claims := jsonb_set(claims, '{user_role}', 'null'::jsonb);
  end if;
  return jsonb_set(event, '{claims}', claims);
end;
$$;

-- Grants.
grant execute on function authorize(app_permission) to authenticated, anon;
grant execute on function my_permissions() to authenticated;

-- The auth admin runs the access-token hook and must read profiles for the role.
grant usage on schema public to supabase_auth_admin;
grant execute on function custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function custom_access_token_hook(jsonb) from authenticated, anon, public;
grant select on table profiles to supabase_auth_admin;
