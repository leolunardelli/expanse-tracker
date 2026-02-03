import { useState } from 'react';
import { Expense } from '../types';

const useExpenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const addExpense = (expense: Expense) => {
        setExpenses(prevExpenses => [...prevExpenses, expense]);
    };

    const deleteExpense = (id: string) => {
        setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
    };

    const filterExpenses = (category: string) => {
        return expenses.filter(expense => expense.category === category);
    };

    const getTotalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    return {
        expenses,
        addExpense,
        deleteExpense,
        filterExpenses,
        getTotalExpenses,
    };
};

export default useExpenses;