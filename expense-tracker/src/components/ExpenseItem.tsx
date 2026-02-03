import React from 'react';

interface ExpenseItemProps {
    id: number;
    name: string;
    amount: number;
    category: string;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ id, name, amount, category, onDelete, onEdit }) => {
    return (
        <div className="expense-item">
            <h3>{name}</h3>
            <p>Amount: {amount}</p>
            <p>Category: {category}</p>
            <button onClick={() => onEdit(id)}>Edit</button>
            <button onClick={() => onDelete(id)}>Delete</button>
        </div>
    );
};

export default ExpenseItem;