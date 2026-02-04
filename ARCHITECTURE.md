# 📊 Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Client                         │
│  (Next.js client components + Tailwind CSS UI)             │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │ HTTPS
                              │
┌─────────────────────────────▼───────────────────────────────┐
│           Next.js 15 Server (Your App)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  App Router                                         │   │
│  │  - /                   → Home (protected)           │   │
│  │  - /auth/signin        → Google OAuth signin        │   │
│  │  - /api/auth/[...nextauth] → NextAuth handler      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Server Actions (app/actions/)                      │   │
│  │  - createExpense()     → Add expense                │   │
│  │  - deleteExpense()     → Remove expense             │   │
│  │  - getExpenses()       → Fetch list                 │   │
│  │  - getExpenseStats()   → Calculate totals           │   │
│  │  - getAIInsights()     → Generate insights          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  NextAuth.js (Authentication)                       │   │
│  │  - Google OAuth provider                            │   │
│  │  - Session management                              │   │
│  │  - JWT tokens                                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                ┌─────────────┼──────────────┐
                │             │              │
                │             │              │
    ┌───────────▼──┐  ┌───────▼────┐  ┌─────▼─────────┐
    │   PostgreSQL │  │ Google API │  │  OpenAI API   │
    │  (Neon or    │  │  (OAuth)   │  │  (GPT-4o-min) │
    │  Supabase)   │  │            │  │               │
    └──────────────┘  └────────────┘  └───────────────┘
```

## Data Flow

### Creating an Expense

```
User (Client)
    ↓ (fills form)
ExpenseForm Component
    ↓ (submits formData)
createExpense() Server Action
    ↓
Check Authentication (NextAuth)
    ↓
AI Categorization (OpenAI)
    ↓ if category == "Other"
Store in Database (Prisma)
    ↓
Revalidate Page
    ↓
User sees updated list
```

### Viewing Dashboard

```
User (Client)
    ↓ (requests /home)
Next.js Server Renders page.tsx
    ↓
Check Session (NextAuth)
    ↓ not authenticated?
Redirect to /auth/signin
    ↓ authenticated
Fetch Expenses (getExpenses)
    ↓
Fetch Stats (getExpenseStats)
    ↓
Fetch AI Insights (getAIInsights)
    ↓
OpenAI generates insights
    ↓
Render HTML + CSS + Components
    ↓
Send to Browser
```

## Component Tree

```
RootLayout
├── AuthProvider (SessionProvider)
│   ├── page.tsx (Home - Protected)
│   │   ├── Header
│   │   ├── StatsCard (x3)
│   │   │   └── Total Spent
│   │   │   └── Transactions
│   │   │   └── Categories
│   │   ├── AIInsights
│   │   │   └── AI-generated text
│   │   └── Grid
│   │       ├── ExpenseForm
│   │       │   └── Form inputs
│   │       └── ExpenseList
│   │           └── ExpenseItem (repeating)
│   │
│   └── auth/signin/page.tsx
│       └── Google OAuth Button
```

## Database Schema

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (UNIQUE)      │
│ emailVerified       │
│ image               │
│ createdAt           │
│                     │
│ Relations:          │
│ → accounts[]        │
│ → sessions[]        │
│ → expenses[]        │
└─────────────────────┘
        │
        │ 1:N
        │
┌─────────────────────┐
│     Expense         │
├─────────────────────┤
│ id (PK)             │
│ description         │
│ amount              │
│ category            │
│ date                │
│ aiCategory?         │
│ aiNote?             │
│ createdAt           │
│ updatedAt           │
│ userId (FK)         │
│                     │
│ Indexes:            │
│ [userId]            │
│ [date]              │
│ [category]          │
└─────────────────────┘

┌──────────────────────────┐
│      Account             │  NextAuth
├──────────────────────────┤
│ id, userId (FK), type    │
│ provider, token fields   │
└──────────────────────────┘

┌──────────────────────────┐
│      Session             │  NextAuth
├──────────────────────────┤
│ id, sessionToken, userId │
│ expires                  │
└──────────────────────────┘
```

## Authentication Flow

```
1. User visits /
   ├─ Not authenticated?
   └─ Redirect to /auth/signin

2. User clicks "Continue with Google"
   ├─ Redirect to Google OAuth consent
   └─ User grants permissions

3. Google redirects back
   ├─ /api/auth/callback/google
   ├─ Create User in database
   ├─ Create Account in database
   ├─ Create Session in database
   └─ Set session cookie

4. User now authenticated
   ├─ Can access protected pages
   ├─ getServerSession() returns user
   └─ Server actions work

5. Sign out
   ├─ Clear session
   ├─ Delete cookie
   └─ Redirect to signin
```

