-- Additional fields requested by the user for Researchers and Projects.

-- Researchers (profiles) extensions.
alter table profiles
  add column if not exists department        text,
  add column if not exists unit              text,
  add column if not exists research_gate_id  text;

-- Projects extensions: Team members (Equipe envolvida) and description.
alter table projects
  add column if not exists description text;

create table project_members (
  id          bigint generated always as identity primary key,
  project_id  bigint not null references projects (id) on delete cascade,
  profile_id  uuid not null references profiles (id) on delete cascade,
  role        text, -- e.g. 'Coordenador', 'Pesquisador', 'Bolsista'
  created_at  timestamptz not null default now(),
  unique (project_id, profile_id)
);
create index project_members_project_id_idx on project_members (project_id);
create index project_members_profile_id_idx on project_members (profile_id);

-- RLS for project_members.
alter table project_members enable row level security;

create policy "project_members_select" on project_members
  for select to authenticated using (authorize('projects:read'));

create policy "project_members_insert" on project_members
  for insert to authenticated
  with check (authorize('projects:write'));

create policy "project_members_delete" on project_members
  for delete to authenticated
  using (authorize('projects:delete'));

-- Add comment for types.
comment on table project_members is 'Associa pesquisadores a projetos (Equipe envolvida).';
