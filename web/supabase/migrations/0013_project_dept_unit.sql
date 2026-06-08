-- Add department and unit to projects table for categorization and charting.
alter table projects
  add column department text,
  add column unit       text;
