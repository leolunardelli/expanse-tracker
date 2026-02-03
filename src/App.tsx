import { useState } from 'react';
import { useExpenseContext } from './context/ExpenseContext';
import Header from './components/layout/Header';
import Sidebar, { type ViewType } from './components/layout/Sidebar';
import ExpenseForm from './components/expenses/ExpenseForm';
import ExpenseList from './components/expenses/ExpenseList';
import EditExpenseForm from './components/expenses/EditExpenseForm';
import Modal from './components/common/Modal';
import ErrorNotification from './components/common/ErrorNotification';
import Dashboard from './components/dashboard/Dashboard';
import Analytics from './components/analytics/Analytics';
import Settings from './components/settings/Settings';
import type { Category, Expense } from './types/index';

function App() {
  // View state
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Get state and dispatch from context
  const { state, dispatch } = useExpenseContext();

  // Handler to add expense with loading state
  const handleAddExpense = async (expense: Expense) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Simulate network delay (in real app, this would be API call)
      await new Promise((resolve) => setTimeout(resolve, 300));
      dispatch({ type: 'ADD_EXPENSE', payload: expense });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to add expense',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Handler to delete expense with loading state
  const handleDeleteExpense = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to delete expense',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Handler to edit expense
  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  // Handler to save edited expense with loading state
  const handleSaveEdit = async (updatedExpense: Expense) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      dispatch({ type: 'EDIT_EXPENSE', payload: updatedExpense });
      setIsEditModalOpen(false);
      setSelectedExpense(null);
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to update expense',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Handler to cancel edit
  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setSelectedExpense(null);
  };

  const handleCategoryChange = (value: Category | 'all') => {
    dispatch({ type: 'SET_CATEGORY_FILTER', payload: value });
  };

  const handleDismissError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const handleClearAll = () => {
    state.expenses.forEach((expense) => {
      dispatch({ type: 'DELETE_EXPENSE', payload: expense.id });
    });
  };

  const filteredExpenses =
    state.filters.category === 'all'
      ? state.expenses
      : state.expenses.filter(
          (expense) => expense.category === state.filters.category
        );

  // Render main content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Quick Add Form */}
            <ExpenseForm onAddExpense={handleAddExpense} isLoading={state.isLoading} />
            
            {/* Dashboard */}
            <Dashboard expenses={state.expenses} />
          </div>
        );
      
      case 'expenses':
        return (
          <div className="space-y-6">
            {/* Add Expense Form */}
            <ExpenseForm onAddExpense={handleAddExpense} isLoading={state.isLoading} />
            
            {/* Expenses Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">
                  All Expenses
                </h2>
                <p className="text-dark-500 dark:text-dark-400 mt-1">
                  {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'} found
                  {state.filters.category !== 'all' && ` in ${state.filters.category}`}
                </p>
              </div>
            </div>

            {/* Expense List */}
            <ExpenseList 
              expenses={filteredExpenses} 
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={handleEditExpense}
              isLoading={state.isLoading}
            />
          </div>
        );
      
      case 'analytics':
        return <Analytics expenses={state.expenses} />;
      
      case 'settings':
        return <Settings expenses={state.expenses} onClearAll={handleClearAll} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 transition-colors duration-300">
      {/* Error Notification */}
      <ErrorNotification
        message={state.error}
        onDismiss={handleDismissError}
      />

      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          categoryFilter={state.filters.category}
          onCategoryChange={handleCategoryChange}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-73px)] overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
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
            isLoading={state.isLoading}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;
