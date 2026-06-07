---
date: 2026-06-06
topic: sgppf-rebuild
---

# SGPPF Rebuild — Requirements

## Summary
Rebuild SGPPF — Instituto Mauá's research-management system — from scratch as a single SSR Next.js + Supabase
app. Same essence (researchers, projects, publications, advising, funding, dashboard) on a clean, minimal
architecture: a permission-driven CRUD core, RLS as the only security gate, English code with a Brazilian-Portuguese
UI. v1 ships three roles (Admin, Researcher, Consultant); the sector/coordinator layer is designed to drop in later.

## Problem Frame
Mauá's research data lives in spreadsheets, Lattes CVs, and funding-agency portals — strategic reporting and
institutional oversight are effectively impossible. A first system was vibe-coded (FastAPI + React) and is not
trustworthy: it enforces no authentication on any data endpoint, ships a hardcoded secret, drives live dashboard
screens from mock data, leaves create forms unwired, can't edit three of its entities, and tangles two auth
providers. The data model was AI-generated and poorly designed. The decision is a clean rebuild that keeps the
feature essence and discards the old implementation and the old schema entirely.

## Key Decisions

- **Permission-based RBAC, bounded.** Capability is modeled as `resource:action` permissions (e.g.,
  `projects:read`, `funding:write`), held as a Postgres enum. Roles are bundles of permissions defined by a
  `role_permissions` map **seeded in migrations** — not a runtime permissions-admin UI in v1. This is generic and
  scales to new roles/modules without policy-code churn, while staying minimal. (Revises the ideation blueprint's
  "hardcode 4 roles" position — see `origin: docs/ideation/2026-06-06-sgppf-rebuild-ideation.md`.)
- **RLS is the only security gate.** All enforcement lives in Supabase Row Level Security: a policy combines a
  capability check (`authorize('projects:write')`) with a row-scope predicate. The Custom Access Token Hook injects
  the user's role into the JWT; `authorize()` reads `role_permissions` in SQL. Server Actions re-check auth for
  defense-in-depth; the app layer only hides UI, never guards data.
- **Capability vs. row-scope are two layers.** Permissions gate *which resource+action*; a separate RLS predicate
  gates *which rows*. v1 row-scope: writes/deletes are self-scoped (`= auth.uid()` via the owning column); reads are
  open to any authenticated user (read-all). Sector-scoped reads arrive with the Coordenador in v1.1.
- **v1 = 3 roles; sector layer deferred to v1.1.** Admin, Researcher, Consultant ship in v1. Coordenador,
  `research_groups`, `group_memberships`, and sector-scoped finance are v1.1 — the permission foundation supports
  them as a pure add-later (seed row + tables + one predicate).
- **CRUD = shared primitives composed explicitly.** Shared `<DataTable>`, `<EntityForm>`, and one `action()` wrapper
  (auth + zod `safeParse` + typed errors + scoped revalidate); each entity supplies a zod schema + column config;
  each route's page and `_actions` wire them explicitly. No runtime/metadata code generator.
- **One app, no API layer.** Server Components read Supabase directly (PostgREST nested selects replace ORM/joins);
  Server Actions write. No `/api`, no services/axios, no client data-fetching library, no global store. View state
  (filters/sort/pagination) lives in URL `searchParams`; session lives in cookies via one `middleware.ts`.
- **From-scratch data model, English + snake_case.** Entities: `profiles` (1—1 `auth.users`, merges old
  usuario+pesquisador), `projects`, `publications`, `advisings`, `funding`, plus `publication_authors`. Postgres
  enums for every status/type. Money is `numeric` with a generated `pending_amount`; unique natural keys on
  `email`/`orcid`/`doi`/`code`. v1.1 adds `research_groups`, `group_memberships`, `project_members`,
  `project_publications`, `audit_log`. (Full model carried in the plan.)
- **DOI import is the primary publication-entry path.** Paste a DOI → a Server Action fetches metadata (Crossref) →
  the researcher confirms and claims authorship; manual entry is the fallback. Unique `doi` makes re-imports dedupe.
- **Dashboards and reports read SQL views.** KPIs/aggregations are RLS-respecting Postgres views/RPC, read once via
  cached Server Components. Reports are filtered list views (URL params) + CSV export — not a separate module in v1.
- **Auth: Microsoft (Azure) SSO only**, restricted to Mauá-domain emails; Google dropped. First admin bootstrapped
  via a manually-created Supabase user. A `handle_new_user()` trigger JIT-provisions the `profiles` row on first login.
