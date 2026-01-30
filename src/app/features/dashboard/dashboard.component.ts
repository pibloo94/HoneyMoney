import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../core/services/transaction.service';
import { ProjectService } from '../../core/services/project.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private service = inject(TransactionService);
  private projectService = inject(ProjectService);
  
  totalBalance = this.service.totalBalance;
  
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

  deleteTransaction(id: string) {
    if(confirm('Are you sure you want to delete this transaction?')) {
        this.service.removeTransaction(id);
    }
  }
}
