-- Dashboard KPIs as a single RLS-respecting view. security_invoker = true so the
-- aggregates run under the caller's RLS (counts reflect what the user may read).
create view dashboard_kpis with (security_invoker = true) as
select
  (select count(*) from publications) as total_publications,
  (select count(*) from publications
     where year >= extract(year from now())::int - 2) as recent_publications,
  (select count(*) from advisings) as total_advisings,
  (select count(*) from advisings where status = 'completed') as completed_advisings,
  (select count(distinct p.id)
     from projects p join funding f on f.project_id = p.id
     where p.status = 'in_progress') as active_funded_projects,
  (select coalesce(sum(received_amount), 0) from funding) as funds_received;

grant select on dashboard_kpis to authenticated;
