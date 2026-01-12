export type TransactionType = 'Income' | 'Expense';

export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    icon?: string;
    color?: string;
}
