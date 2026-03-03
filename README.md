# ExpenseFlow

<div align="center">

![ExpenseFlow](https://img.shields.io/badge/ExpenseFlow-AI--Powered%20Finance-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHptLjMxLTguODZjLTEuNzctLjQ1LTIuMzQtLjk0LTIuMzQtMS42NyAwLS44NC43OS0xLjQzIDIuMS0xLjQzIDEuMzggMCAxLjkuNjYgMS45NCAxLjY0aDEuNzFjLS4wNS0xLjM0LS44Ny0yLjU3LTIuNDktMi45N1Y1aC0yLjN2MS40M2MtMS41Ny4zNC0yLjgzIDEuMzctMi44MyAyLjkzIDAgMS44NyAxLjU1IDIuOCAzLjgxIDMuMzQgMi4wMi40OCAyLjQxIDEuMTkgMi40MSAxLjkzIDAgLjU1LS4zOSAxLjQzLTIuMSAxLjQzLTEuNjEgMC0yLjIzLS43Mi0yLjMyLTEuNjRINy42NWMuMSAxLjcxIDEuMzcgMi42NyAyLjk3IDIuOTlWMTloMi4zdi0xLjQ2YzEuNTgtLjMxIDIuODUtMS4zIDIuODUtMi45MSAwLTIuMy0xLjk3LTMuMDgtMy40Ni0zLjQ5eiIvPjwvc3ZnPg==)

**Full-stack expense tracker with AI-powered insights, built with Next.js 15, TypeScript, PostgreSQL & OpenAI.**

[![CI](https://github.com/leolunardelli/expanse-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/leolunardelli/expanse-tracker/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-00C853?style=flat-square)](https://expanseflow.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript)](tsconfig.json)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## Overview

ExpenseFlow is a production-grade personal finance application that demonstrates modern full-stack development practices: server components, server actions, AI integration, CI/CD pipelines, and cloud-native deployment.

### Key Capabilities

- **Expense CRUD** with tags, notes, recurring schedules, and AI auto-categorization
- **AI Insights** — spending predictions, weekly analysis, personalized saving tips (GPT-4o-mini)
- **Analytics Dashboard** — interactive charts (pie, bar, area, year-over-year comparison)
- **Budget Management** — category budgets with threshold alerts
- **Monthly Reports** — exportable summaries with CSV/JSON download
- **Search & Filter** — full-text search, multi-criteria filters, URL-synced pagination
- **Settings** — currency preference, profile management
- **Dark Mode** — system-aware theme with manual toggle
- **PWA** — installable progressive web app with service worker

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | Server components, server actions, routing |
| **Language** | TypeScript 5 (strict) | End-to-end type safety |
| **UI** | React 19 + Tailwind CSS 3 | Component library + utility-first styling |
| **Database** | PostgreSQL (Neon) | Serverless cloud database |
| **ORM** | Prisma 6 | Type-safe database access + migrations |
| **Auth** | NextAuth.js 4 | Google OAuth with database sessions |
| **AI** | OpenAI GPT-4o-mini | Categorization, predictions, insights |
| **Charts** | Recharts 3 | Interactive data visualization |
| **Deployment** | Vercel | Edge network, preview deploys, analytics |
| **CI/CD** | GitHub Actions | Lint → Type-check → Build pipeline |

---

## Getting Started

### Prerequisites

| Requirement | Minimum |
|-------------|---------|
| Node.js | >= 18 |
| npm | >= 9 |
| PostgreSQL | Any (or free [Neon](https://neon.tech) tier) |
| Google OAuth | [Cloud Console](https://console.cloud.google.com) credentials |
| OpenAI | [API key](https://platform.openai.com) |

### Setup

```bash
# Clone
git clone https://github.com/leolunardelli/expanse-tracker.git
cd expanse-tracker

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your credentials

# Database
npx prisma db push
npx prisma generate

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See [`.env.example`](.env.example) for the full list. Required:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Session encryption key |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000` for dev) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `OPENAI_API_KEY` | OpenAI API key |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (Prisma generate + Next.js) |
| `npm run lint` | ESLint code quality check |
| `npm run type-check` | TypeScript type verification |
| `npm run validate` | Full pipeline: type-check → lint → build |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## CI/CD

Every push to `main` and every pull request triggers the CI pipeline via GitHub Actions:

```
┌─────────┐     ┌──────────────┐     ┌─────────┐
│  Lint   │────▶│  Type Check  │────▶│  Build  │
└─────────┘     └──────────────┘     └─────────┘
```

- **Lint** — ESLint with TypeScript rules
- **Type Check** — `tsc --noEmit` in strict mode
- **Build** — full `next build` with artifact upload

Additionally:
- **Dependabot** keeps npm and GitHub Actions dependencies updated weekly
- **Concurrency control** cancels outdated CI runs

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## Project Structure

```
├── .github/
│   ├── workflows/ci.yml        # CI pipeline
│   ├── dependabot.yml          # Dependency automation
│   ├── ISSUE_TEMPLATE/         # Bug report & feature request
│   └── pull_request_template.md
├── app/
│   ├── actions/                # Server actions
│   │   ├── expenses.ts         # CRUD + filters + tags
│   │   ├── analytics.ts        # Chart data queries
│   │   ├── ai.ts               # AI insight generation
│   │   ├── budget.ts           # Budget management
│   │   ├── export.ts           # CSV/JSON export
│   │   └── yoy.ts              # Year-over-year stats
│   ├── analytics/              # Analytics page
│   ├── budget/                 # Budget page
│   ├── insights/               # AI insights page
│   ├── auth/signin/            # Custom sign-in page
│   ├── api/auth/               # NextAuth API route
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Dashboard
├── components/
│   ├── ai/                     # AI insight components
│   ├── budget/                 # Budget components
│   ├── charts/                 # Recharts visualizations
│   ├── filters/                # Search, filter & pagination
│   ├── tags/                   # Tag & note inputs
│   ├── ExpenseForm.tsx         # Add expense form
│   ├── EditExpenseModal.tsx    # Edit expense modal
│   └── Header.tsx              # Navigation header
├── lib/
│   ├── ai.ts                   # OpenAI client
│   ├── auth.ts                 # NextAuth configuration
│   ├── currency.ts             # Currency formatting
│   ├── prisma.ts               # Prisma client singleton
│   └── useFilterParams.ts      # URL-synced filter hook
├── prisma/
│   └── schema.prisma           # Database schema
├── CONTRIBUTING.md             # Contribution guide
├── SECURITY.md                 # Security policy
└── LICENSE                     # MIT License
```

---

## Features

### Dashboard
- Quick expense entry with tags, notes, and recurring schedule
- Real-time stats cards (total, count, categories)
- AI-generated quick insights
- Budget alert notifications

### Analytics
- Category distribution (pie chart)
- Monthly spending comparison (bar chart)
- 30-day spending trend (area chart)
- Year-over-year comparison
- Summary metric cards

### AI Insights
- End-of-month spending predictions
- Week-over-week comparison with percentage change
- 3 personalized saving tips with estimated savings
- Behavioral spending assessments

### Budget Management
- Per-category budget goals
- Visual progress tracking
- Threshold alerts (75%, 90%, 100%)
- Monthly reset cycle

### Search & Filters
- Full-text search across descriptions, tags, and notes
- Filter by category, tag, date range, amount range
- Sort by date, amount, or category
- URL-synced state (shareable filtered views)
- Paginated results

### Expense Tags & Notes
- Color-coded tag chips with keyboard input
- Freeform notes with character counter
- Tag-based filtering
- Search across notes content

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Server Actions** over API routes | Collocated mutations, automatic revalidation, reduced boilerplate |
| **Database sessions** over JWT | Revocable sessions, no token size limits, simpler security model |
| **Prisma** over raw SQL | Type-safe queries generated from schema, migration support |
| **GPT-4o-mini** over GPT-4 | Cost-efficient for structured financial analysis |
| **URL-synced filters** | Shareable state, browser back/forward support, SSR-compatible |
| **Strict TypeScript** | Catch bugs at compile time; `noUnusedLocals`, `noUnusedParameters` enabled |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow, branch naming, commit conventions, and PR process.

---

## License

[MIT](LICENSE) — Leonardo Lunardelli

---

<div align="center">

**Built with Next.js 15 · TypeScript · PostgreSQL · OpenAI**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/leolunardelli/expanse-tracker)

</div>
