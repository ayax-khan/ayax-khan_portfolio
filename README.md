# Portfolio (Next.js + Prisma + GitHub)

A production-grade developer portfolio built with:

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Server-side GitHub REST API integration with DB caching
- Contact form with server-side validation + optional Upstash rate limiting
- Admin panel for projects/blog protected by HTTP Basic Auth

## Requirements

- Node.js 20+
- pnpm
- PostgreSQL (local or hosted)

## Setup

1) Install dependencies

```bash
pnpm install
```

2) Configure environment variables

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Required at runtime:

- `DATABASE_URL` (Postgres connection string)
- `GITHUB_TOKEN` (GitHub token for API calls)
- `GITHUB_USERNAME` (your GitHub username)
- `SITE_URL` (e.g. `http://localhost:3000`)

Optional:

- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (enables rate limiting)
- `PROFILE_*` and `SOCIAL_*` (used for hero/about/footer)
- `ADMIN_USER`, `ADMIN_PASSWORD` (protects `/admin`)

3) Run database migrations

```bash
pnpm prisma:migrate
pnpm prisma:generate
```

4) Start the dev server

```bash
pnpm dev
```

Open http://localhost:3000

## Admin

Admin routes:

- `/admin` (home)
- `/admin/projects` (ProjectOverride management)
- `/admin/blog` (BlogPost CRUD/publish)

Protection:

- Set `ADMIN_USER` and `ADMIN_PASSWORD` in your environment.
- The app uses HTTP Basic Auth via `src/middleware.ts`.

## Scripts

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm start` — run production server
- `pnpm lint` — ESLint
- `pnpm typecheck` — TypeScript
- `pnpm prisma:migrate` — run local migrations
- `pnpm prisma:studio` — open Prisma Studio

## Notes

- Blog post content is currently rendered as plain text (safe by default). If you want full Markdown rendering, we can add a renderer with sanitization.
- GitHub data is fetched server-side and cached in Postgres via the `GithubApiCache` model.
