import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardComponent } from '../dashboard.component';
import { TransactionService } from '../../../core/services/transaction.service';
import { ProjectService } from '../../../core/services/project.service';
import { TestBed } from '@angular/core/testing';
import { signal, computed } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('DashboardComponent (Logic Tests)', () => {
  let component: DashboardComponent;
  let transactionServiceMock: any;
  let projectServiceMock: any;

  beforeEach(() => {
    transactionServiceMock = {
      totalBalance: signal(1000),
      recentTransactions: signal([]),
      getTransactionsByMember: vi.fn(() => signal([])),
      computeBalance: vi.fn((sig: any) => computed(() => 500)),
      removeTransaction: vi.fn()
    };

    projectServiceMock = {
      activeProject: signal({
        id: '1',
        name: 'Test Project',
        members: ['Pablo', 'Partner'],
        color: '#000'
      })
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: TransactionService, useValue: transactionServiceMock },
        { provide: ProjectService, useValue: projectServiceMock },
        provideRouter([])
      ]
    });

    component = TestBed.runInInjectionContext(() => new DashboardComponent());
  });

  it('should have total balance from service', () => {
    expect(component.totalBalance()).toBe(1000);
  });

  it('should initialize member balances dynamically', () => {
    const balances = component.memberBalances();
    expect(balances.length).toBe(2);
    expect(balances[0].name).toBe('Pablo');
    expect(balances[1].name).toBe('Partner');
  });

  it('should call removeTransaction when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteTransaction('123');
    expect(transactionServiceMock.removeTransaction).toHaveBeenCalledWith('123');
  });
});
