# Contributing to ExpenseFlow

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **PostgreSQL** (or a free [Neon](https://neon.tech) account)
- **Google OAuth credentials** from [Google Cloud Console](https://console.cloud.google.com)
- **OpenAI API key** from [OpenAI Platform](https://platform.openai.com)

### Local Setup

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/expanse-tracker.git
cd expanse-tracker

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Fill in your credentials

# 4. Setup database
npx prisma db push
npx prisma generate

# 5. Start dev server
npm run dev
```

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feat/add-tag-filter` — new feature
- `fix/date-parse-error` — bug fix
- `docs/update-readme` — documentation
- `refactor/expense-form` — code refactor
- `ci/add-test-job` — CI/CD changes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): add new feature
fix(scope): fix a bug
docs: update documentation
chore: maintenance task
ci: CI/CD changes
refactor: code restructuring
```

### Before Submitting a PR

Run the full validation suite:

```bash
npm run validate
```

This runs:
1. `npm run type-check` — TypeScript type verification
2. `npm run lint` — ESLint code quality checks
3. `npm run build` — Production build verification

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear, atomic commits
3. Ensure `npm run validate` passes
4. Open a PR using the provided template
5. Wait for CI checks to pass
6. Request review

## Code Style

- **TypeScript** — strict mode enabled, no `any` types
- **React** — functional components with hooks only
- **Tailwind CSS** — utility-first, dark mode support required
- **Server Actions** — for all data mutations (`'use server'`)
- **Prisma** — for all database queries

## Project Structure

```
app/            → Pages and server actions (Next.js App Router)
components/     → React components (client and server)
lib/            → Shared utilities, auth config, Prisma client
prisma/         → Database schema
public/         → Static assets
```

## Questions?

Open a [Discussion](https://github.com/leolunardelli/expanse-tracker/discussions) or an [Issue](https://github.com/leolunardelli/expanse-tracker/issues).
