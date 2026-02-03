import React from 'react';

interface ExpenseSummaryProps {
    totalAmount: number;
    totalExpenses: number;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ totalAmount, totalExpenses }) => {
    return (
        <div className="expense-summary">
            <h2>Expense Summary</h2>
            <p>Total Expenses: {totalExpenses}</p>
            <p>Total Amount: {totalAmount}</p>
        </div>
    );
};

export default ExpenseSummary;