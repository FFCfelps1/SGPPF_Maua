-- Part 1: Type extensions. 
-- These must be committed before they can be used in table definitions or RLS.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'dept_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'cp_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'maua_manager';

ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'submissions:read';
ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'submissions:write';
ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'submissions:approve';

CREATE TYPE public.submission_status AS ENUM (
  'draft',
  'submitted',
  'approved_dept',
  'approved_cp',
  'approved_maua',
  'rejected'
);
