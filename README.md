# ExpenseFlow 💰

<div align="center">

![ExpenseFlow](https://img.shields.io/badge/ExpenseFlow-AI--Powered%20Finance-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHptLjMxLTguODZjLTEuNzctLjQ1LTIuMzQtLjk0LTIuMzQtMS42NyAwLS44NC43OS0xLjQzIDIuMS0xLjQzIDEuMzggMCAxLjkuNjYgMS45NCAxLjY0aDEuNzFjLS4wNS0xLjM0LS44Ny0yLjU3LTIuNDktMi45N1Y1aC0yLjN2MS40M2MtMS41Ny4zNC0yLjgzIDEuMzctMi44MyAyLjkzIDAgMS44NyAxLjU1IDIuOCAzLjgxIDMuMzQgMi4wMi40OCAyLjQxIDEuMTkgMi40MSAxLjkzIDAgLjU1LS4zOSAxLjQzLTIuMSAxLjQzLTEuNjEgMC0yLjIzLS43Mi0yLjMyLTEuNjRINy42NWMuMSAxLjcxIDEuMzcgMi42NyAyLjk3IDIuOTlWMTloMi4zdi0xLjQ2YzEuNTgtLjMxIDIuODUtMS4zIDIuODUtMi45MSAwLTIuMy0xLjk3LTMuMDgtMy40Ni0zLjQ5eiIvPjwvc3ZnPg==)

### 🚀 A Full-Stack Expense Tracker with AI-Powered Insights

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-00C853?style=for-the-badge)](https://y-nine-flame.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=flat-square&logo=openai)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google OAuth** | Secure authentication with NextAuth.js database sessions |
| 🗄️ **PostgreSQL Database** | Cloud-hosted on Neon with Prisma ORM |
| 🤖 **AI-Powered Insights** | OpenAI GPT-4o-mini for spending analysis & predictions |
| 📊 **Interactive Charts** | Recharts-powered pie, bar, and area charts |
| ⚡ **Server Actions** | Next.js 15 App Router with server-side data mutations |
| 🎨 **Modern UI** | Tailwind CSS with responsive design |

---

## ✨ Application Pages

### 🏠 Dashboard (`/`)
- Quick expense entry with date picker & category selection
- Real-time stats: total spending, monthly average, expense count
- AI quick insights displayed on dashboard
- Full CRUD operations: add, edit, delete expenses

### 📈 Analytics (`/analytics`)
- **Category Pie Chart** - spending breakdown by category
- **Monthly Bar Chart** - compare spending month-over-month
- **30-Day Trend Chart** - daily spending patterns
- **Summary Cards** - key metrics at a glance

### 🧠 AI Insights (`/insights`)
- **Monthly Predictions** - AI predicts end-of-month spending total
- **Weekly Comparison** - this week vs last week with % change
- **Saving Tips** - 3 personalized recommendations with potential savings
- **Smart Assessments** - AI commentary on spending habits

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 3** | Styling |
| **Recharts 2** | Data visualization |
| **Lucide React** | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| **Next.js Server Actions** | API layer |
| **NextAuth.js 4** | Authentication |
| **Prisma 6** | Database ORM |
| **PostgreSQL** | Database (Neon) |

### AI
| Technology | Purpose |
|------------|---------|
| **OpenAI GPT-4o-mini** | Insights, categorization, predictions |
| **Vercel AI SDK** | AI integration |

### Deployment
| Technology | Purpose |
|------------|---------|
| **Vercel** | Hosting & deployment |
| **Neon** | Serverless PostgreSQL |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)
- Google OAuth credentials ([Google Cloud Console](https://console.cloud.google.com))
- OpenAI API key ([OpenAI Platform](https://platform.openai.com))

### Environment Variables

Create `.env.local`:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# OpenAI
OPENAI_API_KEY="sk-..."
```

### Installation

```bash
# Clone repository
git clone https://github.com/leolunardelli/expanse-tracker.git
cd expanse-tracker

# Install dependencies
npm install

# Setup database
npx prisma db push
npx prisma generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
├── app/
│   ├── actions/           # Server actions
│   │   ├── expenses.ts    # CRUD operations
│   │   ├── analytics.ts   # Chart data
│   │   └── ai.ts          # AI insights
│   ├── analytics/         # Analytics page
│   ├── insights/          # AI insights page
│   ├── api/auth/          # NextAuth routes
│   └── page.tsx           # Dashboard
├── components/
│   ├── ai/                # AI components
│   ├── charts/            # Chart components
│   ├── Header.tsx         # Navigation
│   ├── ExpenseForm.tsx    # Add expense
│   └── ExpenseList.tsx    # Expense list
├── lib/
│   ├── ai.ts              # OpenAI functions
│   ├── auth.ts            # NextAuth config
│   └── prisma.ts          # Database client
├── prisma/
│   └── schema.prisma      # Database schema
└── types/
    └── next-auth.d.ts     # Type extensions
```

---

## 💡 Implementation Highlights

### Server Actions (Next.js 15)
```typescript
'use server';
export async function createExpense(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  
  await prisma.expense.create({
    data: { ...expenseData, userId: session.user.id }
  });
  revalidatePath('/');
}
```

### AI Integration
```typescript
export async function generateSavingTips(expenses: ExpenseData[]) {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `Analyze spending and provide 3 saving tips...`,
  });
  return JSON.parse(text);
}
```

### Database Schema
```prisma
model Expense {
  id          String   @id @default(cuid())
  description String
  amount      Float
  category    String
  date        DateTime
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## 🔜 Roadmap

- [x] Core CRUD operations
- [x] Google OAuth authentication
- [x] Analytics dashboard with charts
- [x] AI-powered insights
- [ ] Budget goals & alerts
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Mobile PWA

---

## 👨‍💻 Author

**Leonardo Lunardelli**

[![GitHub](https://img.shields.io/badge/GitHub-leolunardelli-181717?style=flat-square&logo=github)](https://github.com/leolunardelli)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-leolunardelli-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/leolunardelli)
[![Twitter](https://img.shields.io/badge/Twitter-lewowzera-1DA1F2?style=flat-square&logo=twitter)](https://twitter.com/lewowzera)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ using Next.js 15, TypeScript, PostgreSQL & OpenAI**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/leolunardelli/expanse-tracker)

</div>
