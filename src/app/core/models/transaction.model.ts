import { TransactionType } from './category.model';

export type { TransactionType };

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: Date;
    projectId: string;
    categoryId: string; // References Category.id
    categoryName: string; // Snapshot of category name for display
    member: string;     // The specific project member (previously owner)
    type: TransactionType;
}

