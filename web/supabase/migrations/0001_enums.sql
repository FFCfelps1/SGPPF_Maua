-- Enums (RBAC vocabulary + domain statuses/types).
-- Enum values are append-only in Postgres; confirm sets before shipping to prod.

-- RBAC: roles and capability permissions (resource:action). 'coordinator' added in v1.1.
create type app_role as enum ('admin', 'researcher', 'consultant');

create type app_permission as enum (
  'researchers:read', 'researchers:write', 'researchers:delete',
  'projects:read',     'projects:write',    'projects:delete',
  'publications:read', 'publications:write', 'publications:delete',
  'advisings:read',    'advisings:write',   'advisings:delete',
  'funding:read',      'funding:write',     'funding:delete',
  'users:manage'
);

-- Domain statuses / types.
create type project_status   as enum ('planned', 'in_progress', 'completed', 'cancelled');
create type advising_status  as enum ('in_progress', 'completed', 'cancelled');
create type advising_level   as enum ('scientific_initiation', 'undergraduate_thesis', 'masters', 'doctorate', 'postdoc');
create type publication_type as enum ('article', 'conference_paper', 'book', 'book_chapter', 'technical_report', 'patent');
create type funding_status   as enum ('approved', 'in_execution', 'completed', 'cancelled');
