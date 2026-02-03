import React from 'react';
import { useExpenses } from './hooks/useExpenses';
import Header from './components/Header';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import CategoryFilter from './components/CategoryFilter';

const App: React.FC = () => {
    const {
        expenses,
        addExpense,
        deleteExpense,
        filterExpenses,
        totalExpenses,
    } = useExpenses();

    return (
        <div>
            <Header />
            <AddExpenseForm onAddExpense={addExpense} />
            <CategoryFilter onFilter={filterExpenses} />
            <ExpenseSummary total={totalExpenses} />
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
        </div>
    );
};

export default App;