# Expense Tracker

A modern expense tracking application built with React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Context API + useReducer** - State management

## 📦 Current Progress

### ✅ Completed (Phase 1 - Steps 1.1 to 1.5)

- [x] Project initialized with Vite + React + TypeScript + Tailwind
- [x] Folder structure created
- [x] TypeScript types defined
- [x] ExpenseForm component built
- [x] ExpenseList component built
- [x] ExpenseContext + useReducer created

### 🔄 Next Steps

**Step 1.6: Wire Context into App**

Now let's finish Step 1.6 by wiring the Context into App.tsx so you can actually see the form and list working together!

Ready to continue? I'll guide you through updating App.tsx and main.tsx to connect everything! 🚀

## 🛠️ Development

```bash
npm install
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── expenses/        # ExpenseForm, ExpenseList
│   ├── dashboard/       # Dashboard components
│   ├── filters/         # Filter components
│   └── layout/          # Layout components
├── context/             # ExpenseContext
├── hooks/               # Custom hooks
├── types/               # TypeScript types
└── utils/               # Helper functions
```

## Expanding the ESLint configuration

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
