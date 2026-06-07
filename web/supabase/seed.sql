-- Local/dev seed. Idempotent (fixed UUIDs + on conflict). Never run against prod.
-- Demo password for all users: "password123".
-- role_permissions seeding is added in 0003 (U4); demo domain rows live here.

-- 1. Demo auth users (email/password) + email identities so they can sign in.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-0000000000a1',
   'authenticated', 'authenticated', 'admin@maua.br', crypt('password123', gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Administradora Mauá"}',
   '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-0000000000a2',
   'authenticated', 'authenticated', 'pesquisador@maua.br', crypt('password123', gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Pesquisador Exemplo"}',
   '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-0000000000a3',
   'authenticated', 'authenticated', 'consultor@maua.br', crypt('password123', gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Consultor Exemplo"}',
   '', '', '', '')
on conflict (id) do nothing;

insert into auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
values
  (gen_random_uuid(), '00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a1',
   '{"sub":"00000000-0000-0000-0000-0000000000a1","email":"admin@maua.br","email_verified":true}', 'email', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-0000000000a2',
   '{"sub":"00000000-0000-0000-0000-0000000000a2","email":"pesquisador@maua.br","email_verified":true}', 'email', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-0000000000a3', '00000000-0000-0000-0000-0000000000a3',
   '{"sub":"00000000-0000-0000-0000-0000000000a3","email":"consultor@maua.br","email_verified":true}', 'email', now(), now())
on conflict (provider_id, provider) do nothing;

-- 2. Profiles (on conflict do update so the future handle_new_user trigger doesn't override roles).
insert into profiles (id, full_name, email, role, position, area_of_expertise, is_active)
values
  ('00000000-0000-0000-0000-0000000000a1', 'Administradora Mauá', 'admin@maua.br', 'admin', 'Coordenação', 'Gestão', true),
  ('00000000-0000-0000-0000-0000000000a2', 'Pesquisador Exemplo', 'pesquisador@maua.br', 'researcher', 'Professor', 'Engenharia de Computação', true),
  ('00000000-0000-0000-0000-0000000000a3', 'Consultor Exemplo', 'consultor@maua.br', 'consultant', 'Consultor', 'Externo', true)
on conflict (id) do update
  set full_name = excluded.full_name, role = excluded.role, position = excluded.position,
      area_of_expertise = excluded.area_of_expertise, is_active = excluded.is_active;

-- 3. Sample domain data led/authored by the researcher.
insert into projects (id, title, code, modality, status, lead_id, start_date)
overriding system value
values (1, 'Projeto de Pesquisa Exemplo', 'PRJ-0001', 'Pesquisa', 'in_progress',
        '00000000-0000-0000-0000-0000000000a2', date '2025-01-15')
on conflict (id) do nothing;

insert into publications (id, title, doi, type, year, venue, qualis, authors_text)
overriding system value
values (1, 'Um Artigo de Exemplo sobre IA', '10.1000/exemplo.2025', 'article', 2025,
        'Revista de Computação', 'A2', 'Pesquisador Exemplo et al.')
on conflict (id) do nothing;

insert into publication_authors (publication_id, profile_id, author_position, is_corresponding)
values (1, '00000000-0000-0000-0000-0000000000a2', 1, true)
on conflict (publication_id, profile_id) do nothing;

insert into funding (id, project_id, agency, modality, approved_amount, received_amount, status, start_date)
overriding system value
values (1, 1, 'FAPESP', 'Auxílio à Pesquisa', 100000.00, 40000.00, 'in_execution', date '2025-02-01')
on conflict (id) do nothing;

insert into advisings (id, student_name, level, work_title, status, advisor_id, project_id, start_date)
overriding system value
values (1, 'Aluno Exemplo', 'masters', 'Dissertação de Exemplo', 'in_progress',
        '00000000-0000-0000-0000-0000000000a2', 1, date '2025-03-01')
on conflict (id) do nothing;

-- Keep identity sequences ahead of the explicit ids inserted above.
select setval(pg_get_serial_sequence('projects', 'id'), greatest((select max(id) from projects), 1));
select setval(pg_get_serial_sequence('publications', 'id'), greatest((select max(id) from publications), 1));
select setval(pg_get_serial_sequence('funding', 'id'), greatest((select max(id) from funding), 1));
select setval(pg_get_serial_sequence('advisings', 'id'), greatest((select max(id) from advisings), 1));
