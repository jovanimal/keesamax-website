# Notion-backed Jobs CMS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the job listings on keesamax.com from a hardcoded TypeScript array (`data/jobs.ts`) to a Notion database that a non-technical editor (shared-page guest in the owner's personal workspace) can update directly, with ~1-hour freshness on the live site.

**Architecture:** Notion database → Notion API (server-side in Next.js) → fetched once in `app/page.tsx` as a server component with `revalidate = 3600` → passed as `jobs: Job[]` prop to `Hero`, `JsonLd`, and a newly server+client-split `JobListings`.

**Tech Stack:** Next.js 15 (App Router, server components, ISR), TypeScript, `@notionhq/client`, bun (package manager + script runner), Notion MCP (dev-time scaffolding only — not used at runtime).

**Spec:** `docs/superpowers/specs/2026-04-19-notion-jobs-cms-design.md`

---

## Conventions & Verification Strategy

The project has no unit-test framework configured (no Jest/Vitest — only Playwright is installed, and no tests exist today). Adding one just for this feature is out of scope. Verification per task therefore relies on:

- **`bunx tsc --noEmit`** — catches type errors across the project.
- **`bun run build`** — full Next.js build; catches bundler/Next-specific issues and proves server components compile.
- **`bun run dev`** — local smoke test against live Notion data; the engineer manually visits `http://localhost:3000` and confirms the page renders, filters work, and the open-roles counter matches the expected count.
- **`bun run lint`** — ESLint + next-lint; keeps the project's existing lint cleanliness.

"Expected: no errors" in the steps below means the command exits 0 with no reported problems. Screenshots / visual checks are called out explicitly when needed.

**Typing rule:** Per the user's global preference, **never use `any` for type declarations**. Use the Notion SDK's exported types (`PageObjectResponse`, `RichTextItemResponse`) and narrow via `type` discriminants. Define type interfaces when needed.

**Commits:** Small and frequent. Each task ends with a commit. Pre-commit hooks are respected (no `--no-verify`).

---

## File Map

**Create:**
- `lib/jobs.ts` — owns `Job` and `JobCategory` types, plus `getJobs()` which queries Notion.
- `components/JobListingsClient.tsx` — the current client-side filter/search/list UI, moved out of `JobListings.tsx` and taking `jobs` as a prop.

**Modify:**
- `.env.example` — add `NOTION_TOKEN` and `NOTION_JOBS_DATABASE_ID` placeholders.
- `package.json` — add `@notionhq/client` dependency.
- `app/page.tsx` — add `revalidate = 3600`, `await getJobs()`, pass `jobs` prop to three children.
- `components/Hero.tsx` — accept `jobs: Job[]` prop instead of importing from `data/jobs`.
- `components/JsonLd.tsx` — accept `jobs: Job[]` prop instead of importing from `data/jobs`.
- `components/JobListings.tsx` — convert from client to server wrapper that renders `<JobListingsClient jobs={jobs} />`.
- `components/ui/JobCard.tsx` — switch `Job` type import from `@/data/jobs` to `@/lib/jobs`.

**Delete:**
- `data/jobs.ts` — Notion is the source of truth after migration.

**External (manual steps):**
- Notion page + database (created via MCP in Task 1 & 2).
- Notion internal integration + token (owner sets up in Task 3).
- Vercel env vars (owner sets up in Task 14).

---

## Phase 1: Notion scaffolding (dev-time via MCP)

### Task 1: Create the Notion page and jobs database

**Files:** None (external — Notion via MCP).

- [ ] **Step 1: Confirm MCP is connected to the owner's personal workspace**

Call `mcp__notion__notion-search` with a simple query to confirm access:

```
query: "jobs"
filters: {}
page_size: 3
```

Expected: results return pages from the owner's personal workspace. If zero results or access error, stop — the owner must re-authenticate MCP before continuing.

- [ ] **Step 2: Identify a parent page**

Ask the owner where to place the new page. Default: top-level of the personal workspace (no parent page; creates as a workspace root page). If the owner specifies a parent page, capture its page ID from the URL.

