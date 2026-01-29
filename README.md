# Expense Tracker

A modern expense tracking application built with React, TypeScript, and Tailwind CSS. Track your daily spending, organize by categories, and visualize your expenses.

**Live Demo:** https://y-nine-flame.vercel.app

## 🎯 Features

### Phase 1 (Complete) ✅
- ✅ **Add Expenses** - Create new expense records with amount, category, date, and description
- ✅ **Delete Expenses** - Remove expenses from the tracker
- ✅ **Category Filtering** - Filter expenses by category (Food, Transport, Entertainment, etc.)
- ✅ **Data Persistence** - All expenses saved to browser's localStorage (survives page refresh)
- ✅ **Empty State UI** - Helpful message when no expenses exist
- ✅ **Professional Styling** - Built with Tailwind CSS for modern, responsive design
- ✅ **Deployed Live** - Available on Vercel for instant access

### Phase 2 (Coming Soon) 🚀
- Form validation with React Hook Form + Zod
- Loading and error states
- Dashboard with summary statistics
- Charts (Recharts) - Category breakdown visualization
- Dark mode toggle
- Date range filtering
- Unit tests with React Testing Library

## 🚀 Tech Stack

- **React 19** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **Context API + useReducer** - Global state management (no Redux needed)
- **localStorage** - Client-side data persistence

## 🛠️ Development

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open http://localhost:5173

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/              # Reusable UI (EmptyState, Button, etc.)
│   ├── expenses/            # Expense-specific components
│   │   ├── ExpenseForm.tsx     # Form to add expenses
│   │   └── ExpenseList.tsx     # List to display & delete
│   ├── filters/             # Filter components
│   │   └── CategoryFilter.tsx  # Category selector
│   ├── dashboard/           # Dashboard (Phase 2)
│   └── layout/              # Layout wrapper
├── context/
│   └── ExpenseContext.tsx   # Global state with useReducer
├── hooks/
│   └── useLocalStorage.ts   # Custom hook for persistence
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/                   # Helper functions
├── App.tsx                  # Main component
├── main.tsx                 # Entry point with ExpenseProvider
└── index.css                # Tailwind styles
```

## 🔄 State Management Flow

```
ExpenseProvider (global state)
  ├─ state.expenses: Expense[]
  ├─ state.filters: { category, dateRange }
  └─ dispatch(action) → expenseReducer
      ├─ ADD_EXPENSE
      ├─ DELETE_EXPENSE
      ├─ SET_CATEGORY_FILTER
      ├─ SET_LOADING
      └─ SET_ERROR

App.tsx
  ├─ useExpenseContext()
  ├─ handlers: add/delete/filter
  └─ passes props to child components

Components
  ├─ ExpenseForm → dispatches ADD_EXPENSE
  ├─ ExpenseList → displays filtered expenses
  └─ CategoryFilter → dispatches SET_CATEGORY_FILTER
```

## 💾 Data Persistence

Expenses are automatically saved to `localStorage` when:
- A new expense is added
- An expense is deleted
- Any state change occurs

Data is restored when the app loads, so your expenses persist across browser sessions!

## 🎓 Learning Outcomes

Building this project demonstrates:
- ✅ **React Fundamentals** - Hooks, Context, useState, useReducer, useEffect
- ✅ **TypeScript** - Type safety, interfaces, union types
- ✅ **State Management** - Context API + reducer pattern
- ✅ **Component Architecture** - Separation of concerns, reusable components
- ✅ **Styling** - Tailwind CSS utility classes
- ✅ **Data Persistence** - localStorage integration
- ✅ **Deployment** - Vercel CI/CD pipeline

## 🚀 Next Steps (Phase 2)

1. Form validation with React Hook Form
2. Error handling and loading states
3. Dashboard with statistics
4. Charts with Recharts
5. Dark mode support
6. Unit tests
7. CSV export functionality

## 📝 Changelog

### Phase 1 (Jan 29, 2026)
- Initial project setup with Vite + React + TypeScript
- Built core components (Form, List, Filter)
- Implemented Context + useReducer state management
- Added localStorage persistence
- Created empty state UI
- Deployed to Vercel

## 🤝 Contributing

This is a learning project. Feel free to fork and build your own version!

## 📄 License

MIT

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
