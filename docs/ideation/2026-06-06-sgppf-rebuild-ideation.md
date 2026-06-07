---
date: 2026-06-06
topic: sgppf-rebuild
focus: Rebuild SGPPF from scratch — keep the essence/features, shed the spaghetti, on a clean modern stack
mode: repo-grounded
---

# Ideation: SGPPF Clean Rebuild

SGPPF is a research-management system for **Instituto Mauá de Tecnologia (CEUN-IMT)** — it centralizes
researchers, research groups, projects, publications, funding, and academic advising ("orientações") that
today live in spreadsheets, Lattes CVs, and funding-agency portals. It is fundamentally an internal
**admin CRUD + dashboard/reporting app** in Brazilian Portuguese for a modest number of academic staff.

This document is the rebuild blueprint: the 7 load-bearing decisions, a from-scratch data model, the
conventions, and the simplifications. **It is the seed for `ce-brainstorm` → `ce-plan`.**

> The 7 decisions are not competing options — they compose into one rebuild.

## Hard constraints (decided)
- **Next.js latest, App Router, SSR-first**, React Server Components · **bun** runtime/PM.
- **Supabase** (Postgres + Auth + RLS + Storage) — lean on `auth.users`; no custom users table.
- **Tailwind + shadcn/ui (base-ui variant)** · **@t3-oss/env-nextjs + zod** for env.
- **Server Actions** for mutations · route-colocated **`_components/` + `_actions/` per route** · **all-lowercase files**.
- **Codebase + DB identifiers in English** (snake_case); **user-facing copy in pt-BR** via a labels map.
- UI: **minimalist, elegant** — "only what is needed." Code: **clean, simple, no spaghetti, no over-abstraction.**
- Must stay SGPPF (same domain/features). No scope-bloat, no subject-replacement.

## Grounding Context (codebase + requirements)
- **Old stack:** FastAPI + SQLAlchemy backend (`back/`) + React 19 + Vite + react-router frontend (`front/`),
  Azure MSAL + Google OAuth. Being replaced wholesale.
- **The `requisitos.pdf`/`.tex` requirements are themselves AI-generated and over-specified.** We take only the
  big-picture intent (essence + features + roles); the prescribed architecture, the Power Apps alternative, the
  K8s/observability/CI-governance theater, and **the entire DB field design are discarded.**
- **The old codebase's spaghetti** (what we are escaping): zero auth enforcement (JWT created but never verified),
  hardcoded secret in source, mock data driving live screens, forms built but never wired, missing PUT/update for
  3 entities, dual MSAL+Google auth tangle, no server-side filtering/pagination, inconsistent error handling,
  localStorage-based auth state, hardcoded `usuario_id: 1` and timestamps, a frontend-called `importByDoi`
  endpoint that doesn't exist.

### Essence — feature areas (kept) → roles
Dashboard (KPIs) · Researchers · Research groups · Projects · Publications · Advising · Funding · Reports · Admin.
Roles: **Administrador** (everything) · **Coordenador de Setor** (manage/monitor own sector, read institutional
indicators) · **Pesquisador** (self-service CRUD on own data — *the main data-entry channel*) · **Consultor** (read-only).

## Topic Axes
- A. Schema & data model
- B. Auth & access control
- C. CRUD architecture & code organization
- D. Information architecture & navigation
- E. Dashboards, reports & presentation

---

## Ranked Ideas

### 1. Schema-first: let Postgres carry correctness
**Description:** Model the domain so bad data is *unenterable* — Postgres enums for every status/type, real FKs +
CHECK constraints, unique natural keys (DOI/ORCID/email/code) enabling idempotent import, money as `numeric` with a
generated `pending_amount`. Schema lives in `supabase/migrations/` with one idempotent real seed (`bun db:reset`).
The full from-scratch data model is in **§ Data Model** below.
**Axis:** A
**Basis:** `direct:` old build's "statuses are free-text strings everywhere (no enums/constraints)", float money, decorative DOI/ORCID. `external:` accounting chart-of-accounts; library authority control (unique IDs).
**Rationale:** Free-text statuses silently break every KPI; pushing correctness into the DB makes the presentation layer dumb and trustworthy, cheaper than app-layer validation.
**Downsides:** Enum changes need migrations; slightly more upfront schema design.
**Confidence:** 95% · **Complexity:** Low–Medium · **Status:** Explored (model designed from scratch — § Data Model)

