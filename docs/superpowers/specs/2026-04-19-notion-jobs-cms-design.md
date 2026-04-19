# Notion-backed Jobs CMS

**Date:** 2026-04-19
**Status:** Approved for implementation

## Goal

Let a non-technical editor (an outside friend sharing a single Notion page with the owner) add, edit, and archive job listings on keesamax.com without touching code. Changes appear on the live site within ~1 hour.

## Context

Today, job listings live in `data/jobs.ts` as a hardcoded TypeScript array. The file has a pre-existing comment noting the intent to migrate to Notion. The component `components/JobListings.tsx` is a client component that renders the array with category filters and a search box.

## Non-goals

- Per-job detail pages (every `JobCard` continues to link to `#contact`, unchanged).
- Webhook-based instant revalidation. ISR with a 1-hour revalidate window is sufficient.
- Pagination. The database will stay well under Notion's 100-row default page size.
- A full authenticated admin UI. Notion *is* the admin UI.

## Architecture

```
Notion (personal workspace, single shared page)
  └─ "Keesamax — Job Listings" page
       └─ Jobs database (rows = job postings)
               │
               │ (Notion API — internal integration token)
               ▼
Next.js server component `app/page.tsx`
  calls `getJobs()` from `lib/jobs.ts` once per request cycle
               │
               │ (jobs: Job[] as prop)
               ├──► <Hero jobs={jobs} />
               ├──► <JsonLd jobs={jobs} />
               └──► <JobListings jobs={jobs} />
                       │
                       │ (jobs prop)
                       ▼
                    <JobListingsClient jobs={jobs} />
                       renders filters, search, cards
                       (logic unchanged from today)
```

Rationale: `Hero`, `JsonLd`, and `JobListings` all read the jobs list today. Fetching once in `app/page.tsx` and passing as props keeps the data consistent across the three consumers and avoids triplicating Notion API calls.

Revalidation: `export const revalidate = 3600` on `app/page.tsx`. Next.js ISR serves the last successful build during Notion outages, so transient failures are invisible to end users.

## Notion schema

One top-level page in the owner's personal workspace titled **"Keesamax — Job Listings"**, containing a database with:

| Property | Type | Required | Notes |
|---|---|---|---|
| Title | Title (native) | yes | Job title, e.g. "Engineering Manager" |
| Industry | Rich text | yes | e.g. "Beverage Manufacturing" |
| Category | Select | yes | Options: Manufacturing, FMCG, Healthcare, Technology, Construction, Logistics, Finance, Other |
| Location | Rich text | yes | e.g. "Johor Bahru" |
| Experience | Rich text | yes | e.g. "10+ years" |
| Employment Type | Select | no | Options: Full-time, Part-time, Hybrid, Remote, Contract |
| Company Description | Rich text | no | Reserved for future use — not rendered today |
| Status | Select | yes | Options: Draft, Live, Archived — only `Live` rows render on site |

Sorting on site: Notion's native `Created time`, descending. No extra column needed.

The page body holds a short editor guide (how to add a row, what each field means, what Status values mean).

### Initial data migration

All 14 current jobs from `data/jobs.ts` are imported into the database with `Status = Live` during the dev-time scaffolding step.

## Next.js changes

### New dependency

- `@notionhq/client` (official Notion SDK)

### New env vars

- `NOTION_TOKEN` — secret from a Notion internal integration, granted access to the jobs database only. Set in `.env.local` and in Vercel project env.
- `NOTION_JOBS_DATABASE_ID` — UUID of the database. Set in the same places.

Both are server-only (never prefixed with `NEXT_PUBLIC_`).

### New file: `lib/jobs.ts`

Owns the `Job` and `JobCategory` types (moved out of `data/jobs.ts`) plus one async function:

```ts
export async function getJobs(): Promise<Job[]>
```

Behavior:
- Queries the Notion database filtered to `Status = Live`, sorted by `Created time` descending.
- Maps Notion properties → `Job` type.
- Uses Notion page ID as the `Job.id` (React key only; not surfaced in URLs).
- On API error: logs the error and returns `[]`. The existing empty-state UI in `JobListingsClient` covers the user-facing message.

### Page-level fetch and prop plumbing

`app/page.tsx` (already a server component) becomes the single fetch site:

