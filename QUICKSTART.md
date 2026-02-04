# 🚀 Quick Start - 5 Minutes

## Step 1: Database URL (2 min)

Choose one:

**Neon (Fastest):**
```
https://neon.tech → Sign up → Copy connection string
postgresql://...@ep-...neon.tech/dbname?sslmode=require
```

**Supabase:**
```
https://supabase.com → New project → Settings → Copy URL
postgresql://...@db...supabase.co:5432/...
```

## Step 2: Configure .env.local (2 min)

Open `.env.local` in your root folder and fill in:

```env
DATABASE_URL="paste-your-database-url-here"
NEXTAUTH_SECRET="openssl rand -base64 32"
GOOGLE_CLIENT_ID="get-from-google-cloud-console"
GOOGLE_CLIENT_SECRET="get-from-google-cloud-console"
OPENAI_API_KEY="sk-your-key"  # optional
```

## Step 3: Init Database (1 min)

```bash
cd c:\Users\leonardo.lunardelli\expanse-tracker
npx prisma migrate dev --name init
```

## Step 4: Run Locally

```bash
npm run dev
# Visit http://localhost:3000
```

---

## 🔗 Get Credentials

### Google OAuth
1. https://console.cloud.google.com
2. New Project
3. Enable "Google+ API"
4. Credentials → OAuth 2.0 Client ID
5. Web application
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID & Secret

### OpenAI Key
1. https://platform.openai.com/account/api-keys
2. Create new key
3. Copy to `OPENAI_API_KEY`

---

## ✅ Testing Checklist

- [ ] `npm run dev` works
- [ ] Can visit http://localhost:3000
- [ ] Redirected to /auth/signin
- [ ] Can sign in with Google
- [ ] Can add expense
- [ ] Can see stats
- [ ] Can see AI insights
- [ ] Can delete expense

---

## 🌐 Deploy to Vercel

```bash
git add .
git commit -m "upgrade to next.js"
git push

# Then:
# 1. vercel.com
# 2. Import repo
# 3. Add all env vars
# 4. Deploy!
```

**That's it!** 🎉
