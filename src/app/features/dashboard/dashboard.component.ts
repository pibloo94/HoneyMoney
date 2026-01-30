import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../core/services/transaction.service';
import { ProjectService } from '../../core/services/project.service';
import { RouterModule } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { BulkEditDialogComponent } from './bulk-edit-dialog.component';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, Checkbox, TooltipModule, FormsModule],
  providers: [DialogService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private service = inject(TransactionService);
  private projectService = inject(ProjectService);
  private dialogService = inject(DialogService);
  private confirmationService = inject(ConfirmationService);
  
  totalBalance = this.service.totalBalance;
  
  // Selection state
  selectedTransactionIds = signal<Set<string>>(new Set());
  
  selectedCount = computed(() => this.selectedTransactionIds().size);
  
  hasSelection = computed(() => this.selectedCount() > 0);
  
  // Dynamic members from active project
  members = computed(() => this.projectService.activeProject()?.members || []);
  
  // Computed balance for each member
  memberBalances = computed(() => {
    const list = this.members();
    return list.map(m => ({
        name: m,
        balance: this.service.computeBalance(this.service.getTransactionsByMember(m))
    }));
  });

  // Joint balance (still calculated separately if needed, or included in members)
  // For now, let's assume 'Joint' is one of the members or we keep it special
  jointTransactions = this.service.getTransactionsByMember('Joint');
  jointBalance = this.service.computeBalance(this.jointTransactions);
  
  recentTransactions = this.service.recentTransactions;

  isSelected(id: string): boolean {
    return this.selectedTransactionIds().has(id);
  }

  toggleSelection(id: string) {
    const current = new Set(this.selectedTransactionIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedTransactionIds.set(current);
  }

  toggleSelectAll() {
    const current = this.selectedTransactionIds();
    if (current.size === this.recentTransactions().length) {
      // Deselect all
      this.selectedTransactionIds.set(new Set());
    } else {
      // Select all
      const allIds = new Set(this.recentTransactions().map(t => t.id));
      this.selectedTransactionIds.set(allIds);
    }
  }

  clearSelection() {
    this.selectedTransactionIds.set(new Set());
  }

  openBulkEditDialog() {
    const selectedIds = Array.from(this.selectedTransactionIds());
    const selectedTransactions = this.service.transactions().filter(t => selectedIds.includes(t.id));

    const ref = this.dialogService.open(BulkEditDialogComponent, {
      header: 'Edición Múltiple',
      width: '600px',
      data: {
        selectedTransactions
      }
    });

    if (ref) {
      ref.onClose.subscribe((success: boolean) => {
        if (success) {
          this.clearSelection();
        }
      });
    }
  }

  deleteTransaction(id: string) {
    this.confirmationService.confirm({
        message: '¿Estás seguro de que quieres eliminar esta transacción?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.service.removeTransaction(id);
        }
    });
  }
}
