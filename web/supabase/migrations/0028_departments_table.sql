-- 0028_departments_table.sql

-- Add permissions
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'departments:read';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'departments:manage';

CREATE TABLE IF NOT EXISTS public.departments (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'departments_select' AND tablename = 'departments') THEN
    CREATE POLICY "departments_select" ON public.departments
      FOR SELECT TO authenticated
      USING (authorize('departments:read'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'departments_manage' AND tablename = 'departments') THEN
    CREATE POLICY "departments_manage" ON public.departments
      FOR ALL TO authenticated
      USING (authorize('departments:manage'));
  END IF;
END $$;

-- Permissions seeding
INSERT INTO role_permissions (role, permission)
VALUES 
  ('admin', 'departments:read'),
  ('admin', 'departments:manage'),
  ('dept_manager', 'departments:read'),
  ('dept_manager', 'departments:manage'),
  ('cp_manager', 'departments:read'),
  ('maua_manager', 'departments:read'),
  ('researcher', 'departments:read')
ON CONFLICT DO NOTHING;

-- Updated at trigger
DROP TRIGGER IF EXISTS on_departments_updated ON public.departments;
CREATE TRIGGER on_departments_updated
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.touch_timestamps();

-- Migrate existing data
INSERT INTO public.departments (name)
SELECT DISTINCT department FROM public.profiles WHERE department IS NOT NULL AND department <> ''
UNION
SELECT DISTINCT department FROM public.projects WHERE department IS NOT NULL AND department <> ''
UNION
SELECT DISTINCT department FROM public.project_submissions WHERE department IS NOT NULL AND department <> ''
ON CONFLICT (name) DO NOTHING;

-- Add department_id columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department_id BIGINT REFERENCES public.departments(id);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS department_id BIGINT REFERENCES public.departments(id);
ALTER TABLE public.project_submissions ADD COLUMN IF NOT EXISTS department_id BIGINT REFERENCES public.departments(id);

-- Fill department_id
UPDATE public.profiles p SET department_id = d.id FROM public.departments d WHERE p.department = d.name;
UPDATE public.projects p SET department_id = d.id FROM public.departments d WHERE p.department = d.name;
UPDATE public.project_submissions p SET department_id = d.id FROM public.departments d WHERE p.department = d.name;
