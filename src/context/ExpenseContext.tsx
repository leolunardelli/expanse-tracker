import { createContext, useContext, useReducer } from 'react';
import type { Expense, ExpenseState } from '../types/index';

// Action types
export type ExpenseAction =
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: ExpenseState = {
  expenses: [],
  filters: {
    category: 'all',
    dateRange: 'month',
  },
  isLoading: false,
  error: null,
};

// Reducer function
function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses], // Add to beginning
        error: null,
      };

    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

// Context type
interface ExpenseContextType {
  state: ExpenseState;
  dispatch: React.Dispatch<ExpenseAction>;
}

// Create context
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Provider component
export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

// Custom hook to use the context
export function useExpenseContext() {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error(
      'useExpenseContext must be used within an ExpenseProvider'
    );
  }

  return context;
}