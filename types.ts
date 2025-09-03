export interface Transactions {
    id: number;
    amount: number;
    date: number;
    category_id: number;
    description: string;
    type: "EXPENSE" | "INCOME";
}

export interface Category {
    id: number;
    name: string;
    type: "EXPENSE" | "INCOME";
}

export interface transactionByMonth {
    totalExpenses: number;
    totalIncome: number;
}