# ExpenseFlow 💰

<div align="center">

![ExpenseFlow Logo](https://img.shields.io/badge/ExpenseFlow-Smart%20Money%20Management-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHptLjMxLTguODZjLTEuNzctLjQ1LTIuMzQtLjk0LTIuMzQtMS42NyAwLS44NC43OS0xLjQzIDIuMS0xLjQzIDEuMzggMCAxLjkuNjYgMS45NCAxLjY0aDEuNzFjLS4wNS0xLjM0LS44Ny0yLjU3LTIuNDktMi45N1Y1aC0yLjN2MS40M2MtMS41Ny4zNC0yLjgzIDEuMzctMi44MyAyLjkzIDAgMS44NyAxLjU1IDIuOCAzLjgxIDMuMzQgMi4wMi40OCAyLjQxIDEuMTkgMi40MSAxLjkzIDAgLjU1LS4zOSAxLjQzLTIuMSAxLjQzLTEuNjEgMC0yLjIzLS43Mi0yLjMyLTEuNjRINy42NWMuMSAxLjcxIDEuMzcgMi42NyAyLjk3IDIuOTlWMTloMi4zdi0xLjQ2YzEuNTgtLjMxIDIuODUtMS4zIDIuODUtMi45MSAwLTIuMy0xLjk3LTMuMDgtMy40Ni0zLjQ5eiIvPjwvc3ZnPg==)

**A beautiful, modern expense tracking application built with React & TypeScript**

[![React](https://img.shields.io/badge/React-19.x-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [License](#-license)

</div>

---

## ✨ Features

### 📊 Smart Dashboard
- **Real-time statistics** - Total expenses, averages, and top categories at a glance
- **Interactive charts** - Beautiful pie charts and area charts powered by Recharts
- **Category breakdown** - Visual progress bars showing spending distribution

### 💳 Expense Management
- **Quick add form** - Add expenses in seconds with smart category icons
- **Edit & delete** - Full CRUD operations with smooth animations
- **Category filtering** - Filter expenses by any category instantly

### 📈 Advanced Analytics
- **Monthly comparisons** - Stacked bar charts showing spending trends
- **Smart insights** - Auto-generated tips based on spending patterns
- **Category statistics** - Detailed breakdown with percentages

### 🎨 Premium Design
- **Dark mode** - Beautiful dark theme with smooth transitions
- **Glassmorphism** - Modern glass-effect cards and components
- **Responsive** - Fully responsive design for all devices
- **Animations** - Smooth fade-in and slide animations throughout

### 💾 Data Management
- **Local storage** - Your data persists between sessions
- **Export options** - Download expenses as CSV or JSON
- **Clear all** - Safely reset your data when needed

---

## 🎯 Demo

### Light Mode
![ExpenseFlow Light Mode](https://via.placeholder.com/800x450/f8fafc/6366f1?text=ExpenseFlow+Light+Mode)

### Dark Mode
![ExpenseFlow Dark Mode](https://via.placeholder.com/800x450/0f172a/818cf8?text=ExpenseFlow+Dark+Mode)

---

## 🚀 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/expenseflow.git

# Navigate to the project
cd expenseflow

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript 5** | Type Safety |
| **Tailwind CSS 3** | Styling |
| **Vite 7** | Build Tool |
| **React Hook Form** | Form Management |
| **Zod** | Schema Validation |
| **Recharts** | Data Visualization |
| **Context API** | State Management |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── analytics/        # Analytics dashboard
│   ├── common/           # Shared components (Modal, Spinner, etc.)
│   ├── dashboard/        # Main dashboard & charts
│   ├── expenses/         # Expense forms & lists
│   ├── filters/          # Category filters
│   ├── layout/           # Header & Sidebar
│   └── settings/         # Settings page
├── context/
│   ├── ExpenseContext    # Expense state management
│   └── ThemeContext      # Theme (dark/light) management
├── hooks/
│   └── useLocalStorage   # Local storage hook
├── types/
│   └── index.ts          # TypeScript type definitions
├── utils/
│   ├── stats.ts          # Statistics calculations
│   └── validation.ts     # Zod validation schemas
├── App.tsx               # Main app component
├── main.tsx              # App entry point
└── index.css             # Global styles & Tailwind
```

---

## 🎨 Customization

### Theme Colors

Customize the color palette in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Your primary color palette
  },
  accent: {
    // Your accent color palette
  }
}
```

### Categories

Add new expense categories in `src/types/index.ts`:

```typescript
export type Category = 
  | 'food' 
  | 'transport' 
  | 'your-new-category';
```

---

## 🔜 Roadmap

- [ ] **Budget Goals** - Set monthly spending limits
- [ ] **Recurring Expenses** - Track subscriptions automatically
- [ ] **Multi-currency** - Support for different currencies
- [ ] **Cloud Sync** - Sync data across devices
- [ ] **Receipt Scanning** - OCR for automatic expense entry
- [ ] **Reports** - Monthly/yearly PDF reports

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ using React & TypeScript**

[⬆ Back to top](#expenseflow-)

</div>
