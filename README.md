# PowerHouse

> Discipline. Strength. Athleticism.

PowerHouse is a modern, full-stack transformation platform focused on physical
fitness, strength building, boxing-style athleticism, daily discipline, and
mental resilience. The entire system is **rule-based** — every workout, diet,
and recommendation is generated from structured data and explainable logic.
**AI is purely optional**: PowerHouse works fully without an AI key. If an
Anthropic API key is provided, an extra AI Coach panel becomes available.

---

![Landing](docs/screenshots/landing.png)

---

## Table of contents

- [Demo accounts](#demo-accounts)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Quick start — local development](#quick-start--local-development)
- [Quick start — Docker (all-in-one)](#quick-start--docker-all-in-one)
- [Available scripts](#available-scripts)
- [Environment variables](#environment-variables)
- [Database](#database)
- [Feature tour (screenshots)](#feature-tour-screenshots)
- [Architecture notes](#architecture-notes)
- [Troubleshooting](#troubleshooting)
- [Production checklist](#production-checklist)

---

## Demo accounts

After running `npm run db:seed`, two pre-seeded accounts are available:

| Email                   | Password      | State                                                       |
| ----------------------- | ------------- | ----------------------------------------------------------- |
| `alex@powerhouse.dev`   | `demopass123` | Fully onboarded · 1 push workout + 1 boxing session logged · diet + discipline history (use this to explore the dashboard) |
| `jordan@powerhouse.dev` | `demopass123` | Brand-new account · onboarding not completed (use this to walk through the onboarding flow) |

You can of course register your own account from the UI — both flows work end-to-end.

---

## Tech stack

| Layer    | Technology                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| Frontend | Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion 11 · Radix UI · Recharts · Zustand        |
| Backend  | Node.js 20+ · Express 4 · TypeScript · Zod for runtime validation                                                          |
| Database | PostgreSQL 16                                                                                                              |
| ORM      | Prisma 6                                                                                                                   |
| Auth     | JWT (HS256) · bcryptjs password hashing · `Authorization: Bearer <token>` headers                                         |
| Optional | Anthropic Claude (`claude-sonnet-4-6` default) — enabled only if `ANTHROPIC_API_KEY` is set                                |
| Deploy   | Docker Compose with multi-stage Dockerfiles for both apps                                                                  |

---

## Repository layout

```
powerhouse/
├── apps/
│   ├── api/                  Express + TypeScript backend
│   │   └── src/
│   │       ├── lib/          env, jwt, http helpers
│   │       ├── middleware/   auth, validate, error
│   │       ├── routes/       auth, profile, workouts, sessions, boxing,
│   │       │                 diet, discipline, dashboard, ai
│   │       ├── services/     personalization (BMR/TDEE/recs), transformation
│   │       │                 (XP/levels/streaks/achievements), ai-coach
│   │       └── index.ts      App entry — Express setup, route mounting
│   └── web/                  Next.js 15 frontend (App Router)
│       └── src/
│           ├── app/
│           │   ├── (dash)/   Auth-gated routes: dashboard, workouts, boxing,
│           │   │             diet, discipline, coach, profile
│           │   ├── login/    Public auth pages
│           │   ├── register/
│           │   ├── onboarding/  7-step animated onboarding flow
│           │   ├── layout.tsx   Root layout + fonts + toast viewport
│           │   ├── globals.css  Tailwind + glass / gradient utilities
│           │   └── page.tsx     Landing
│           ├── components/   Button, ProgressRing, StatTile, WorkoutCard,
│           │                  AppShell (sidebar), BrandLogo, Toast
│           ├── lib/          api client, utils
│           ├── store/        zustand auth store
│           └── types/        Shared API response types
├── packages/
│   └── prisma/
│       ├── prisma/schema.prisma   18 models covering the whole domain
│       ├── seed/                  Modular seed: exercises, workouts, boxing,
│       │                          foods, meals, diets, discipline,
│       │                          achievements, users (demo accounts)
│       └── client.ts              Singleton Prisma client
├── docs/screenshots/         Captured app screenshots used in this README
├── docker-compose.yml        db + api + web stack
├── Dockerfile.api            Multi-stage build of @powerhouse/api
├── Dockerfile.web            Multi-stage build of @powerhouse/web
├── .env.example
└── README.md
```

---

## Quick start — local development

### Prerequisites

- **Node.js ≥ 20** (this project was developed against Node 22+ and Node 25 — both work).
- **npm ≥ 10**.
- **Docker Desktop** *(or any local Postgres 14+ if you prefer to run the DB yourself)*.

### Step 1 — clone and install

```bash
git clone https://github.com/RajuRoopani/powerhouse.git
cd powerhouse
npm install
```

`npm install` installs all three workspaces (`apps/api`, `apps/web`, `packages/prisma`) into a single hoisted `node_modules/`. Total install ≈ 30s on a clean machine.

### Step 2 — environment file

```bash
cp .env.example .env
```

The defaults are fine for local development. Open `.env` only if you want to:

- change the database URL (default points at the Docker Postgres on `:5432`),
- set a stronger `JWT_SECRET` (the default is non-prod placeholder text),
- enable the AI Coach by adding `ANTHROPIC_API_KEY`.

> The API automatically walks up from `apps/api/` to find the repo-root `.env` — no need to copy `.env` into each workspace.

### Step 3 — start Postgres

```bash
docker compose up -d db
```

This starts a Postgres 16 container called `powerhouse-db` with a named volume. The `db` service exposes `:5432` on the host and has a `pg_isready` healthcheck.

If you'd rather use a local Postgres install, set `DATABASE_URL` in `.env` to point at it. Anything `postgresql://user:pass@host:5432/dbname` works.

### Step 4 — push schema and seed

```bash
npm run db:push    # creates tables from prisma/schema.prisma
npm run db:seed    # inserts exercises, plans, foods, diets, achievements, demo users
```

Expected seed output:

```
Seeding PowerHouse database...
  exercises:   33
  workouts:    10
  boxing:      15
  foods:       20
  meals:       13
  diets:       6
  discipline:  10
  achievements:10
  demo users:  2  (alex@powerhouse.dev + jordan@powerhouse.dev / demopass123)
Done.
```

### Step 5 — run both apps together

```bash
npm run dev
```

- API at <http://localhost:4000> (health: `/health`)
- Web at <http://localhost:3000>

Sign in with one of the demo accounts above, or click **Get started** on the landing page to register your own.

---

## Quick start — Docker (all-in-one)

```bash
cp .env.example .env
docker compose up --build
```

Three containers come up:

| Container          | Port | Image source        |
| ------------------ | ---- | ------------------- |
| `powerhouse-db`    | 5432 | postgres:16-alpine  |
| `powerhouse-api`   | 4000 | Dockerfile.api      |
| `powerhouse-web`   | 3000 | Dockerfile.web      |

On the **first** run, after the API container is up, push and seed the schema from your host:

```bash
docker exec -e DATABASE_URL=postgresql://powerhouse:powerhouse@db:5432/powerhouse \
  powerhouse-api sh -c "cd /repo && npx prisma db push --schema=packages/prisma/prisma/schema.prisma && npx tsx packages/prisma/seed/index.ts"
```

…or just run `npm run db:push && npm run db:seed` from the host (the Postgres port is published).

Now open <http://localhost:3000>.

---

## Available scripts

All commands run from the repo root unless noted.

| Command               | What it does                                                       |
| --------------------- | ------------------------------------------------------------------ |
| `npm run dev`         | Runs `dev:api` + `dev:web` in parallel (tsx watch + next dev)      |
| `npm run dev:api`     | API only, with hot reload                                          |
| `npm run dev:web`     | Web only                                                           |
| `npm run build`       | Builds both apps (tsc for API, next build for web)                 |
| `npm run start`       | Runs production builds in parallel                                 |
| `npm run typecheck`   | TypeScript check across all workspaces                             |
| `npm run db:push`     | Push the Prisma schema (no migration files; fast for dev)          |
| `npm run db:migrate`  | Run a proper Prisma migration (use for managed/staging/prod)       |
| `npm run db:seed`     | Run all seeders (idempotent — upserts everywhere)                  |
| `npm run db:studio`   | Open Prisma Studio in the browser                                  |
| `npm run db:generate` | Regenerate the Prisma client                                       |
| `npm run docker:up`   | `docker compose up -d`                                             |
| `npm run docker:down` | `docker compose down`                                              |
| `npm run docker:logs` | Tail compose logs                                                  |

---

## Environment variables

Documented in [`.env.example`](./.env.example).

### Required

| Variable       | Notes                                            |
| -------------- | ------------------------------------------------ |
| `DATABASE_URL` | Postgres connection string                       |
| `JWT_SECRET`   | ≥ 16 chars. Used by the API to sign tokens.      |

### Optional

| Variable                | Default                | What changes                                                  |
| ----------------------- | ---------------------- | ------------------------------------------------------------- |
| `API_PORT`              | `4000`                 | API listening port                                            |
| `WEB_URL`               | `http://localhost:3000`| CORS allow-list entry                                         |
| `JWT_EXPIRES_IN`        | `7d`                   | Token lifetime                                                |
| `ANTHROPIC_API_KEY`     | *(unset)*              | Unlocks the AI Coach. Without it the UI shows a fallback panel. |
| `ANTHROPIC_MODEL`       | `claude-sonnet-4-6`    | Model used by the AI Coach                                    |
| `NEXT_PUBLIC_API_URL`   | `http://localhost:4000`| The web app uses this to reach the API                        |

---

## Database

Run by `prisma db push` against your `DATABASE_URL`. The schema lives in
[`packages/prisma/prisma/schema.prisma`](packages/prisma/prisma/schema.prisma).

The schema covers 18 models grouped into five domains:

- **Auth**: `User`, `Streak`
- **Profile**: `Profile` (onboarding inputs)
- **Catalog**: `Exercise`, `WorkoutPlan`, `WorkoutExercise`, `BoxingTechnique`, `FoodItem`, `Meal`, `MealItem`, `DietPlan`, `DietPlanMeal`, `DisciplineTask`, `Achievement`
- **History**: `WorkoutSession`, `SessionExercise`, `BoxingSession`, `DietLog`, `HabitLog`, `UserAchievement`
- **AI**: `ChatMessage` (only used when the AI Coach is enabled)

The seed scripts are split into focused modules so each is easy to extend
without touching the others: `exercises.ts`, `workouts.ts`, `boxing.ts`,
`foods.ts`, `meals.ts`, `diets.ts`, `discipline.ts`, `achievements.ts`,
`users.ts`. All seeders are idempotent — re-running `npm run db:seed`
is safe.

---

## Feature tour (screenshots)

> All screenshots captured against the running app at 1440×900, dark mode, using the seeded `alex@powerhouse.dev` demo account (except onboarding which uses `jordan@powerhouse.dev`).

### Landing

Public marketing page with the four pillars: Strength, Boxing Fitness, Discipline, Conditioning.

![Landing](docs/screenshots/landing.png)

### Register & Login

Animated glass forms with proper validation, error toasts, and JWT auth.

| Register | Login |
| --- | --- |
| ![Register](docs/screenshots/register.png) | ![Login](docs/screenshots/login.png) |

### Onboarding

A 7-step animated flow that captures 14 profile inputs:
age · gender · height · weight · fitness level · body type · training location ·
budget level · diet preference · boxing experience · sleep quality · daily free
time · goals · available equipment.

The data feeds the rule-based personalization engine (Mifflin-St Jeor BMR → TDEE → goal-adjusted calorie target → protein/hydration → matched workouts and diet plan).

![Onboarding](docs/screenshots/onboarding.png)

### Dashboard

Glass-style animated dashboard with: level progress ring, transformation score, calorie/protein/hydration tiles, today's recommended workout, daily discipline picks, 14-day XP area chart, recent workouts, recent boxing, recently unlocked achievements.

![Dashboard](docs/screenshots/dashboard.png)

### Workouts — library

Filterable plan grid (location · level). 10 seeded plans covering home, gym, boxing, and mobility. Each card carries an **animated emoji-image illustration** (Twemoji loaded from CDN as SVG) with per-exercise motion personality and atmospheric particles — picked automatically by exercise/category.

![Workouts library](docs/screenshots/workouts.png)

### Workouts — plan detail

Full exercise breakdown with sets, reps, rest, primary muscle, and a "Start session" button. Every exercise gets its own animated emoji illustration that loops while you read.

![Workout detail](docs/screenshots/workout-detail.png)

### Workouts — live session

Set-by-set logger with reps + weight inputs, live timer, rest countdown, an animated set-progress ring, pause/resume, and a "Complete session" button that awards XP + checks for new achievements. A large 132px animated emoji illustration of the current movement sits next to the instructions.

![Active session](docs/screenshots/active-session.png)

### Boxing studio

Round-based timer with separate work and rest phases. Configurable rounds / round seconds / rest seconds. Below the timer: a coachable technique library (jab, cross, hooks, slips, footwork, combinations…) with cue lists.

![Boxing](docs/screenshots/boxing.png)

### Diet & hydration

Today's totals vs. personalized targets (calorie / protein / water rings), quick-log form, and budget-aware plan cards (Basic / Moderate / Premium across veg, eggetarian, and non-veg).

![Diet](docs/screenshots/diet.png)

### Discipline

Daily habits grouped by category (Sleep, Hydration, Mind, Body, Meditation, Journaling, Recovery). One-tap logging with per-task XP rewards.

![Discipline](docs/screenshots/discipline.png)

### AI Coach (optional)

When `ANTHROPIC_API_KEY` is **not** set, the Coach panel renders a graceful fallback explaining how to enable it. When the key is set, this becomes a streaming chat backed by Claude with a system prompt enforcing fitness, discipline, and safety guardrails (no medical advice, no glorifying violence, no extreme deficits).

![Coach](docs/screenshots/coach.png)

### Profile

Calibrated daily targets (TDEE, calorie target, protein, hydration) + the full set of onboarding answers, with a button to re-run onboarding.

![Profile](docs/screenshots/profile.png)

---

## Architecture notes

### Exercise illustrations

Every exercise is paired with an animated image illustration via
[`apps/web/src/components/ExerciseAnim.tsx`](apps/web/src/components/ExerciseAnim.tsx).
Each illustration combines three layers:

1. **Twemoji** (Twitter's open-source emoji set, CC-BY 4.0) loaded as SVG `<img>`
   from `cdn.jsdelivr.net/gh/jdecked/twemoji@latest`. The same emoji renders
   identically on every platform (Mac/Windows/Linux/Android/iOS). Examples used:
   🏋️ (press, swing), 🥊 (punch), 🤸 (jump, burpee), 🏃 (run), 🧘 (plank, stretch),
   🧗 (pull), 🚣 (row), 🤺 (lunge), 🪢 (rope), 💪 (pushup, core, flex), 🦵 (squat, kick).
2. **Motion personality** per exercise — bounce, thrust, swing, run, spin, jump,
   pulse, breathe, flex, press, rise, step — implemented as Framer Motion variants.
3. **Atmospheric layer** — gradient orb backdrop, glowing floor puck, and a
   particle system that picks rings / sparks / speed lines / dust dots based on
   the exercise's energy profile.

Resolution order: exact `slug` → category → primary muscle → generic ⚡.

On the rare chance the Twemoji CDN fails, the component falls back to native
system emoji via `<span>` (the `onError` handler swaps the `<img>` out). No
external runtime dependency outside the CDN — and that's just a one-time SVG
fetch per emoji, cached forever by the browser.

### Rule-based personalization engine

Located in [`apps/api/src/services/personalization.ts`](apps/api/src/services/personalization.ts). It does **no** AI / ML — every decision is a transparent rule:

- **BMR** via Mifflin-St Jeor.
- **TDEE** = BMR × activity factor (looked up by fitness level, nudged by daily free time).
- **Calorie target** = TDEE × {0.8, 1.05, 1.12} depending on primary goal.
- **Protein target** = bodyweight × {1.6 – 2.2} g/kg.
- **Hydration** = 35 ml/kg + 500 ml training buffer.
- **Workout picks**: filter by location, level band, equipment, and goal tags. Score = goal match (+5) + equipment match (+3) + level exact (+2) + duration fits available time (+1) + featured (+1).
- **Diet plan**: prefer exact goal/budget/diet match, else nearest by daily kcal.
- **Daily discipline**: hydration + sleep are mandatory; low sleep adds a no-screens task; spare-time bonuses for meditation + journaling.

### Transformation (XP / streaks / achievements)

Located in [`apps/api/src/services/transformation.ts`](apps/api/src/services/transformation.ts).

- **Levels** are 250 XP each.
- **Streaks** are tracked per UTC day with the rule: same-day re-activity → no change; +1 calendar day → increment; gap → reset to 1. A subtle first-day bug ("streak stayed at 0 after the very first workout") was caught during smoke testing and fixed.
- **Transformation score** = `xp × 0.6 + longestStreak × 25` — rewards consistency more than raw output.
- **Achievements** are evaluated on every session completion against a small set of explicit rules in `matches()`.

### Auth

- JWT issued on register / login.
- Token stored in `localStorage` (`ph-token`) by the web app, attached to every API call via an Axios interceptor.
- Server-side validation: `requireAuth` middleware verifies the token and exposes `userId` / `userEmail` on the request.

### API response envelope

Every API endpoint returns:

```jsonc
{ "success": true,  "data": { … }, "error": null }
// or
{ "success": false, "data": null, "error": "Message", "details": {...} }
```

The web client unwraps via `apiGet` / `apiPost` helpers.

---

## Troubleshooting

**"Loading…" stuck on the onboarding page**
This was a real bug — fixed. The web auth store now sets `loading: false` after `login()` / `register()` so the onboarding effect can run. If you cloned an older commit, pull the latest `main`.

**Stale token from a previous build / rotated JWT_SECRET**
The Axios response interceptor now auto-clears `ph-token` from localStorage whenever the API returns 401. The login/register pages also redirect away if you're already logged in. You should never get stuck in a loop. If you do, manually clear `localStorage` for the site.

**`migrate reset` is blocked**
Prisma now refuses destructive ops without `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION`. For local dev, prefer `npm run db:push` (idempotent schema sync) and re-run `npm run db:seed` (all upserts).

**AI Coach panel shows "AI Coach is disabled"**
That's the intended fallback. Add `ANTHROPIC_API_KEY=...` to `.env` and restart the API. Everything else continues to work whether the key is set or not.

**`Invalid environment configuration: DATABASE_URL/JWT_SECRET Required`**
The API now walks up from `apps/api/` to find the repo-root `.env`. If the API still can't find env vars, make sure you have a `.env` at the repo root (not just in `apps/api/`).

**Port already in use**
- API on 4000 (`API_PORT`), web on 3000. Change in `.env` or `next dev -p 3001`.

**Stop everything**
```bash
pkill -f "node dist/index.js"; pkill -f "next-server"; pkill -f "next start"
docker compose down
```

---

## Production checklist

- [ ] Set a long, random `JWT_SECRET` (≥ 32 bytes from `openssl rand -base64 32`).
- [ ] Switch `npm run db:push` for `npm run db:migrate` and commit the migration files.
- [ ] Set `NODE_ENV=production`.
- [ ] Set `ANTHROPIC_API_KEY` only if you intend to enable the AI Coach.
- [ ] Use managed Postgres (Neon / Supabase / RDS) and back it up.
- [ ] Run the web app behind a CDN and set `NEXT_PUBLIC_API_URL` to your API origin.
- [ ] Lock down CORS by setting `WEB_URL` to your frontend origin.
- [ ] Front the API with a reverse proxy or load balancer.

---

## Philosophy

PowerHouse is built around discipline, self-respect, and consistency — **not**
violence or fear. Boxing modules are framed as fitness, reflex training, and
self-defense awareness. The optional Coach's system prompt enforces those
guardrails explicitly. The app's job is to make you stronger, healthier, more
disciplined, and more confident — one rep at a time.