```tsx
export const revalidate = 3600;

export default async function Home() {
  const jobs = await getJobs();
  // ...
  <Hero jobs={jobs} />
  <JsonLd jobs={jobs} />
  <JobListings jobs={jobs} />
}
```

### Component changes

- **`components/Hero.tsx`** — stops importing from `data/jobs`. Accepts `jobs: Job[]` prop. Uses `jobs.length` for the open-roles count (current behavior).
- **`components/JsonLd.tsx`** — stops importing from `data/jobs`. Accepts `jobs: Job[]` prop. Iterates over `jobs` to emit `JobPosting` structured data (current behavior).
- **`components/ui/JobCard.tsx`** — switches `import type { Job }` source from `@/data/jobs` to `@/lib/jobs`. No runtime change.
- **`components/JobListings.tsx`** — converted from client to server component. Accepts `jobs: Job[]` prop. Renders `<JobListingsClient jobs={jobs} />`. No `"use client"` directive.
- **`components/JobListingsClient.tsx`** (new) — the current client-side logic from `JobListings.tsx` moved here. Accepts `jobs: Job[]` as a prop. All filter / search / showAll state unchanged.

Server components cannot use `useState`, which is why `JobListings` must be split into server and client halves.

### Filter categories derived from data

Today, `jobCategories` is a hardcoded array of 5 of the 8 possible categories. After the migration, filter buttons are derived from the categories present in the fetched `Live` jobs. New categories added in Notion (as long as they match one of the 8 `JobCategory` options) appear as filter buttons automatically.

### Deletion

`data/jobs.ts` is removed once Notion is the source of truth. Current consumers (`components/JobListings.tsx`, `components/Hero.tsx`, `components/JsonLd.tsx`, `components/ui/JobCard.tsx`) are updated to import types from `@/lib/jobs` and receive runtime data via props.

## Error handling & fallback

- Notion API failure during build or revalidation → `getJobs()` returns `[]`. The `JobListingsClient` renders its existing empty state ("No roles match your filters. Try adjusting or get in touch…").
- Transient failures during revalidation → Next.js ISR continues to serve the last successful build. Users see the previous set of jobs; no error surface.
- Invalid/missing property values on a Notion row → that row is skipped (with a server log), remaining rows render normally. Editors get feedback by visiting the site and noticing a row is missing.
- Secrets never reach the client because the fetch happens in a server component.

## Security

- The Notion internal integration is granted access only to the jobs database page. Its token cannot read anything else in the owner's workspace.
- `NOTION_TOKEN` and `NOTION_JOBS_DATABASE_ID` are server-only. They never appear in client bundles.
- The outsider editor is a Notion guest on a single shared page. They cannot see the rest of the owner's personal workspace.

## Rollout

1. Scaffold Notion via MCP in this session: create page, database, schema, import 14 existing jobs as `Status = Live`.
2. Owner creates a Notion internal integration (notion.so/profile/integrations → New internal integration → copy token → grant it access to the jobs page via Connections). Paste token and database ID into `.env.local`.
3. Implement `lib/jobs.ts` + local smoke test (`bun dev`) to confirm listings render from Notion.
4. Wire the page-level fetch in `app/page.tsx`. Update `Hero`, `JsonLd`, `JobListings`, and `JobCard` per the "Component changes" section. Split `JobListings` into server + client. Add `export const revalidate = 3600` to `app/page.tsx`. Verify filters, search, hero counter, and JSON-LD all still work.
5. Delete `data/jobs.ts`. Run `bun run build` to confirm no stale imports.
6. Add `NOTION_TOKEN` and `NOTION_JOBS_DATABASE_ID` to Vercel env vars. Deploy. Edit a row in Notion; within ~1 hour, confirm the site reflects the change.
7. Write the editor guide in the Notion page body. Share the page with the outsider as an editor.

## Editor workflow

After handoff, the editor's flow is:
- Open the shared Notion page.
- Click "+ New" on the database to add a job, or open an existing row to edit.
- Set `Status`:
  - **Draft** — work-in-progress, hidden from the site.
  - **Live** — visible on the site.
  - **Archived** — hidden, kept for historical record instead of deletion.
- Changes appear on the site within ~1 hour. No rebuild, no code change.

## Open questions

None. All design decisions resolved during brainstorming on 2026-04-19.
