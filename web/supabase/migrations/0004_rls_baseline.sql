-- Default-deny baseline: enable RLS on every table. With RLS on and no policy, all
-- access is denied until each entity unit adds its policies. SECURITY DEFINER functions
-- (authorize, my_permissions, handle_new_user) bypass RLS, so RBAC + provisioning still work.

alter table profiles            enable row level security;
alter table projects            enable row level security;
alter table publications        enable row level security;
alter table publication_authors enable row level security;
alter table advisings           enable row level security;
alter table funding             enable row level security;
alter table role_permissions    enable row level security;

-- The Custom Access Token Hook runs as supabase_auth_admin and must read profiles.role.
create policy "auth_admin_reads_profiles" on profiles
  for select to supabase_auth_admin using (true);
