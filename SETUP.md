# 🚀 Expense Tracker - Production Setup Guide

## ✅ Completed Steps

Your project has been successfully migrated from Vite to **Next.js** with:
- ✅ Next.js 15 app directory structure
- ✅ Prisma ORM configured
- ✅ NextAuth.js authentication setup
- ✅ OpenAI integration for AI features
- ✅ Database schema created
- ✅ Server actions implemented
- ✅ React components built
- ✅ Sign-in page created

---

## 📋 Next Steps: Database & Credentials Setup

### STEP 1: Get Free PostgreSQL Database

Choose one provider:

#### Option A: Neon (Recommended - Faster Setup)
1. Go to https://neon.tech
2. Sign up with GitHub/Google
3. Create a new project
4. Copy the connection string that looks like:
   ```
   postgresql://user:password@ep-xxx-region.neon.tech/dbname?sslmode=require
   ```

#### Option B: Supabase
1. Go to https://supabase.com
2. Sign up with GitHub/Google
3. Create a new project
4. In Project Settings → Database, copy the connection string

---

### STEP 2: Configure Environment Variables

1. Open `.env.local` in the root directory
2. Replace the placeholder values:

```env
# Database - Paste your PostgreSQL URL here
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="generate-random-secret-key-here"

# Change to your production URL when deploying
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Setup (see instructions below)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# OpenAI API Key (optional for AI features)
OPENAI_API_KEY="sk-your-key-here"
```

---

### STEP 3: Get Google OAuth Credentials

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable "Google+ API"
4. Go to "Credentials" → Create OAuth 2.0 Client ID
5. Choose "Web application"
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://yourapp.vercel.app/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to `.env.local`

---

### STEP 4: Get OpenAI API Key (Optional)

For AI categorization and insights:
1. Go to https://platform.openai.com/account/api-keys
2. Create a new API key
3. Add to `.env.local` as `OPENAI_API_KEY`

---

### STEP 5: Initialize Database

Run these commands in order:

```bash
# Install Prisma CLI (if not already installed)
npm install -D prisma

# Create initial migration
npx prisma migrate dev --name init

# Open Prisma Studio to view database
npx prisma studio
```

This will:
- ✅ Connect to your PostgreSQL database
- ✅ Run all migrations (create tables)
- ✅ Generate Prisma client
- ✅ Open Studio at http://localhost:5555

---

## 🚀 Running Locally

```bash
# Install dependencies (already done)
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Visit http://localhost:3000 and:
1. ✅ Should redirect to sign-in
2. ✅ Click "Continue with Google"
3. ✅ Authenticate with your Google account
4. ✅ Add an expense (AI will auto-categorize it!)
5. ✅ See AI insights
6. ✅ Delete expenses
7. ✅ Data persists in your database!

---

## 📦 Project Structure

```
expanse-tracker/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with SessionProvider
│   ├── page.tsx                 # Home page (protected)
│   ├── globals.css              # Global styles
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts  # NextAuth handler
│   ├── actions/
│   │   ├── expenses.ts          # Server actions for expenses
│   │   └── ai.ts                # Server actions for AI
│   └── auth/
│       └── signin/page.tsx      # Sign-in page
├── components/                  # React components
│   ├── AIInsights.tsx          # AI insights display
│   ├── ExpenseForm.tsx         # Form to add expenses
│   ├── ExpenseList.tsx         # List of expenses
│   └── StatsCard.tsx           # Statistics cards
├── lib/                         # Utilities & configs
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth configuration
│   └── ai.ts                   # AI functions
├── prisma/
│   └── schema.prisma           # Database schema
├── .env.local                  # Environment variables (DO NOT COMMIT)
├── next.config.ts              # Next.js config
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind CSS config
└── package.json                # Dependencies
```

---

## 🌐 Deploy to Vercel

### 1. Push to GitHub

```bash
cd c:\Users\leonardo.lunardelli\expanse-tracker

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "feat: upgrade to Next.js with database and AI features"

# Add GitHub remote and push
git remote add origin https://github.com/yourusername/expanse-tracker.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repo
4. In "Environment Variables", add all from `.env.local`:
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL (use your Vercel domain: `https://yourapp.vercel.app`)
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - OPENAI_API_KEY
5. Click Deploy!

### 3. Update Google OAuth for Production

1. Go back to Google Cloud Console
2. Add your Vercel URL to Authorized redirect URIs:
   - `https://yourapp.vercel.app/api/auth/callback/google`

---

## 🧪 Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db execute --stdin
# Type: SELECT 1;
```

### Prisma Client Errors
```bash
# Regenerate Prisma client
npx prisma generate
```

### NextAuth Not Working
- Ensure `NEXTAUTH_SECRET` is set and same in all environments
- Check GOOGLE_CLIENT_ID/SECRET are correct
- Verify callback URL matches Google OAuth settings

### AI Features Not Working
- Ensure OPENAI_API_KEY is set
- Check that API key has "gpt-4o-mini" model access

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema to database
npm run db:studio    # Open Prisma Studio GUI
```

---

## 🎯 Feature Summary

✅ **Authentication**: Google OAuth via NextAuth  
✅ **Database**: PostgreSQL with Prisma  
✅ **Expenses**: Create, read, delete with server actions  
✅ **AI Features**: Auto-categorization + spending insights  
✅ **Stats**: Total spent, transaction count, category breakdown  
✅ **Responsive UI**: Mobile-first with Tailwind CSS  
✅ **Type-safe**: Full TypeScript support  

---

## 🚀 Production Checklist

- [ ] PostgreSQL database created (Neon/Supabase)
- [ ] All `.env.local` variables configured
- [ ] Google OAuth credentials added
- [ ] `npx prisma migrate dev --name init` executed
- [ ] Local dev server working (`npm run dev`)
- [ ] Can sign in with Google
- [ ] Can add/delete expenses
- [ ] GitHub repo created and code pushed
- [ ] Vercel deployment complete
- [ ] Environment variables added to Vercel
- [ ] Google OAuth updated with production URL
- [ ] Testing complete on production URL

---

**Ready to go live! 🚀 Follow the steps above and your expense tracker will be production-ready with database, auth, and AI features.**