## AI Feature Flow

```
User adds expense:
  Description: "Coffee at Starbucks"
  Category: "Other"
  
↓

categorizeExpense() called
  
↓

OpenAI API Request:
  Model: gpt-4o-mini
  Prompt: "Categorize into: Food, Transport, ..."
  
↓

OpenAI Response:
  "Food"
  
↓

Stored in database:
  category: "Food"
  aiCategory: "Food" (for reference)

---

User views dashboard:

↓

getAIInsights() called

↓

Fetch recent expenses from DB

↓

OpenAI API Request:
  Model: gpt-4o-mini
  Prompt: "Analyze these expenses..."
  Data: { total, byCategory, recent }
  
↓

OpenAI Response:
  "You spent $500 mainly on food..."
  
↓

Display in AIInsights component
```

## Security Model

```
┌──────────────────────────┐
│   HTTPS Connection       │ (Encrypted transit)
└──────────────────────────┘
           │
┌──────────▼──────────────────────────────┐
│   Environment Variables (.env.local)    │
├─────────────────────────────────────────┤
│ DATABASE_URL        → DB connection     │
│ NEXTAUTH_SECRET     → Session encryption│
│ NEXTAUTH_URL        → OAuth redirect    │
│ GOOGLE_CLIENT_ID    → OAuth client ID   │
│ GOOGLE_CLIENT_SECRET → OAuth secret     │
│ OPENAI_API_KEY      → API authentication│
└─────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────┐
│   Server-Side Operations                │
├─────────────────────────────────────────┤
│ API keys never exposed to client        │
│ Authentication checks on every request  │
│ Database queries validated              │
│ User isolation enforced                 │
└─────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────┐
│   Database (PostgreSQL)                 │
├─────────────────────────────────────────┤
│ Each user only sees their own data      │
│ userId foreign key enforced             │
│ Passwords never stored (OAuth)          │
│ SSL connection required                 │
└─────────────────────────────────────────┘
```

## Deployment Architecture (Vercel)

```
GitHub Repository
    ↓ (push)
Vercel Git Integration
    ↓
Vercel Build Process
    ├─ npm install
    ├─ npm run build
    └─ Run tests
    ↓
Vercel Infrastructure
    ├─ Edge Network (CDN)
    ├─ Serverless Functions
    └─ Managed Database Connection
    ↓
Your App Live at:
    https://yourapp.vercel.app
    
External Services Connected:
├─ PostgreSQL (Neon/Supabase)
├─ Google OAuth
└─ OpenAI API
```

## File Organization

```
Source Code
├── app/                (Next.js App Router)
│   ├── page.tsx        (Home page)
│   ├── layout.tsx      (Root wrapper)
│   ├── globals.css     (Styles)
│   ├── api/
│   │   └── auth/       (NextAuth routes)
│   ├── actions/        (Server functions)
│   │   ├── expenses.ts (CRUD operations)
│   │   └── ai.ts       (AI operations)
│   ├── auth/
│   │   └── signin/     (Auth page)
│   └── providers.tsx   (SessionProvider wrapper)
│
├── components/         (React Components)
│   ├── AIInsights.tsx
│   ├── ExpenseForm.tsx
│   ├── ExpenseList.tsx
│   └── StatsCard.tsx
│
├── lib/               (Core logic)
│   ├── prisma.ts      (DB client)
│   ├── auth.ts        (NextAuth config)
│   └── ai.ts          (OpenAI integration)
│
├── prisma/            (Database)
│   └── schema.prisma  (Schema definition)
│
└── public/            (Static files)

Configuration
├── next.config.ts     (Next.js config)
├── tsconfig.json      (TypeScript)
├── tailwind.config.js (Tailwind)
├── postcss.config.js  (PostCSS)
├── eslint.config.js   (Linting)
└── .env.local         (Secrets)
```

---

This architecture provides:
- 🔐 **Security**: Authentication, authorization, encryption
- ⚡ **Performance**: Server rendering, caching, CDN
- 🔄 **Scalability**: Serverless functions, managed DB
- 🛠️ **Maintainability**: Type safety, clear separation of concerns
- 🚀 **Deployability**: Single-click Vercel deployment
