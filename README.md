# Keesamax Website

Marketing site for **Keesamax Sdn Bhd** — a boutique recruitment firm based in Malaysia serving clients across APAC and EMEA.

## Stack

- **Next.js 15** App Router + **React 19**
- **TypeScript** (strict, no `any`)
- **Tailwind CSS 4** with CSS-first `@theme` tokens
- **Framer Motion** + **Lucide React**
- **React Hook Form** + **Zod** for the contact form
- **Resend** for transactional email
- **next-sitemap** for `sitemap.xml` / `robots.txt`
- Package manager: **bun**

## Local development

```bash
bun install
cp .env.example .env.local   # fill in RESEND_API_KEY etc.
bun run dev
```

Visit http://localhost:3000 (or the port Next picks if 3000 is in use).

## Project structure

```
app/               # App Router — single-page layout + /api/contact route
components/        # Section components (Hero, Services, JobListings, ...)
components/ui/     # Primitives (Button, ScrollReveal, SectionHeading, JobCard)
data/              # Typed content: jobs, services, industries, clients, site
lib/               # Utilities (cn helper)
public/images/     # Logos + static assets
_spec/             # Source-of-truth mockup + revamp PDF (reference only)
```

All copy, job listings, services, industries, and client logos live in `/data/*.ts` as typed arrays so non-code edits are straightforward (future migration to Notion-backed content is planned).

## Content editing

- **Jobs:** `data/jobs.ts` — `Job` interface, category enum
- **Services:** `data/services.ts`
- **Industries / Countries:** `data/industries.ts`
- **Clients:** `data/clients.ts`
- **Site config / contact info:** `data/site.ts`

## Environment variables

See `.env.example`. Required for the contact form:

| Variable              | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `RESEND_API_KEY`      | Resend API key                            |
| `CONTACT_EMAIL_TO`    | Inbox receiving enquiries                 |
| `CONTACT_EMAIL_FROM`  | Verified sender address                   |
| `SITE_URL`            | Canonical site URL (sitemap + metadata)   |

## Deploy

Configured for **Vercel** (free tier). Steps:

1. Push to the GitHub repo.
2. Import the project in Vercel.
3. Set the env vars above.
4. Verify the sending domain in Resend.
5. Point DNS: `A` record `@` → `76.76.21.21`, `CNAME` `www` → `cname.vercel-dns.com`.

## Scripts

```bash
bun run dev        # start dev server
bun run build      # production build (+ next-sitemap post step)
bun run start      # serve production build
bun run lint       # next lint
```
