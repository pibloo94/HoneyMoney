import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../core/services/transaction.service';
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
  
  totalBalance = this.service.totalBalance;
  
  pabloTransactions = this.service.getTransactionsByMember('Pablo');
  partnerTransactions = this.service.getTransactionsByMember('Partner');
  jointTransactions = this.service.getTransactionsByMember('Joint');

  pabloBalance = this.service.computeBalance(this.pabloTransactions);
  partnerBalance = this.service.computeBalance(this.partnerTransactions);
  jointBalance = this.service.computeBalance(this.jointTransactions);
  
  recentTransactions = this.service.recentTransactions;

  deleteTransaction(id: string) {
    if(confirm('Are you sure you want to delete this transaction?')) {
        this.service.removeTransaction(id);
    }
  }
}