- [ ] **Step 3: Create the "Keesamax — Job Listings" page**

Call `mcp__notion__notion-create-pages` with:
- `parent`: top-level of workspace (or the parent page specified in Step 2)
- Title: `Keesamax — Job Listings`
- Body: a single paragraph placeholder like "Editor guide will be written here. See the jobs database below."

Save the returned page ID. It will be the parent for the database.

- [ ] **Step 4: Create the jobs database under that page**

Call `mcp__notion__notion-create-database` with the parent set to the page ID from Step 3, and properties configured exactly as:

| Property name | Notion type | Options / config |
|---|---|---|
| `Title` | title (native) | — |
| `Industry` | rich_text | — |
| `Category` | select | Options: `Manufacturing`, `FMCG`, `Healthcare`, `Technology`, `Construction`, `Logistics`, `Finance`, `Other` |
| `Location` | rich_text | — |
| `Experience` | rich_text | — |
| `Employment Type` | select | Options: `Full-time`, `Part-time`, `Hybrid`, `Remote`, `Contract` |
| `Company Description` | rich_text | — |
| `Status` | select | Options: `Draft`, `Live`, `Archived` |

Save the returned database ID. The owner will need it for `NOTION_JOBS_DATABASE_ID`.

- [ ] **Step 5: Verify the database with `notion-fetch`**

Call `mcp__notion__notion-fetch` with the database ID. Confirm all 8 properties exist with the exact names and types listed above.

Expected: all properties present, names spelled exactly as above (case-sensitive — the runtime code will reference these names).

- [ ] **Step 6: Report back to the owner**

Post the page URL and database ID to the owner. They'll need the database ID for `NOTION_JOBS_DATABASE_ID` in Task 3.

**No commit in this task** — this is external state in Notion, not code.

---

### Task 2: Migrate the 14 existing jobs into the database

**Files:** Read `data/jobs.ts` for source data (do not modify yet).

- [ ] **Step 1: Enumerate the 14 jobs to migrate**

Reference the current `data/jobs.ts`. The 14 rows, each with `Status = Live`:

```
1.  Engineering Manager        | Beverage Manufacturing    | Manufacturing | Johor Bahru      | 10+ years | —
2.  Sales Manager              | Metal Manufacturing       | Manufacturing | KL               | 10+ years | —
3.  Sales Engineer             | HVAC Industry             | Manufacturing | Sungai Buloh     | 5+ years  | —
4.  Procurement Manager        | FMCG Manufacturing        | FMCG          | Selangor         | 10+ years | —
5.  Senior Brand Manager       | FMCG Beverage             | FMCG          | Kepong           | 5+ years  | —
6.  Senior Finance Executive   | Healthcare                | Healthcare    | Penang           | 7+ years  | —
7.  Sales Representative       | Medical Devices           | Healthcare    | Selangor / KL    | 7+ years  | —
8.  Lead Software Developer    | Tech (Python/C++)         | Technology    | Singapore        | 10+ years | —
9.  Front End Developer        | Construction Tech (SaaS)  | Technology    | PJ · Hybrid      | 3+ years  | Hybrid
10. Senior Interior Designer   | Construction              | Construction  | JB               | 7+ years  | —
11. UI/UX Product Consultant   | Construction Tech (SaaS)  | Construction  | PJ · Hybrid      | 7+ years  | Hybrid
12. BD & Marketing Manager     | Logistics Hub             | Logistics     | Shah Alam        | 10+ years | —
13. Asset Mgmt Executive       | Leasing & Strategy        | Finance       | Cyberjaya        | 3+ years  | —
14. HR Manager                 | Retail                    | Other         | KL               | 7+ years  | —
```

- [ ] **Step 2: Batch-create all 14 rows via MCP**

Call `mcp__notion__notion-create-pages` with the database ID from Task 1 as parent, and an array of 14 pages. Each page's properties mirror the table above, with `Status = Live` and `Company Description` left empty. For rows where Employment Type is `—`, omit the Employment Type property entirely.

- [ ] **Step 3: Verify the migration**

