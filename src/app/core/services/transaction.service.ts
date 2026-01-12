import { Injectable, signal, computed, inject } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { ProjectService } from './project.service';
import { CategoryService } from './category.service';
import { ApiService } from './api.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiService = inject(ApiService);
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
    this.loadTransactions();
  }

  private loadTransactions() {
    this.apiService.get<any[]>('transactions').subscribe({
      next: (transactions) => {
        // Hydrate dates from JSON
        const hydratedTransactions = transactions.map(t => ({
          ...t,
          date: new Date(t.date)
        }));
        this.transactionsSignal.set(hydratedTransactions);
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.transactionsSignal.set([]);
      }
    });
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'categoryName'>) {
    const category = this.categoryService.getCategoryById(transaction.categoryId);
    
    const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID(),
        categoryName: category ? category.name : 'Unknown'
    };
    
    this.apiService.post<Transaction>('transactions', newTransaction).subscribe({
      next: (savedTransaction) => {
        // Hydrate date
        const hydrated = { ...savedTransaction, date: new Date(savedTransaction.date) };
        this.transactionsSignal.update(transactions => [...transactions, hydrated]);
      },
      error: (error) => console.error('Error adding transaction:', error)
    });
  }

  updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'categoryName'>>) {
    const category = this.categoryService.getCategoryById(updates.categoryId || '');
    const updateData = {
      ...updates,
      categoryName: category ? category.name : undefined
    };
    
    this.apiService.put<Transaction>(`transactions/${id}`, updateData).subscribe({
      next: (updatedTransaction) => {
        const hydrated = { ...updatedTransaction, date: new Date(updatedTransaction.date) };
        this.transactionsSignal.update(transactions => 
          transactions.map(t => t.id === id ? hydrated : t)
        );
      },
      error: (error) => console.error('Error updating transaction:', error)
    });
  }

  getTransactionById(id: string): Transaction | undefined {
    return this.transactionsSignal().find(t => t.id === id);
  }

  removeTransaction(id: string) {
    this.apiService.delete(`transactions/${id}`).subscribe({
      next: () => {
        this.transactionsSignal.update(transactions => transactions.filter(t => t.id !== id));
      },
      error: (error) => console.error('Error deleting transaction:', error)
    });
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
}