### 2. One identity, one org-structure: auth-linked profile + a real org unit
**Description:** Collapse old `usuario`+`pesquisador` into a single **`profiles`** row whose `id = auth.users.id`.
Introduce the missing org unit (**`research_groups`**, unifying "grupo de pesquisa" and "setor") with
**`group_memberships`** (`is_coordinator`). A `handle_new_user()` trigger JIT-provisions the profile from Microsoft
SSO metadata. This is the keystone that makes coordinator scoping and sector-level finance expressible.
**Axis:** A
**Basis:** `direct:` old "usuario (1—1 pesquisador)" + "no setores entity; department is a free-text string." `external:` Supabase recommends FK'ing the profile table to `auth.users.id`.
**Rationale:** "Coordenador de Setor" is meaningless without an org unit; one identity row removes a CRUD surface and the `usuario_id` drift class.
**Downsides:** Must seed the group/sector list up front; admins who aren't researchers still get a profile row (fine).
**Confidence:** 88% · **Complexity:** Medium · **Status:** Explored (§ Data Model)

### 3. RLS-first access control — the database is the only gate
**Description:** 100% enforcement in Supabase **RLS** keyed off a `role` JWT claim (Custom Access Token Hook reads
`profiles.role`) + group membership. Server Actions still call `getClaims()` for defense-in-depth; app-layer role
logic *only* hides UI. Self-scoping and coordinator scoping are reused RLS predicates, not per-query app code.
**Axis:** B
**Basis:** `direct:` old build's worst sin — "zero auth enforcement; JWT created but never verified." `external:` Supabase RBAC docs — "RLS-first is the clean enforcement layer; app-layer checks are additive."
**Rationale:** Makes "forgot the auth check in the action" structurally impossible; one enforcement layer can't drift from a second.
**Downsides:** Team must write/test RLS as primary security; JWT role-change staleness until next refresh (acceptable).
**OPEN DECISION (for brainstorm):** full `user_roles`+`role_permissions`+`authorize()` machinery **vs. 4 roles hardcoded directly in policies** (recommended — drops a table, a join, and a permissions-admin screen).
**Confidence:** 85% · **Complexity:** Medium · **Status:** Unexplored — fork open

### 4. A config-driven CRUD core + one typed `action()` wrapper
**Description:** One thin convention, not six hand-built stacks: a single zod schema + column config per entity feeds
a shared `<DataTable>`/`<EntityForm>` and create/update/delete helpers, colocated per route. Every mutation runs
through one `action()` wrapper that bakes in `getClaims()` + `safeParse` + typed `{errors}` + scoped `revalidatePath`
(and is the single place to write an `audit_log` row). The "missing PUT / unwired forms / 200-instead-of-404" bug
families become unexpressible.
**Axis:** C
**Basis:** `direct:` old "forms built but never wired", "missing PUT for 3 entities", "inconsistent error handling (200 instead of 404)." `external:` Rails/Django admin convention; Server Actions best practices (share one zod schema client+server; typed error returns).
**Rationale:** Update/filter/error-handling implemented once = every entity inherits them; per-entity bugs can't recur.
**Downsides:** The abstraction line is a judgment call.
**OPEN DECISION (for brainstorm):** lock the exact line — **shared components + per-entity config + thin colocated wrappers, explicitly NOT a runtime metadata-driven generator.** Define precisely what's shared vs hand-written per entity.
**Confidence:** 80% · **Complexity:** Medium · **Status:** Unexplored — abstraction line open

### 5. One aggregation layer: SQL views for KPIs, reports = filtered lists, zero mock
**Description:** Every dashboard KPI/report aggregation is an RLS-respecting Postgres **view/RPC**, read once via a
cached Server Component (`'use cache'` + `cacheTag`, `revalidateTag` on write); simple counts use
`select('*', { count: 'exact', head: true })`. **Reports are not a module** — they're entity lists with filters in
the URL `searchParams` + a shared "Exportar CSV/PDF" button (a report = a shareable URL). Lists/KPIs are
server-paginated/filtered by default. **No `mock*` module exists**; every screen has a designed pt-BR empty state.
**Axis:** E
**Basis:** `direct:` old #1 spaghetti "mock data drives live screens"; Relatórios was a placeholder; "no server-side filtering." `external:` Next 16 caching; issue-tracker saved-views pattern.
**Rationale:** One honest source feeds dashboard + reports + future BI/AI; the "dashboard says X, list says Y" drift and the never-finished report module both disappear.
**Downsides:** Logic moves into SQL; PDF export needs a small render path.
**Confidence:** 90% · **Complexity:** Medium · **Status:** Explored (refined — see § Simplifications)

