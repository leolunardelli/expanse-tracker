import { useState } from 'react';
import { useExpenseContext } from './context/ExpenseContext';
import ExpenseForm from './components/expenses/ExpenseForm';
import ExpenseList from './components/expenses/ExpenseList';
import EditExpenseForm from './components/expenses/EditExpenseForm';
import CategoryFilter from './components/filters/CategoryFilter';
import Modal from './components/common/Modal';
import type { Category, Expense } from './types/index';

function App() {
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Get state and dispatch from context
  const { state, dispatch } = useExpenseContext();

  // Handler to add expense
  const handleAddExpense = (expense: Expense) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  // Handler to delete expense
  const handleDeleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  // Handler to edit expense
  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  // Handler to save edited expense
  const handleSaveEdit = (updatedExpense: Expense) => {
    dispatch({ type: 'EDIT_EXPENSE', payload: updatedExpense });
    setIsEditModalOpen(false);
    setSelectedExpense(null);
  };

  // Handler to cancel edit
  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setSelectedExpense(null);
  };

  const handleCategoryChange = (value: Category | 'all') => {
    dispatch({ type: 'SET_CATEGORY_FILTER', payload: value });
  };

  const filteredExpenses =
    state.filters.category === 'all'
      ? state.expenses
      : state.expenses.filter(
          (expense) => expense.category === state.filters.category
        );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Expense Tracker
          </h1>
          <p className="text-gray-600">
            Track your expenses and manage your budget
          </p>
        </header>

        {/* Add Expense Form */}
        <ExpenseForm onAddExpense={handleAddExpense} />

        {/* Category Filter */}
        <CategoryFilter
          value={state.filters.category}
          onChange={handleCategoryChange}
        />

        {/* Expense List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Expenses
          </h2>
          <ExpenseList 
            expenses={filteredExpenses} 
            onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleEditExpense}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        title="Edit Expense"
      >
        {selectedExpense && (
          <EditExpenseForm
            expense={selectedExpense}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}
      </Modal>
    </div>
  );
}

export default App