Call `mcp__notion__notion-search` with `data_source_url` pointing to the database (from `<data-source url="...">` in the Task 1 fetch response), query empty / broad, `page_size: 25`. Confirm 14 results, all with `Status = Live`.

Expected: exactly 14 rows, titles matching the list in Step 1.

- [ ] **Step 4: Spot-check one row**

Call `mcp__notion__notion-fetch` on one job page (e.g. the "Front End Developer" row, which exercises the optional Employment Type field). Confirm:
- `Title.title[0].plain_text` = "Front End Developer"
- `Category.select.name` = "Technology"
- `Employment Type.select.name` = "Hybrid"
- `Status.select.name` = "Live"

Expected: all four match exactly.

**No commit in this task** — still external state.

---

### Task 3: Owner creates Notion internal integration and sets env vars

**Files:** `.env.local` (new, gitignored).

This task is **manual — the owner performs these steps**. The engineer provides the instructions and verifies the env vars exist.

- [ ] **Step 1: Give the owner the setup instructions**

Tell the owner to:

1. Open https://www.notion.so/profile/integrations
2. Click "New integration" → "Internal integration".
3. Name it `Keesamax Jobs (site)`. Associate it with the same personal workspace that holds the jobs page.
4. Under Capabilities: only `Read content` is needed. Uncheck everything else.
5. Click Save. Copy the "Internal Integration Secret" (starts with `ntn_` or `secret_`).
6. Open the "Keesamax — Job Listings" page in Notion → click `···` (top right) → `Connections` → search for `Keesamax Jobs (site)` → Add. This grants the integration access to the page (and its database).
7. Create `.env.local` in the project root (or append, if it exists) with:

```
NOTION_TOKEN=<paste the secret from step 5>
NOTION_JOBS_DATABASE_ID=<paste the database ID from Task 1 Step 4>
```

- [ ] **Step 2: Verify `.env.local` is present and gitignored**

Run:

```bash
test -f .env.local && echo "present" || echo "missing"
grep -q "^NOTION_TOKEN=" .env.local && echo "token ok"
grep -q "^NOTION_JOBS_DATABASE_ID=" .env.local && echo "db id ok"
git check-ignore -v .env.local
```

Expected:
```
present
token ok
db id ok
.gitignore:28:.env*.local	.env.local
```

- [ ] **Step 3: Update `.env.example` with new var names (no secrets)**

Modify `.env.example`. Append:

```
# Notion integration token — read-only access to the jobs database
# Create at https://www.notion.so/profile/integrations
NOTION_TOKEN=ntn_xxxxxxxx

# Notion database ID (UUID) for the jobs listings database
NOTION_JOBS_DATABASE_ID=00000000-0000-0000-0000-000000000000
```

- [ ] **Step 4: Commit the `.env.example` change**

```bash
git add .env.example
git commit -m "chore: document NOTION_TOKEN and NOTION_JOBS_DATABASE_ID in env example"
```

---

## Phase 2: Code changes

### Task 4: Install @notionhq/client

**Files:** `package.json`, `bun.lock`.

- [ ] **Step 1: Install the dependency**

Run:

```bash
bun add @notionhq/client
```

Expected: `package.json` gains `"@notionhq/client": "^<version>"` under `dependencies`, and `bun.lock` is updated.

- [ ] **Step 2: Verify install**

Run:

```bash
bunx tsc --noEmit
```