- **No mock data, ever.** Every screen is a real query with a designed pt-BR empty state.
- **Stack (fixed):** Next.js (latest, App Router, RSC, SSR) · bun · Supabase (Postgres+Auth+RLS+Storage) · Tailwind
  + shadcn/ui (base-ui variant) · @t3-oss/env-nextjs + zod · route-colocated `_components`/`_actions`, all-lowercase
  files · English code, pt-BR UI copy via a labels map · minimalist UI · TanStack Table skipped in v1 (server-driven tables).

## Actors
- A1. **Administrador** — full capability across all resources; manages users and (v1.1) groups; emits reports.
- A2. **Pesquisador (Researcher)** — self-service CRUD on own projects/publications/advisings/funding; reads all.
  The primary data-entry actor — the system is only as good as what researchers enter.
- A3. **Consultor (Consultant)** — read-only across authorized data.
- A4. **Coordenador de Setor** — *v1.1.* Monitors/manages their sector's researchers and reads institutional indicators.

## Key Flows
- F1. **Sign-in & provisioning.** User clicks "Entrar com Microsoft" → Azure SSO (Mauá domain only) → on first login
  `handle_new_user()` creates the `profiles` row (role `researcher` by default) → session cookie set by middleware.
- F2. **Permission-gated CRUD.** Authenticated user opens a resource list (read-all) → creates/edits via an
  `<EntityForm>` bound to a Server Action → the `action()` wrapper validates (zod) and runs the mutation → RLS
  enforces capability (`authorize('<resource>:write')`) + row-scope (self for researchers) → list revalidates.
- F3. **DOI import.** Researcher pastes a DOI → Server Action calls Crossref → returns metadata for confirmation →
  on save, upsert by unique `doi`; researcher is linked as an author. Manual entry is the fallback path.
- F4. **Dashboard.** SSR page reads KPI views (counts/sums) once, cached; renders pt-BR empty states when zero.
- F5. **Export.** Any filtered list (filters in URL params) offers "Exportar CSV" of the current filtered view.

## Requirements

### Platform & foundation
- R1. The app is a single Next.js (latest) App Router project run with bun, SSR-first, with route-colocated
  `_components/` and `_actions/` and all-lowercase file names.
- R2. Environment variables are validated at build via `@t3-oss/env-nextjs` + zod (client/server split); a missing
  or malformed var fails the build.
- R3. UI uses Tailwind + shadcn/ui (base-ui variant); the component style is chosen at init and not changed later.
- R4. All code identifiers are English/snake_case (DB) or English (TS); all user-facing copy is Brazilian
  Portuguese, sourced from a labels map (no hardcoded UI strings in components).
- R5. No mock/seed data appears on any live screen; every screen renders from a real query with a pt-BR empty state.

### Auth & access control
- R6. Authentication is Microsoft (Azure) SSO via Supabase, restricted to Mauá-domain emails; no Google, no
  email/password sign-up flow. An admin may be bootstrapped via a manually-created Supabase user.
- R7. First successful login provisions a `profiles` row (default role `researcher`) via a database trigger.
- R8. Capability is enforced by `resource:action` permissions; a `role_permissions` map (seeded in migrations) binds
  roles to permissions; the user's role is injected into the JWT and read by an `authorize(permission)` SQL function.
- R9. Every data table has RLS policies that combine `authorize('<resource>:<action>')` with a row-scope predicate.
  v1 row-scope: any authenticated user reads all rows; create/update/delete are restricted to the owning user
  (researcher self-scope) or unrestricted (admin) per the role's permissions.
- R10. Server Actions re-verify authentication (`getClaims()`); the app layer uses permissions only to show/hide UI,
  never as the security boundary. Forbidden deep-links redirect rather than erroring.

### Data model
- R11. The schema is created from scratch (the old `requisitos` field design is discarded), English/snake_case, with
  Postgres enums for every status/type, `created_at`/`updated_at` on every table (auto-maintained), monetary values
  as `numeric` with a generated `pending_amount`, and unique natural keys on `email`/`orcid`/`doi`/`code`.
- R12. `profiles.id` equals `auth.users.id` (one identity row; old `usuario`/`pesquisador` split is gone).
- R13. v1 entities: `profiles`, `projects`, `publications`, `publication_authors`, `advisings`, `funding`. Schema
  changes ship as Supabase migrations with one idempotent real seed (`bun db:reset`); TypeScript types are generated
  from the database, and zod schemas derive from those types (single source of truth).

### CRUD core
- R14. A shared CRUD layer provides `<DataTable>`, `<EntityForm>`, and one `action()` wrapper that applies
  authentication, zod `safeParse`, typed `{errors}` returns (never throws across the boundary), and scoped
  revalidation. Each entity supplies a zod schema + column config; routes compose the primitives explicitly.
- R15. Every entity supports full create/read/update/delete (no missing-edit gaps); one zod schema validates both
  client form and server action.
