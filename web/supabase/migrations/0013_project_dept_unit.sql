-- Add department and unit to projects table for categorization and charting.
alter table projects
  add column if not exists department text,
  add column if not exists unit       text;
