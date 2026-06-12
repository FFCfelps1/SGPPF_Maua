-- Add researchers:create permission
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'researchers:create';
