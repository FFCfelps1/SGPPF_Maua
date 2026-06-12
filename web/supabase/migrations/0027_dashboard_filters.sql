-- Combined dashboard filters. The function remains security invoker so every
-- aggregate respects the caller's row-level security policies.
create or replace function get_dashboard_stats_filtered(
  p_department text default null,
  p_researcher uuid default null,
  p_start_year integer default null,
  p_end_year integer default null,
  p_min_money numeric default null,
  p_max_money numeric default null
)
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
  advisings_by_dept jsonb,
  submissions_by_status jsonb,
  hours_by_type jsonb,
  project_dedication_by_dept jsonb
)
language sql stable security invoker set search_path = ''
as $$
with project_funding as (
  select
    p.id,
    p.department,
    p.status,
    p.lead_id,
    p.start_date,
    p.end_date,
    coalesce(sum(f.received_amount), 0) as received_amount,
    count(f.id) as funding_count
  from public.projects p
  left join public.funding f on f.project_id = p.id
  group by p.id
),
filtered_projects as (
  select p.*
  from project_funding p
  where (p_department is null or p.department = p_department)
    and (
      p_researcher is null
      or p.lead_id = p_researcher
      or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.profile_id = p_researcher
      )
    )
    and (p_start_year is null or extract(year from coalesce(p.end_date, p.start_date, current_date)) >= p_start_year)
    and (p_end_year is null or extract(year from coalesce(p.start_date, p.end_date, current_date)) <= p_end_year)
    and ((p_min_money is null and p_max_money is null) or p.funding_count > 0)
    and (p_min_money is null or p.received_amount >= p_min_money)
    and (p_max_money is null or p.received_amount <= p_max_money)
),
filtered_publications as (
  select p.*
  from public.publications p
  where (p_start_year is null or p.year >= p_start_year)
    and (p_end_year is null or p.year <= p_end_year)
    and (
      (p_department is null and p_researcher is null)
      or exists (
        select 1
        from public.publication_authors pa
        join public.profiles prof on prof.id = pa.profile_id
        where pa.publication_id = p.id
          and (p_department is null or prof.department = p_department)
          and (p_researcher is null or prof.id = p_researcher)
      )
    )
),
filtered_advisings as (
  select a.*
  from public.advisings a
  join public.profiles advisor on advisor.id = a.advisor_id
  where (p_department is null or advisor.department = p_department)
    and (p_researcher is null or a.advisor_id = p_researcher or a.co_advisor_id = p_researcher)
    and (p_start_year is null or extract(year from coalesce(a.end_date, a.start_date, current_date)) >= p_start_year)
    and (p_end_year is null or extract(year from coalesce(a.start_date, a.end_date, current_date)) <= p_end_year)
),
filtered_submissions as (
  select s.*
  from public.project_submissions s
  where (p_department is null or s.department = p_department)
    and (
      p_researcher is null
      or s.researcher_id = p_researcher
      or exists (
        select 1 from public.submission_members sm
        where sm.submission_id = s.id and sm.profile_id = p_researcher
      )
    )
    and (p_start_year is null or extract(year from s.created_at) >= p_start_year)
    and (p_end_year is null or extract(year from s.created_at) <= p_end_year)
    and (p_min_money is null or s.estimated_budget >= p_min_money)
    and (p_max_money is null or s.estimated_budget <= p_max_money)
),
filtered_profiles as (
  select * from public.profiles
  where (p_department is null or department = p_department)
    and (p_researcher is null or id = p_researcher)
)
select
  (select count(*) from filtered_publications),
  (select count(*) from filtered_publications where year >= extract(year from current_date)::integer - 2),
  (select count(*) from filtered_advisings),
  (select count(*) from filtered_advisings where status = 'completed'),
  (select count(*) from filtered_projects where status = 'in_progress' and funding_count > 0),
  (select coalesce(sum(received_amount), 0) from filtered_projects),
  (select coalesce(jsonb_agg(t order by t.label), '[]'::jsonb) from (
    select coalesce(department, 'Indefinido') as label, count(*) as value
    from filtered_projects group by department
  ) t),
  (select coalesce(jsonb_agg(t order by t.label), '[]'::jsonb) from (
    select coalesce(department, 'Indefinido') as label, count(*) as value
    from filtered_profiles
    group by department
  ) t),
  (select coalesce(jsonb_agg(t order by t.label), '[]'::jsonb) from (
    select coalesce(prof.department, 'Indefinido') as label, count(distinct p.id) as value
    from filtered_publications p
    join public.publication_authors pa on pa.publication_id = p.id
    join public.profiles prof on prof.id = pa.profile_id
    where (p_department is null or prof.department = p_department)
      and (p_researcher is null or prof.id = p_researcher)
    group by prof.department
  ) t),
  (select coalesce(jsonb_agg(t order by t.label), '[]'::jsonb) from (
    select coalesce(prof.department, 'Indefinido') as label, count(*) as value
    from filtered_advisings a
    join public.profiles prof on prof.id = a.advisor_id
    group by prof.department
  ) t),
  (select coalesce(jsonb_agg(t order by t.label), '[]'::jsonb) from (
    select status::text as label, count(*) as value
    from filtered_submissions group by status
  ) t),
  (select jsonb_build_array(
    jsonb_build_object('label', 'Pesquisa', 'value', coalesce(sum(research_hours), 0)),
    jsonb_build_object('label', 'Ensino', 'value', coalesce(sum(teaching_hours), 0)),
    jsonb_build_object('label', 'Outros', 'value', coalesce(sum(other_hours), 0))
  ) from filtered_profiles),
  (select coalesce(jsonb_agg(t order by t.label), '[]'::jsonb) from (
    select coalesce(p.department, 'Indefinido') as label, sum(pm.dedication_hours) as value
    from filtered_projects p
    join public.project_members pm on pm.project_id = p.id
    group by p.department
  ) t);
$$;

grant execute on function get_dashboard_stats_filtered(text, uuid, integer, integer, numeric, numeric) to authenticated;
