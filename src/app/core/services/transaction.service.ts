import { Injectable, signal, computed, inject } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { ProjectService } from './project.service';
import { CategoryService } from './category.service';
import { ApiService } from './api.service';
import { MessageService } from 'primeng/api';
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
  private messageService = inject(MessageService);

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

  private hydrateDate(t: any): Transaction {
    return {
      ...t,
      date: new Date(t.date)
    };
  }

  private loadTransactions() {
    this.apiService.get<any[]>('transactions').subscribe({
      next: (transactions) => {
        this.transactionsSignal.set(transactions.map(t => this.hydrateDate(t)));
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load transactions.' });
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
        this.transactionsSignal.update(transactions => [...transactions, this.hydrateDate(savedTransaction)]);
      },
      error: (error) => {
        console.error('Error adding transaction:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add transaction.' });
      }
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
        const hydrated = this.hydrateDate(updatedTransaction);
        this.transactionsSignal.update(transactions => 
          transactions.map(t => t.id === id ? hydrated : t)
        );
      },
      error: (error) => {
        console.error('Error updating transaction:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update transaction.' });
      }
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
      error: (error) => {
        console.error('Error deleting transaction:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete transaction.' });
      }
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

  importFromExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (workbook.SheetNames.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The Excel file is empty.' });
          return;
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No data found in the first sheet.' });
          return;
        }

        // Validate required columns
        const firstRow = jsonData[0];
        const requiredColumns = ['Description', 'Amount', 'Type'];
        const missing = requiredColumns.filter(col => !(col in firstRow));

        if (missing.length > 0) {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Invalid Format', 
            detail: `Missing required columns: ${missing.join(', ')}. Please use the exported Excel as a template.` 
          });
          return;
        }

        const projects = this.projectService.projects();
        const categories = this.categoryService.categories();
        const errors: string[] = [];
        const validTransactions: any[] = [];

        jsonData.forEach((row, index) => {
          const rowNum = index + 2; // +2 because Excel is 1-indexed and has header row
          const rowErrors: string[] = [];

          // Validate Description
          if (!row.Description || typeof row.Description !== 'string' || row.Description.trim() === '') {
            rowErrors.push(`Description is required`);
          }

          // Validate Amount
          const amount = Number(row.Amount);
          if (isNaN(amount) || amount === 0) {
            rowErrors.push(`Amount must be a valid non-zero number`);
          }

          // Validate Type
          if (row.Type !== 'Income' && row.Type !== 'Expense') {
            rowErrors.push(`Type must be either 'Income' or 'Expense'`);
          }

          // Validate Date (if provided)
          let parsedDate = new Date();
          if (row.Date) {
            parsedDate = new Date(row.Date);
            if (isNaN(parsedDate.getTime())) {
              rowErrors.push(`Date is invalid`);
              parsedDate = new Date(); // Fallback to today
            }
          }

          // Validate Project (if provided)
          let projectId = projects[0]?.id || 'default-project';
          if (row.Project) {
            const project = projects.find(p => p.name === row.Project);
            if (!project) {
              rowErrors.push(`Project '${row.Project}' not found`);
            } else {
              projectId = project.id;
            }
          }

          // Validate Category (if provided)
          let categoryId = categories[0]?.id || 'cat-unknown';
          let categoryName = 'Unknown';
          if (row.Category) {
            const category = categories.find(c => c.name === row.Category && c.type === row.Type);
            if (!category) {
              rowErrors.push(`Category '${row.Category}' not found for type '${row.Type}'`);
            } else {
              categoryId = category.id;
              categoryName = category.name;
            }
          }

          // Validate Member (if provided)
          let member = 'Unknown';
          if (row.Member || row.Link) {
            member = row.Member || row.Link;
            if (typeof member !== 'string' || member.trim() === '') {
              rowErrors.push(`Member/Link is invalid`);
              member = 'Unknown';
            }
          }

          if (rowErrors.length > 0) {
            errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
          } else {
            validTransactions.push({
              id: crypto.randomUUID(),
              description: row.Description.trim(),
              amount: Math.abs(amount),
              date: parsedDate,
              projectId: projectId,
              categoryId: categoryId,
              categoryName: categoryName,
              member: member,
              type: row.Type
            });
          }
        });

        // Show validation results
        if (errors.length > 0) {
          const errorMessage = errors.slice(0, 5).join('\n') + 
            (errors.length > 5 ? `\n... and ${errors.length - 5} more errors` : '');
          
          this.messageService.add({ 
            severity: 'warn', 
            summary: `Import Issues (${errors.length} rows)`, 
            detail: errorMessage,
            life: 10000
          });
        }

        if (validTransactions.length > 0) {
          this.bulkAddTransactions(validTransactions);
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Import Successful', 
            detail: `${validTransactions.length} transactions imported successfully.${errors.length > 0 ? ` ${errors.length} rows skipped due to errors.` : ''}` 
          });
        } else if (errors.length > 0) {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Import Failed', 
            detail: 'No valid transactions found. Please fix the errors and try again.' 
          });
        }
      } catch (err) {
        console.error('Error parsing Excel:', err);
        this.messageService.add({ severity: 'error', summary: 'Parse Error', detail: 'Failed to read the Excel file. Please ensure it is a valid Excel file.' });
      }
    };
    reader.onerror = () => {
      this.messageService.add({ severity: 'error', summary: 'File Error', detail: 'Could not read the file.' });
    };
    reader.readAsArrayBuffer(file);
  }

  private bulkAddTransactions(transactions: any[]) {
    this.apiService.post<any[]>('transactions/bulk', transactions).subscribe({
      next: (savedTransactions) => {
        const hydrated = savedTransactions.map(t => this.hydrateDate(t));
        this.transactionsSignal.update(existing => [...existing, ...hydrated]);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Import Successful', 
          detail: `Imported ${savedTransactions.length} transactions.` 
        });
      },
      error: (error) => {
        console.error('Error bulk adding transactions:', error);
        this.messageService.add({ severity: 'error', summary: 'Import Failed', detail: 'Server error during bulk import.' });
      }
    });
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