- R16. Lists are server-paginated, -sorted, and -filtered via URL `searchParams` and SQL (no client-side table
  library in v1); each list has search where useful.

### Publications & DOI import
- R17. The primary "nova publicação" path accepts a DOI, fetches metadata via a Server Action (Crossref), and
  presents it for confirmation before save; manual entry is the fallback.
- R18. Publications dedupe on unique `doi`; importing an existing DOI updates rather than duplicates. A researcher
  can claim authorship (author position, corresponding flag) on a publication.

### Dashboard & reports
- R19. Dashboard KPIs (totals/recent counts/sums) are computed by RLS-respecting Postgres views/RPC and read once
  per page via cached Server Components; zero-states render honest pt-BR empty messages.
- R20. Reports in v1 are filtered list views plus a "Exportar CSV" action over the current filtered set; no separate
  reports module, no PDF/scheduled reports in v1.

### Information architecture
- R21. Navigation is permission-scoped: a user sees only nav items for resources they can read. Top-level routes:
  Dashboard, Researchers, Projects (Funding as a tab within a project), Publications, Advisings, Admin.
- R22. Funding is managed inline on a project (not a top-level screen); funding has no existence independent of a project.

## Acceptance Examples
- AE1. **Covers R9.** Given a Researcher authenticated, when they edit a project they do not lead, then the write is
  rejected by RLS (not merely hidden in the UI).
- AE2. **Covers R9.** Given a Researcher, when they open the Projects list, then they see all projects (read-all),
  but "Editar"/"Excluir" act only on their own.
- AE3. **Covers R8, R10.** Given a Consultant, when they call any write action directly, then RLS denies it because
  the consultant role has no `:write` permission.
- AE4. **Covers R18.** Given a publication with DOI `10.x/y` already exists, when a researcher imports the same DOI,
  then the existing row is updated and no duplicate is created.
- AE5. **Covers R6, R7.** Given a first-time Mauá user signs in with Microsoft, when login succeeds, then a
  `profiles` row is created with role `researcher` and they land authenticated; a non-Mauá email is refused.
- AE6. **Covers R5, R19.** Given an empty database, when the dashboard loads, then KPIs render `0`/empty states with
  no mock data and no error.

## Scope Boundaries

### Deferred for later (v1.1+)
- Coordenador de Setor role, `research_groups`, `group_memberships`, and sector-scoped reads/finance.
- `project_members` (project teams), `project_publications` (project↔publication links), `audit_log`.
- Full Relatórios module: PDF export, scheduled/periodic reports, report builder.
- Promotion of `employment_type` (vínculo) and project `modality` from free text to enums (pending Mauá's value lists).

### Outside this product's identity / not now
- The old `requisitos` prescriptions: layered-architecture formalism, Power Apps alternative, K8s/observability/
  CI-governance theater, the old DB field design — all discarded.
- Supabase Realtime and file attachments/Storage (no v1 need).
- Future evolutions named in requirements but explicitly out of scope: mobile app, Power BI, Teams integration,
  AI productivity analysis, automated agency-report generation, editais integration.

## Dependencies / Assumptions
- A Supabase project (Postgres + Auth) and an Azure AD app registration for Microsoft SSO, restricted to Mauá's email domain.
- Crossref REST API for DOI metadata (no auth; rate-limited). Qualis rating is not available via Crossref — entered manually or sourced separately.
- Modest scale (one institution: ~hundreds of researchers, low thousands of publications over years); server-side pagination is precautionary, not load-driven.
- "Read-all" is the intended v1 visibility: any authenticated user may read every researcher's records (institutional transparency); only writes are self-scoped. Cheap to tighten later if wrong.

## Outstanding Questions

### Deferred to planning
- Exact Postgres enum value sets for `project_status`, `advising_level`, `publication_type`, `funding_status`,
  `app_permission`, and `app_role` (starter values proposed in the plan; confirm against Mauá usage).
- Whether `employment_type`/`modality` ship as starter enums or free text in v1 (default: free text until Mauá provides lists).
- CSV export mechanism (server-streamed vs. client-built) — settle during planning.

## Sources / Research
- `origin: docs/ideation/2026-06-06-sgppf-rebuild-ideation.md` — the ranked rebuild blueprint and from-scratch data model.
- Existing codebase (`back/`, `front/`) — feature/essence extraction; explicitly not a pattern to follow.
- Stack best-practices gathered during ideation: @supabase/ssr SSR auth (use `getClaims()`, 3-file client setup,
  cache-header pitfall), Supabase RBAC via custom access token hook + `authorize()`, Server Actions (`useActionState`,
  shared zod), shadcn base-ui init, t3-env setup, Next.js caching (`use cache`/`cacheTag`).