Expected: no errors (install alone shouldn't break anything).

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add @notionhq/client for Notion-backed job listings"
```

---

### Task 5: Create `lib/jobs.ts` with types and `getJobs()`

**Files:**
- Create: `lib/jobs.ts`

- [ ] **Step 1: Write the file**

Create `lib/jobs.ts` with the following exact contents:

```ts
import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type JobCategory =
  | "Manufacturing"
  | "FMCG"
  | "Healthcare"
  | "Technology"
  | "Construction"
  | "Logistics"
  | "Finance"
  | "Other";

export interface Job {
  id: string;
  title: string;
  industry: string;
  category: JobCategory;
  location: string;
  experience: string;
  /** Optional company description; not rendered today. */
  companyDescription?: string;
  /** Optional employment type (e.g. "Full-time", "Hybrid"). */
  type?: string;
}

const VALID_CATEGORIES: ReadonlyArray<JobCategory> = [
  "Manufacturing",
  "FMCG",
  "Healthcare",
  "Technology",
  "Construction",
  "Logistics",
  "Finance",
  "Other",
];

function isValidCategory(value: string): value is JobCategory {
  return (VALID_CATEGORIES as ReadonlyArray<string>).includes(value);
}

function plainText(items: RichTextItemResponse[] | undefined): string {
  if (!items || items.length === 0) return "";
  return items.map((item) => item.plain_text).join("").trim();
}

function readTitle(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (!prop || prop.type !== "title") return "";
  return plainText(prop.title);
}

function readRichText(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (!prop || prop.type !== "rich_text") return "";
  return plainText(prop.rich_text);
}

function readSelect(
  page: PageObjectResponse,
  name: string,
): string | undefined {
  const prop = page.properties[name];
  if (!prop || prop.type !== "select") return undefined;
  return prop.select?.name;
}

function rowToJob(page: PageObjectResponse): Job | null {
  const title = readTitle(page, "Title");
  const industry = readRichText(page, "Industry");
  const location = readRichText(page, "Location");
  const experience = readRichText(page, "Experience");
  const categoryName = readSelect(page, "Category");
  const type = readSelect(page, "Employment Type");
  const companyDescription = readRichText(page, "Company Description");

  if (!title || !industry || !location || !experience) {
    console.warn(
      `[getJobs] Skipping row ${page.id} — missing required text field`,
    );
    return null;
  }
  if (!categoryName || !isValidCategory(categoryName)) {
    console.warn(
      `[getJobs] Skipping row ${page.id} — invalid or missing category "${categoryName ?? ""}"`,
    );
    return null;
  }

  const job: Job = {
    id: page.id,
    title,
    industry,
    category: categoryName,
    location,
    experience,
  };
  if (type) job.type = type;
  if (companyDescription) job.companyDescription = companyDescription;
  return job;
}

export async function getJobs(): Promise<Job[]> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_JOBS_DATABASE_ID;
  if (!token || !databaseId) {
    console.error(
      "[getJobs] Missing NOTION_TOKEN or NOTION_JOBS_DATABASE_ID — returning []",
    );
    return [];
  }

  try {
    const notion = new Client({ auth: token });
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Status",
        select: { equals: "Live" },
      },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
      page_size: 100,
    });

    const jobs: Job[] = [];
    for (const page of response.results) {
      if (!("properties" in page)) continue;
      const job = rowToJob(page as PageObjectResponse);
      if (job) jobs.push(job);
    }
    return jobs;
  } catch (err) {
    console.error("[getJobs] Notion fetch failed:", err);
    return [];
  }
}
```

- [ ] **Step 2: Type-check**

Run:

```bash
bunx tsc --noEmit
```

Expected: no errors. If `@notionhq/client/build/src/api-endpoints` path is rejected by TS, fall back to the package's public `*` types (the subpath may change between SDK versions — grep `node_modules/@notionhq/client/build/src/api-endpoints.d.ts` to confirm it exists; if it doesn't, use the top-level `import type { ... } from "@notionhq/client"` export).

- [ ] **Step 3: Smoke test the fetch in isolation**

Create a temporary file `scripts/smoke-jobs.ts` with:

```ts
import { getJobs } from "../lib/jobs";

