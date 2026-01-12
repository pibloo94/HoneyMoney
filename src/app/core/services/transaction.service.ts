import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { ProjectService } from './project.service';
import { CategoryService } from './category.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private STORAGE_KEY = 'honeymoney_transactions';
  
  private projectService = inject(ProjectService);
  private categoryService = inject(CategoryService);

  // State
  private transactionsSignal = signal<Transaction[]>([]);

  // Selectors
  readonly transactions = computed(() => this.transactionsSignal());
  
  readonly totalBalance = computed(() => {
    return this.transactions().reduce((acc, t) => {
        return t.type === 'Income' ? acc + t.amount : acc - t.amount;
    }, 0);
  });

  constructor() {
    this.loadFromStorage();
    
    // Auto-save effect
    effect(() => {
        this.saveToStorage(this.transactionsSignal());
    });
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'categoryName'>) {
    const category = this.categoryService.getCategoryById(transaction.categoryId);
    
    const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID(),
        categoryName: category ? category.name : 'Unknown'
    };
    
    this.transactionsSignal.update(transactions => [...transactions, newTransaction]);
  }

  updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'categoryName'>>) {
    const category = this.categoryService.getCategoryById(updates.categoryId || '');
    this.transactionsSignal.update(transactions => 
        transactions.map(t => t.id === id ? { 
            ...t, 
            ...updates,
            categoryName: category ? category.name : t.categoryName
        } : t)
    );
  }

  getTransactionById(id: string): Transaction | undefined {
    return this.transactionsSignal().find(t => t.id === id);
  }

  removeTransaction(id: string) {
    this.transactionsSignal.update(transactions => transactions.filter(t => t.id !== id));
  }

  // Updated to filter by specific member name (string)
  getTransactionsByMember(memberName: string) {
    return computed(() => this.transactions().filter(t => t.member === memberName));
  }

  computeBalance(transactionsSignal: () => Transaction[]) {
    return computed(() => {
        return transactionsSignal().reduce((acc: number, t: Transaction) => {
            return t.type === 'Income' ? acc + t.amount : acc - t.amount;
        }, 0);
    });
  }

  readonly recentTransactions = computed(() => {
    return this.transactions()
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);
  });

  exportToExcel() {
    const data = this.transactions().map(t => ({
        Date: t.date.toLocaleDateString(),
        Description: t.description,
        Category: t.categoryName,
        Link: t.member, // specific member
        Project: this.projectService.getProjectById(t.projectId)?.name || 'Unknown',
        Amount: t.amount,
        Type: t.type
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'transactions');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
     const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
     const EXCEL_EXTENSION = '.xlsx';
     const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
     saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  exportToPdf() {
    const doc = new jsPDF();
    const headers = [['Date', 'Description', 'Category', 'Member', 'Amount', 'Type']];
    const data = this.transactions().map(t => [
        t.date.toLocaleDateString(),
        t.description,
        t.categoryName,
        t.member,
        t.amount.toString(),
        t.type
    ]);

    autoTable(doc, {
        head: headers,
        body: data,
    });

    doc.save('transactions.pdf');
  }

  private loadFromStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
        try {
            const parsed = JSON.parse(data);
            
            // Migration logic for old data
            // Default Project: 1st available or 'default-project'
            // Default Categories: Map strings to new IDs if possible or defaults
            const defaultProject = this.projectService.projects()[0];
            const categories = this.categoryService.categories();

            // Helper to find category ID by name
            const findCatId = (name: string, type: string) => {
                const found = categories.find(c => c.name === name && c.type === type);
                return found ? found.id : (categories.find(c => c.type === type)?.id || 'unknown');
            };

            const transactions = parsed.map((t: any) => {
                // If new schema (has projectId), just hydrate date
                if (t.projectId) {
                    return { ...t, date: new Date(t.date) };
                }

                // Old schema migration
                const isIncome = t.type === 'Income'; // Attempt to deduce type if missing or default
                // Old 'owner' mapped to 'member'
                const member = t.owner || 'Pablo'; 
                // Old 'category' string mapped to ID
                const catId = findCatId(t.category || (isIncome ? 'Salary' : 'Other'), t.type);

                return {
                    id: t.id || crypto.randomUUID(),
                    description: t.description || 'Legacy Transaction',
                    amount: t.amount || 0,
                    date: new Date(t.date || Date.now()),
                    projectId: defaultProject?.id || 'default-project',
                    categoryId: catId,
                    categoryName: t.category || (categories.find(c => c.id === catId)?.name || 'Unknown'),
                    member: member,
                    type: t.type
                } as Transaction;
            });

            this.transactionsSignal.set(transactions);
        } catch (e) {
            console.error('Failed to parse transactions', e);
        }
    }
  }

  private saveToStorage(transactions: Transaction[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
  }
}