### 6. DOI/BibTeX import as the *primary* publication-entry path
**Description:** Default "nova publicação" action = **paste a DOI → a Server Action fetches metadata (Crossref) →
researcher reviews & claims authorship.** The 12-field form collapses to one input + a confirm card; manual entry is
the fallback. Pairs with the unique-DOI key (#1) so re-imports dedupe. Finally builds the `importByDoi` the old UI faked.
**Axis:** C
**Basis:** `direct:` feature requires "import via DOI/Scholar/BibTeX"; faked `importByDoi`; "Pesquisador is the main data-entry channel — the system is only as good as what researchers enter." `external:` Crossref REST API (no auth) returns title/authors/venue/ISSN/year.
**Rationale:** Entry cost is the real constraint on data quality; cutting it from 12 fields to one paste is the highest-leverage move for keeping the DB populated and clean.
**Downsides:** External-API reliability/rate limits; Qualis isn't in Crossref (manual/separate source).
**Refinement:** done in a **Next.js Server Action, not a Supabase Edge Function** (one fewer runtime).
**Confidence:** 82% · **Complexity:** Medium · **Status:** Explored (refined)

### 7. Role-shaped IA + an honest build order
**Description:** Role-scoped nav (a Pesquisador/Consultor never sees "Administração"; forbidden deep-links redirect,
mirroring RLS). The Pesquisador — the main data-entry user — gets a minimal, **mobile-friendly "Minha produção"
quick-add** surface, not the full admin console. **Funding is a tab inside a Project**, not a top-level screen.
**Slim Admin** via Microsoft-SSO JIT auto-provisioning + env config (no runtime integration/permission screens).
**Build order:** Pesquisadores + Publicações + read-only Dashboard first (the minimal loop that yields real KPIs);
everything else ships as an honestly-labeled "em desenvolvimento" stub — **never a dead button.**
**Axis:** D
**Basis:** `direct:` 8 areas × 4 sharply-scoped roles; researcher is the main channel; funding is a child of project; Admin sprawl; Relatórios placeholder shows honest stubs are OK; old build had dead "Novo X" buttons.
**Rationale:** The non-admin majority gets a minimal relevant surface; one whole module (Funding) disappears with zero capability lost; a dependency-ordered build avoids "everything 80% done, nothing trustworthy."
**Downsides:** The role→screen matrix (esp. Coordenador) is a product call.
**OPEN DECISION (for brainstorm):** is the **Coordenador role in v1** (keep `research_groups`/memberships + its RLS) or post-v1 (defer the whole groups subsystem)?
**Confidence:** 85% · **Complexity:** Low–Medium · **Status:** Partially explored — v1 scope open

---

## Data Model (designed from scratch — English, snake_case)

Designed from the *feature essence*, NOT the requisitos columns. Leverages Supabase `auth.users`.

**Conventions:** plural tables · `is_*` booleans · PKs `bigint generated always as identity` for domain tables
(clean URLs) and `uuid` for `profiles` (= `auth.users.id`) · `created_at`/`updated_at timestamptz default now()`,
`updated_at` auto via `moddatetime` trigger · timestamps `_at`, calendar dates `*_date` · money `numeric(14,2)`,
never float · unique natural keys on `email`/`orcid`/`doi`/`code` · all statuses/types/levels are Postgres enums.

```sql
-- enums
create type app_role         as enum ('admin', 'coordinator', 'researcher', 'consultant');
create type project_status   as enum ('planned', 'in_progress', 'completed', 'cancelled');
create type advising_status  as enum ('in_progress', 'completed', 'cancelled');
create type advising_level   as enum ('scientific_initiation', 'undergraduate_thesis', 'masters', 'doctorate', 'postdoc');
create type publication_type as enum ('article', 'conference_paper', 'book', 'book_chapter', 'technical_report', 'patent');
create type funding_status   as enum ('approved', 'in_execution', 'completed', 'cancelled');

-- identity & organization
create table profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  full_name         text not null,
  email             text not null unique,           -- mirrored from auth on provisioning
  role              app_role not null default 'researcher',
  position          text,                            -- cargo
  area_of_expertise text,
  orcid             text unique,
  lattes_url        text,
  google_scholar_id text,
  employment_type   text,                            -- vínculo (→ enum once Mauá's values are known)
  affiliation_date  date,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table research_groups (                       -- = grupo de pesquisa / setor (unified)
  id          bigint generated always as identity primary key,
  name        text not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table group_memberships (
  id             bigint generated always as identity primary key,
  group_id       bigint not null references research_groups(id) on delete cascade,
  profile_id     uuid   not null references profiles(id)        on delete cascade,
  is_coordinator boolean not null default false,
  created_at     timestamptz not null default now(),
  unique (group_id, profile_id)
);

-- projects
create table projects (
  id                bigint generated always as identity primary key,
  title             text not null,
  code              text unique,
  modality          text,
  status            project_status not null default 'in_progress',
  lead_id           uuid   not null references profiles(id)       on delete restrict,
  research_group_id bigint references research_groups(id)         on delete set null,
  start_date        date,
  end_date          date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table project_members (                       -- DEFERRABLE to v1.1 (keep only lead_id in v1)
  id         bigint generated always as identity primary key,
  project_id bigint not null references projects(id) on delete cascade,
  profile_id uuid   not null references profiles(id) on delete cascade,
  role       text,
  unique (project_id, profile_id)
);

-- publications
create table publications (
  id             bigint generated always as identity primary key,
  title          text not null,
  doi            text unique,                         -- idempotent DOI import
  type           publication_type,
  year           smallint,
  venue          text,                                -- journal or event
  issn           text,
  url            text,
  qualis         text,
  impact_factor  numeric(6,3),
  citation_count integer,
  knowledge_area text,
  authors_text   text,                                -- full citation string (incl. external co-authors)
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table publication_authors (                    -- internal researchers' authorship
  id               bigint generated always as identity primary key,
  publication_id   bigint not null references publications(id) on delete cascade,
  profile_id       uuid   not null references profiles(id)     on delete cascade,
  author_position  smallint,
  is_corresponding boolean not null default false,
  unique (publication_id, profile_id)
);

create table project_publications (                   -- DEFERRABLE to v1.1
  project_id     bigint not null references projects(id)     on delete cascade,
  publication_id bigint not null references publications(id) on delete cascade,
  primary key (project_id, publication_id)
);

-- advising (orientações)
create table advisings (
  id                 bigint generated always as identity primary key,
  student_name       text not null,
  level              advising_level not null,
  work_title         text,
  status             advising_status not null default 'in_progress',
  advisor_id         uuid   not null references profiles(id) on delete restrict,
  co_advisor_id      uuid   references profiles(id)          on delete set null,
  project_id         bigint references projects(id)          on delete set null,  -- new link
  scholarship_agency text,
  start_date         date,
  end_date           date,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- funding (financiamentos) — contracts per project
create table funding (
  id              bigint generated always as identity primary key,
  project_id      bigint not null references projects(id) on delete cascade,
  agency          text not null,                       -- FAPESP, CNPq, CAPES, company, international
  modality        text,
  approved_amount numeric(14,2) not null default 0,
  received_amount numeric(14,2) not null default 0,
  pending_amount  numeric(14,2) generated always as (approved_amount - received_amount) stored,
  currency        text not null default 'BRL',
  status          funding_status not null default 'approved',
  start_date      date,
  end_date        date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- optional audit trail (written by the #4 action() wrapper) — DEFERRABLE to v1.1
create table audit_log (
  id         bigint generated always as identity primary key,
  actor_id   uuid references profiles(id) on delete set null,
  action     text not null,                            -- insert | update | delete
  entity     text not null,
  entity_id  text not null,
  diff       jsonb,
  created_at timestamptz not null default now()
);
```

**Relationships:** `auth.users 1—1 profiles` · `profiles N—N research_groups` (memberships, `is_coordinator`) ·
`profiles 1—N projects` (lead) + `N—N` (members) · `profiles N—N publications` (authors) ·
`profiles 1—N advisings` (advisor) + `0—N` (co-advisor) · `research_groups 1—N projects` (sector rollup) ·
`projects 1—N funding · N—N publications · 1—N advisings`.

**Locked schema design calls:** PK = bigint identity + uuid for profiles · unify grupo+setor → `research_groups` ·
coordinator via membership flag · external co-authors via `authors_text` + relational internal links ·
scholarship as text for v1 · `employment_type` text until Mauá's values known · `updated_at` via trigger.

## Simplifications (locked)
**A. One app, no API layer.** No `/api`, no services/axios, no React Query. Server Components read Supabase directly;
Server Actions write; `revalidatePath` refreshes. **PostgREST nested `select()` replaces the ORM + manual joins**
(one query returns the nested detail shape). **No auth context / no localStorage / no token-refresh** — session in
cookies via one `middleware.ts`, current user via `getClaims()`; login is one `signInWithOAuth({ provider: 'azure' })`.
**No global store** — URL `searchParams` hold view state; React state only for ephemeral UI.

**B. Supabase does the work.** `gen types` → zero hand-written DB types. KPIs via views/RPC + `count: 'exact'`.
DOI import in a Server Action (no Edge Function). **Skip Realtime.** Search via `ilike`/FTS (no search service).
Storage only if attachments appear (defer).

**C. Structure leanness.** **Skip TanStack Table for v1** — server-driven plain shadcn-styled tables (sort/filter/page
via searchParams + SQL); add TanStack later only where rich client interaction is truly needed. **CRUD via dedicated
routes or a simple `<Dialog>`, not parallel/intercepting routes.** One `(app)` route group behind one middleware,
`(auth)` for login; no per-page guards. `lib/` holds only cross-cutting (`supabase/{server,client,middleware}`,
`env.ts`, query helpers); promote colocated code to shared only at the 3rd use. **bun for everything**
(install/run/scripts/`bun:test`).

**D. v1 schema deferrals (without breaking the core loop):** defer `project_members` (keep `lead_id`),
`project_publications`, `audit_log`; `research_groups`/`group_memberships` included only if the Coordenador role is in v1.

**Resulting top-level routes (~6):** `/dashboard` · `/researchers` · `/projects` (funding as a tab) ·
`/publications` · `/advisings` · `/admin`. No backend, no API client, no store, no Edge Function.

## Open decisions → for `ce-brainstorm`
1. **RBAC shape (#3):** 4 roles hardcoded in RLS policies (rec.) vs. dynamic `role_permissions` machinery.
2. **CRUD abstraction line (#4):** exactly what's shared vs hand-written per entity (no runtime generator).
3. **TanStack vs server-driven tables (Simplification C):** confirm skip for v1.
4. **v1 schema scope (D):** which of `project_members` / `project_publications` / `audit_log` to defer.
5. **Coordenador role in v1?** (decides whether `research_groups`/memberships ship now) + the **role→screen matrix**
   (Coordenador edit scope; Consultor "authorized data" scope).
6. **`employment_type` (vínculo) categories** and **`modality` categories** — get Mauá's real value lists → promote to enums.
7. **Reports export** — PDF + CSV render path; which report views matter first.
8. **Auth:** Microsoft SSO only (Mauá-domain restriction) — drop the Google path entirely?

## Rejection Summary
| # | Idea | Reason |
|---|------|--------|
| R1 | Full event-sourcing (`*_events`, state-as-view) | Over-engineering vs minimalist mandate; a single `audit_log` row from #4's wrapper covers audit. |
| R2 | Dynamic `role_permissions` + `authorize()` table | Over-abstraction for 4 fixed roles; surfaced as the rejected pole of #3's fork. |
| R3 | "Schema-as-the-app" metadata-table CRUD generator | Crosses the over-abstraction line; the light convention (#4) gets the benefit without the framework. |
| R4 | Status-as-lane / kanban-board IA | Presentation flourish below the bar for a minimalist v1 — a filterable table already answers "what's open." Revisit later. |
| R5 | Seed + migration convention (standalone) | Folded into #1 — table-stakes for Supabase, not a debate-worthy decision on its own. |
| R6 | "No mock data" (standalone) | Folded into #5 as a build principle (empty-state-first). |
| R7 | `lotação` scope-level + self-scope owner predicate | Folded into #2/#3 (group membership + RLS predicate). |
| R8 | Supabase Edge Function for DOI import | Refined into #6 — a Next.js Server Action removes a whole runtime. |
| R9 | Old `requisitos` DB field design | Discarded entirely — badly designed; data model rebuilt from the feature essence. |
