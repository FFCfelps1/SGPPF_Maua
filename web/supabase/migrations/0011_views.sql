-- Dashboard KPIs as an RLS-respecting function. security_invoker = true so the
-- aggregates run under the caller's RLS. Accepts an optional department filter.
-- These columns are required by the function below. Later migrations add the
-- remaining profile/project metadata and keep these declarations idempotent.
alter table public.profiles
  add column if not exists department text;

alter table public.projects
  add column if not exists department text;

create or replace function get_dashboard_stats(p_department text default null)
returns table (
  total_publications bigint,
  recent_publications bigint,
  total_advisings bigint,
  completed_advisings bigint,
  active_funded_projects bigint,
  funds_received numeric,
  projects_by_dept jsonb,
  researchers_by_dept jsonb,
  publications_by_dept jsonb,
  advisings_by_dept jsonb
)
language sql stable security invoker set search_path = ''
as $$
select
  (select count(distinct p.id) 
     from public.publications p
     left join public.publication_authors pa on pa.publication_id = p.id
     left join public.profiles prof on prof.id = pa.profile_id
     where (p_department is null or prof.department = p_department)) as total_publications,
  
  (select count(distinct p.id) 
     from public.publications p
     left join public.publication_authors pa on pa.publication_id = p.id
     left join public.profiles prof on prof.id = pa.profile_id
     where (p_department is null or prof.department = p_department)
       and p.year >= extract(year from now())::int - 2) as recent_publications,
  
  (select count(*) 
     from public.advisings a
     left join public.profiles prof on prof.id = a.advisor_id
     where (p_department is null or prof.department = p_department)) as total_advisings,
  
  (select count(*) 
     from public.advisings a
     left join public.profiles prof on prof.id = a.advisor_id
     where (p_department is null or prof.department = p_department)
       and a.status = 'completed') as completed_advisings,
  
  (select count(distinct p.id)
     from public.projects p 
     join public.funding f on f.project_id = p.id
     where p.status = 'in_progress'
       and (p_department is null or p.department = p_department)) as active_funded_projects,
  
  (select coalesce(sum(f.received_amount), 0) 
     from public.funding f
     join public.projects p on p.id = f.project_id
     where (p_department is null or p.department = p_department)) as funds_received,

  (select coalesce(jsonb_agg(t), '[]'::jsonb) from (
     select coalesce(department, 'Indefinido') as label, count(*) as value
     from public.projects
     where (p_department is null or department = p_department)
     group by department
  ) t) as projects_by_dept,

  (select coalesce(jsonb_agg(t), '[]'::jsonb) from (
     select coalesce(department, 'Indefinido') as label, count(*) as value
     from public.profiles
     where (p_department is null or department = p_department)
     group by department
  ) t) as researchers_by_dept,

  (select coalesce(jsonb_agg(t), '[]'::jsonb) from (
     select coalesce(prof.department, 'Indefinido') as label, count(distinct p.id) as value
     from public.publications p
     left join public.publication_authors pa on pa.publication_id = p.id
     left join public.profiles prof on prof.id = pa.profile_id
     where (p_department is null or prof.department = p_department)
     group by prof.department
  ) t) as publications_by_dept,

  (select coalesce(jsonb_agg(t), '[]'::jsonb) from (
     select coalesce(prof.department, 'Indefinido') as label, count(*) as value
     from public.advisings a
     left join public.profiles prof on prof.id = a.advisor_id
     where (p_department is null or prof.department = p_department)
     group by prof.department
  ) t) as advisings_by_dept;
$$;

grant execute on function get_dashboard_stats(text) to authenticated;

