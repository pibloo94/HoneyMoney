import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TransactionService } from '../../core/services/transaction.service';
import { ProjectService } from '../../core/services/project.service';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ChartModule, TableModule, Select, FormsModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  private router = inject(Router);
  private service = inject(TransactionService);
  private projectService = inject(ProjectService);
  
  projects = this.projectService.projects;
  selectedProjectId = signal<string | null>(null);

  // Filter transactions based on selected project
  filteredTransactions = computed(() => {
    const all = this.service.transactions();
    const projectId = this.selectedProjectId();
    
    if (projectId) {
        return all.filter(t => t.projectId === projectId);
    }
    return all;
  });

  // Chart Logic
  barData = computed(() => {
    const transactions = this.filteredTransactions();
    const income = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);

    return {
        labels: ['Total'],
        datasets: [
            { label: 'Income', data: [income], backgroundColor: '#10b981', borderRadius: 4 },
            { label: 'Expenses', data: [expense], backgroundColor: '#ef4444', borderRadius: 4 }
        ]
    };
  });

  doughnutData = computed(() => {
    const transactions = this.filteredTransactions().filter(t => t.type === 'Expense');
    const categories: {[key: string]: number} = {};
    
    transactions.forEach(t => {
        // Use categoryName for display
        const name = t.categoryName;
        categories[name] = (categories[name] || 0) + t.amount;
    });

    return {
        labels: Object.keys(categories),
        datasets: [
            {
                data: Object.values(categories),
                backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6']
            }
        ]
    };
  });

  barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } }
  };

  doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  exportExcel() {
    this.service.exportToExcel();
  }

  exportPdf() {
    this.service.exportToPdf();
  }

  deleteTransaction(id: string) {
    if(confirm('Are you sure you want to delete this transaction?')) {
        this.service.removeTransaction(id);
    }
  }
}
