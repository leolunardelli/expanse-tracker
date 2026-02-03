import React, { useState } from 'react';

const AddExpenseForm = ({ onAddExpense }) => {
    const [expenseName, setExpenseName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!expenseName || !amount || !category) return;

        const newExpense = {
            name: expenseName,
            amount: parseFloat(amount),
            category,
            id: Date.now(),
        };

        onAddExpense(newExpense);
        setExpenseName('');
        setAmount('');
        setCategory('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Expense Name:
                    <input
                        type="text"
                        value={expenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Category:
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select a category</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
            </div>
            <button type="submit">Add Expense</button>
        </form>
    );
};

export default AddExpenseForm;