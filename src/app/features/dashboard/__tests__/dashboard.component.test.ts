import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardComponent } from '../dashboard.component';
import { TransactionService } from '../../../core/services/transaction.service';
import { TestBed } from '@angular/core/testing';
import { signal, computed } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('DashboardComponent (Logic Tests)', () => {
  let component: DashboardComponent;
  let transactionServiceMock: any;

  beforeEach(() => {
    transactionServiceMock = {
      totalBalance: signal(1000),
      recentTransactions: signal([]),
      getTransactionsByMember: vi.fn(() => signal([])),
      computeBalance: vi.fn((sig: any) => computed(() => 500)),
      removeTransaction: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: TransactionService, useValue: transactionServiceMock },
        provideRouter([])
      ]
    });

    // Run in injection context to allow inject() to work
    component = TestBed.runInInjectionContext(() => new DashboardComponent());
  });

  it('should have total balance from service', () => {
    expect(component.totalBalance()).toBe(1000);
  });

  it('should initialize member balances', () => {
    expect(component.pabloBalance()).toBe(500);
  });

  it('should call removeTransaction when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteTransaction('123');
    expect(transactionServiceMock.removeTransaction).toHaveBeenCalledWith('123');
  });
});
