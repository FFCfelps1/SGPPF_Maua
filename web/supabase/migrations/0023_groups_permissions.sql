-- Add groups:read and groups:manage permissions
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'groups:read';
ALTER TYPE app_permission ADD VALUE IF NOT EXISTS 'groups:manage';
