-- Core domain tables. Created from scratch (the legacy field design is discarded).
-- English/snake_case; numeric money (never float); unique natural keys; check constraints.
-- updated_at maintenance + created_at immutability triggers live in 0006 (U5).

-- One row per app user; id == auth.users.id (merges legacy usuario + pesquisador).
create table profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  full_name         text not null,
  email             text not null unique,
  role              app_role not null default 'researcher', -- privilege-bearing; not self-writable (RLS+trigger, U7)
  position          text,
  area_of_expertise text,
  orcid             text unique,
  lattes_url        text,
  google_scholar_id text,
  employment_type   text,
  affiliation_date  date,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table projects (
  id                bigint generated always as identity primary key,
  title             text not null,
  code              text unique,
  modality          text,
  status            project_status not null default 'in_progress',
  lead_id           uuid not null references profiles (id) on delete restrict, -- blocks hard-delete of a lead
  start_date        date,
  end_date          date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint projects_dates_ck check (end_date is null or end_date >= start_date)
);
create index projects_lead_id_idx on projects (lead_id);

create table publications (
  id             bigint generated always as identity primary key,
  title          text not null,
  doi            text unique,                 -- idempotent DOI import dedupe
  type           publication_type,
  year           smallint,
  venue          text,
  issn           text,
  url            text,
  qualis         text,
  impact_factor  numeric(6, 3),
  citation_count integer,
  knowledge_area text,
  authors_text   text,                        -- full citation string incl. external co-authors
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table publication_authors (
  id               bigint generated always as identity primary key,
  publication_id   bigint not null references publications (id) on delete cascade,
  profile_id       uuid not null references profiles (id) on delete restrict, -- authorship history must not vanish
  author_position  smallint,
  is_corresponding boolean not null default false,
  unique (publication_id, profile_id),
  unique (publication_id, author_position)
);
create index publication_authors_profile_id_idx on publication_authors (profile_id);
-- At most one corresponding author per publication.
create unique index publication_one_corresponding_idx
  on publication_authors (publication_id) where is_corresponding;

create table advisings (
  id                 bigint generated always as identity primary key,
  student_name       text not null,
  level              advising_level not null,
  work_title         text,
  status             advising_status not null default 'in_progress',
  advisor_id         uuid not null references profiles (id) on delete restrict,
  co_advisor_id      uuid references profiles (id) on delete set null,
  project_id         bigint references projects (id) on delete set null,
  scholarship_agency text,
  start_date         date,
  end_date           date,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint advisings_dates_ck check (end_date is null or end_date >= start_date)
);
create index advisings_advisor_id_idx on advisings (advisor_id);
create index advisings_co_advisor_id_idx on advisings (co_advisor_id);
create index advisings_project_id_idx on advisings (project_id);

create table funding (
  id              bigint generated always as identity primary key,
  project_id      bigint not null references projects (id) on delete cascade,
  agency          text not null,
  modality        text,
  approved_amount numeric(14, 2) not null default 0 check (approved_amount >= 0),
  received_amount numeric(14, 2) not null default 0 check (received_amount >= 0),
  pending_amount  numeric(14, 2) generated always as (approved_amount - received_amount) stored,
  currency        text not null default 'BRL' check (currency = 'BRL'), -- single-currency v1
  status          funding_status not null default 'approved',
  start_date      date,
  end_date        date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint funding_dates_ck check (end_date is null or end_date >= start_date)
  -- over-receipt allowed; pending_amount may be negative by design
);
create index funding_project_id_idx on funding (project_id);