async function main() {
  const jobs = await getJobs();
  console.log(`fetched ${jobs.length} jobs`);
  for (const job of jobs) {
    console.log(`- [${job.category}] ${job.title} (${job.location})`);
  }
}
main();
```

Run (bun reads `.env.local` automatically via Next.js, but in a standalone script we load it manually — bun supports `--env-file`):

```bash
bun --env-file=.env.local scripts/smoke-jobs.ts
```

Expected: `fetched 14 jobs`, followed by 14 `[Category] Title (Location)` lines, newest first by Notion creation time.

- [ ] **Step 4: Delete the smoke script**

```bash
rm scripts/smoke-jobs.ts
rmdir scripts 2>/dev/null || true
```

(It was a throwaway — `lib/jobs.ts` is the only artifact we keep.)

- [ ] **Step 5: Commit**

```bash
git add lib/jobs.ts
git commit -m "feat: add lib/jobs.ts with Notion-backed getJobs() and Job/JobCategory types"
```

---

### Task 6: Update `components/Hero.tsx` to accept `jobs` prop

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Replace the import and add a prop**

Change the top of `components/Hero.tsx` from:

```tsx
import Image from "next/image";
import { ArrowRight, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { jobs } from "@/data/jobs";
```

to:

```tsx
import Image from "next/image";
import { ArrowRight, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Job } from "@/lib/jobs";
```

Then change the component signature from:

```tsx
export function Hero() {
  const openRoles = jobs.length;
```

to:

```tsx
interface HeroProps {
  jobs: Job[];
}

export function Hero({ jobs }: HeroProps) {
  const openRoles = jobs.length;
```

No other changes to the file.

- [ ] **Step 2: Type-check**

Run:

```bash
bunx tsc --noEmit
```

Expected: one error at `app/page.tsx` (`<Hero />` called without the required `jobs` prop). That's fine — it will be fixed in Task 10. All other files: no errors.

- [ ] **Step 3: Commit (do not commit yet — bundle with Task 7, 8, 9, 10)**

Skip the commit; these four component edits are a single logical change. The next few tasks will be squashed into one commit at the end of Task 10.

---

### Task 7: Update `components/JsonLd.tsx` to accept `jobs` prop

**Files:**
- Modify: `components/JsonLd.tsx`

- [ ] **Step 1: Replace the import and add a prop**

Change the top of `components/JsonLd.tsx` from:

```tsx
import { site } from "@/data/site";
import { jobs, type Job } from "@/data/jobs";
```

to:

```tsx
import { site } from "@/data/site";
import type { Job } from "@/lib/jobs";
```

Then change the component signature from:

```tsx
export function JsonLd() {
```

to:

```tsx
interface JsonLdProps {
  jobs: Job[];
}

export function JsonLd({ jobs }: JsonLdProps) {
```

No other changes.

- [ ] **Step 2: Type-check**

Run:

```bash
bunx tsc --noEmit
```

Expected: still one error at `app/page.tsx` — `<JsonLd />` now also missing a prop. Fine.

- [ ] **Step 3: No commit yet** (bundled with Task 10).

---

### Task 8: Update `components/ui/JobCard.tsx` import source

**Files:**
- Modify: `components/ui/JobCard.tsx`

- [ ] **Step 1: Change the import**

In `components/ui/JobCard.tsx`, change:

```tsx
import type { Job } from "@/data/jobs";
```

to:

```tsx
import type { Job } from "@/lib/jobs";
```

No other changes.

- [ ] **Step 2: Type-check**

Run:

```bash
bunx tsc --noEmit
```

Expected: same one error at `app/page.tsx` (from earlier). No new errors.

- [ ] **Step 3: No commit yet** (bundled with Task 10).

---

### Task 9: Split `components/JobListings.tsx` into server + client

**Files:**
- Create: `components/JobListingsClient.tsx`
- Modify: `components/JobListings.tsx`

- [ ] **Step 1: Create `components/JobListingsClient.tsx`**

Write this file with the current client-side logic, taking `jobs` from props instead of the `data/jobs` import. Exact contents:

```tsx
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Job, JobCategory } from "@/lib/jobs";
import { JobCard } from "@/components/ui/JobCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Filter = "All" | JobCategory;

const CATEGORY_ORDER: JobCategory[] = [
  "Manufacturing",
  "FMCG",
  "Healthcare",
  "Technology",
  "Construction",
  "Logistics",
  "Finance",
  "Other",
];

interface JobListingsClientProps {
  jobs: Job[];
}

export function JobListingsClient({ jobs }: JobListingsClientProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);

  const filters: Filter[] = useMemo(() => {
    const present = new Set<JobCategory>();
    for (const job of jobs) present.add(job.category);
    const ordered = CATEGORY_ORDER.filter((c) => present.has(c));
    return ["All", ...ordered];
  }, [jobs]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (filter !== "All" && job.category !== filter) return false;
      if (!q) return true;
      return (
        job.title.toLowerCase().includes(q) ||
        job.industry.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      );
    });
  }, [jobs, filter, query]);

  const shown = showAll ? visible : visible.slice(0, 8);

  return (
    <section id="jobs" className="section-py bg-[var(--color-slate-100)]">
      <div className="container-base">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow">Open Positions</div>
            <h2>
              Find your next
              <br />
              opportunity.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setShowAll(false);
                }}
                className={cn(
                  "rounded-full border px-[18px] py-[9px] text-[0.8125rem] font-semibold transition-colors duration-200",
                  filter === f
                    ? "border-[var(--color-navy-900)] bg-[var(--color-navy-900)] text-white"
                    : "border-[var(--color-slate-200)] bg-white text-[var(--color-slate-600)] hover:border-[var(--color-navy-900)] hover:bg-[var(--color-navy-900)] hover:text-white",
                )}
              >
                {f === "All" ? "All Roles" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-slate-200)] bg-white px-4 py-3 shadow-[var(--shadow-xs)] focus-within:border-[var(--color-navy-900)] focus-within:shadow-[0_0_0_3px_rgba(15,35,65,0.08)]">
          <Search className="size-[18px] text-[var(--color-slate-400)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowAll(false);
            }}
            placeholder="Search by title, industry, or location..."
            className="flex-grow bg-transparent text-[0.9375rem] text-[var(--color-slate-900)] placeholder:text-[var(--color-slate-400)] focus:outline-none"
          />
        </div>

        {shown.length > 0 ? (
          <div className="grid gap-3.5 md:grid-cols-2">
            {shown.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-slate-200)] bg-white p-12 text-center text-[var(--color-slate-500)]">
            No roles match your filters. Try adjusting or{" "}
            <a
              href="#contact"
              className="font-semibold text-[var(--color-blue-600)] hover:underline"
            >
              get in touch
            </a>{" "}
            and we&apos;ll help.
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="mb-[18px] text-[0.9375rem] text-[var(--color-slate-500)]">
            Showing {shown.length} of {visible.length}
            {filter !== "All" || query ? " matching" : ""} position
            {visible.length === 1 ? "" : "s"}
            {filter === "All" && !query ? " across Southeast Asia" : ""}
          </p>
          {visible.length > 8 && !showAll ? (
            <Button variant="outline" onClick={() => setShowAll(true)}>
              View All {visible.length} Positions →
            </Button>
          ) : (
            <Button href="#contact" variant="outline">
              Don&apos;t see your role? Talk to us →
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Rewrite `components/JobListings.tsx` as the server wrapper**

Replace the entire contents of `components/JobListings.tsx` with:

```tsx
import type { Job } from "@/lib/jobs";
import { JobListingsClient } from "@/components/JobListingsClient";

interface JobListingsProps {
  jobs: Job[];
}

export function JobListings({ jobs }: JobListingsProps) {
  return <JobListingsClient jobs={jobs} />;
}
```

Note: no `"use client"`. The filter-categories derivation moved into `JobListingsClient`.

- [ ] **Step 3: Type-check**

Run:

```bash
bunx tsc --noEmit
```

Expected: still the single error at `app/page.tsx` (missing props on `<Hero />`, `<JsonLd />`, `<JobListings />`). No new errors.

- [ ] **Step 4: No commit yet** (bundled with Task 10).

---

### Task 10: Wire page-level fetch and revalidation in `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the file contents**

Replace `app/page.tsx` with:

```tsx
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ClientLogos } from "@/components/ClientLogos";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { About } from "@/components/About";
import { JobListings } from "@/components/JobListings";
import { CtaBanner } from "@/components/CtaBanner";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { getJobs } from "@/lib/jobs";

export const revalidate = 3600;

export default async function Home() {
  const jobs = await getJobs();

  return (
    <>
      <JsonLd jobs={jobs} />
      <Navbar />
      <main>
        <Hero jobs={jobs} />
        <ClientLogos />
        <Services />
        <WhyUs />
        <About />
        <JobListings jobs={jobs} />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

Run:

```bash
bunx tsc --noEmit
```

Expected: **no errors**. The Task 6–9 error is now resolved.

- [ ] **Step 3: Lint**

Run:

```bash
bun run lint
```

Expected: no errors. (Any warnings pre-existing from unrelated files can be ignored, but no new ones from the modified files.)

- [ ] **Step 4: Commit the bundled component-plumbing change**

```bash
git add app/page.tsx components/Hero.tsx components/JsonLd.tsx components/JobListings.tsx components/JobListingsClient.tsx components/ui/JobCard.tsx
git commit -m "feat: fetch jobs from Notion at page level and pass as props

Adds getJobs() fetch in app/page.tsx with revalidate=3600 (ISR, ~1h
freshness). Hero, JsonLd, and JobListings now receive jobs via props
rather than importing from data/jobs. JobListings is split into a
server wrapper + JobListingsClient (client) so the fetch can live in
a server component. Filter categories are derived from the fetched
data so new Notion categories appear automatically."
```

---

### Task 11: Local smoke test against live Notion data

**Files:** None (verification only).

- [ ] **Step 1: Start the dev server**

Run in one terminal:

```bash
bun run dev
```

Expected: server starts on http://localhost:3000 with no errors. The initial request compiles the page (may take ~10s on first load).

- [ ] **Step 2: Open the site and check the four consumers**

Visit http://localhost:3000. Verify manually:

- **Hero section**: the "open roles" number / copy reflects a count of `14` (matching the 14 migrated jobs).
- **Jobs section**: 8 job cards visible initially (since the list has >8). "View All 14 Positions →" button at the bottom.
- **Filter buttons**: "All Roles" plus one button per distinct category present. Expected (from the 14-row migration): `All Roles`, `Manufacturing`, `FMCG`, `Healthcare`, `Technology`, `Construction`, `Logistics`, `Finance`, `Other`.
- **Search**: type "KL" — visible list narrows to roles in KL.
- **Filter**: click `Technology` — only Technology-category jobs appear.
- **JSON-LD**: view page source, confirm 14 `<script type="application/ld+json">` `JobPosting` blocks present (plus the Organization and BreadcrumbList).

- [ ] **Step 3: Notion edit round-trip**

In Notion, open any `Live` job row and change its Status to `Archived`. In the browser, hard-refresh http://localhost:3000 (Cmd+Shift+R). Next.js dev mode re-runs server components on each request and ignores the `revalidate` export, so no server restart is needed.

Expected: the archived row is no longer visible; counter now says `13`.

Restore the row's Status back to `Live` in Notion and hard-refresh again. Expected: counter back to `14`.

- [ ] **Step 4: Stop the dev server**

Ctrl+C.

**No commit** — verification only. If any step failed, fix it before proceeding (do not move to Task 12 with a broken smoke test).

---

### Task 12: Delete `data/jobs.ts`

**Files:**
- Delete: `data/jobs.ts`

- [ ] **Step 1: Confirm nothing imports from `@/data/jobs`**

Run via the Grep tool:

Pattern: `@/data/jobs`, output_mode: files_with_matches.

Expected: zero matches. If any match, fix that file's import to `@/lib/jobs` before deleting.

- [ ] **Step 2: Delete the file**

```bash
git rm data/jobs.ts
```

- [ ] **Step 3: Type-check and build**

```bash
bunx tsc --noEmit
bun run build
```

Expected: both complete with no errors. `bun run build` produces `.next/` output including the statically pre-rendered home page with jobs from Notion.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove data/jobs.ts; Notion is now the source of truth"
```

---

## Phase 3: Rollout

### Task 13: Add env vars to Vercel and deploy

**Files:** None (external).

This is manual — the owner performs these steps. Engineer verifies afterward.

- [ ] **Step 1: Add the env vars in Vercel**

Owner navigates to the Vercel project → Settings → Environment Variables. Add:

- `NOTION_TOKEN` — value: the same secret as in local `.env.local`. Environments: Production, Preview, Development.
- `NOTION_JOBS_DATABASE_ID` — value: the database UUID. Same environments.

- [ ] **Step 2: Deploy**

Push the committed changes:

```bash
git push origin main
```

Vercel auto-deploys. Watch the build log; expected: build succeeds. If it fails with `NOTION_TOKEN undefined` during `next build`, the env var wasn't applied to the build environment — re-check Step 1.

- [ ] **Step 3: Verify production**

Visit the production URL. Expected: 14 jobs shown, filters work, counter matches. View source to confirm JSON-LD job postings are present.

- [ ] **Step 4: Editing smoke test (wait for ISR)**

In Notion, edit one job's title (e.g. append `(updated)`). Wait ~1 hour. Request the page again (with a cache-busting query string if needed, e.g. `?t=1`). Expected: the updated title appears.

Revert the title edit.

---

### Task 14: Write the editor guide inside the Notion page body

**Files:** None (external — Notion via MCP).

- [ ] **Step 1: Compose the guide**

Call `mcp__notion__notion-update-page` on the "Keesamax — Job Listings" page, replacing the placeholder body with:

```
# Editor guide

Welcome! This page is the live source for the job listings on keesamax.com.
When you add, edit, or archive a row in the database below, the website
updates within about 1 hour.

## Adding a new job

1. Click **+ New** on the database below. A row opens in a side panel.
2. Fill in each property:
   - **Title** — the job title (e.g. "Engineering Manager").
   - **Industry** — short industry description (e.g. "Beverage Manufacturing").
   - **Category** — pick one of Manufacturing, FMCG, Healthcare, Technology,
     Construction, Logistics, Finance, Other. This controls which filter
     button the job appears under on the site.
   - **Location** — city or region (e.g. "Johor Bahru", "PJ · Hybrid").
   - **Experience** — free text (e.g. "5+ years").
   - **Employment Type** — optional. Pick Full-time, Part-time, Hybrid,
     Remote, or Contract. Leave empty if not specified.
   - **Company Description** — optional. Longer blurb; reserved for future
     use on the site.
   - **Status** — this is the most important field:
     - **Draft** — hidden from the site. Use while you're still writing.
     - **Live** — visible on the site.
     - **Archived** — hidden, but kept as a record. Use when a role is
       filled or no longer open, instead of deleting.
3. Once you're happy, set **Status** to **Live**. Within about an hour,
   the new role appears on the site.

## Ordering

Jobs are sorted on the site by when they were added to this database,
newest first. You don't need to set any order manually.

## Something looks wrong on the site?

Let Andrew know. Common causes:
- A required field (Title / Industry / Location / Experience / Category)
  is empty — the row is skipped.
- Category spelled differently than the allowed options.
```

Insert this as a rich-text page body section above the existing database.

- [ ] **Step 2: Verify with `notion-fetch`**

Call `mcp__notion__notion-fetch` on the page. Confirm the guide text is present and the database is still embedded below it.

---

### Task 15: Share the Notion page with the outsider editor

**Files:** None (external — manual, owner performs).

- [ ] **Step 1: Share the page**

Owner opens the "Keesamax — Job Listings" page in Notion → click **Share** (top right) → type the editor's email → select **Can edit** → send.

Notion will email the editor an invite link. Verify the editor accepts and can open the page.

- [ ] **Step 2: Final handoff note**

Send the editor a short message with:
- Link to the shared Notion page.
- A one-liner: "Read the 'Editor guide' at the top of the page to get started. Changes you make take up to 1 hour to appear on the website. Ping me if anything looks off."

---

## Done

After Task 15 completes: Notion is live, the website is fetching from it, the editor has access, and `data/jobs.ts` is gone.
