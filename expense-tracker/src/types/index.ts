export interface Expense {
    id: string;
    name: string;
    amount: number;
    category: string;
    date: Date;
}

export interface FilterCriteria {
    category: string;
    startDate: Date | null;
    endDate: Date | null;
}