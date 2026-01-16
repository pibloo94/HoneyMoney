import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TransactionService } from '../transaction.service';
import { ApiService } from '../api.service';
import { ProjectService } from '../project.service';
import { CategoryService } from '../category.service';
import { of, throwError } from 'rxjs';

describe('TransactionService', () => {
  let service: TransactionService;
  let apiServiceMock: any;
  let projectServiceMock: any;
  let categoryServiceMock: any;

  const createService = (initialTransactions: any[] = []) => {
    apiServiceMock.get.mockReturnValue(of(initialTransactions));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        TransactionService,
        { provide: ApiService, useValue: apiServiceMock },
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock }
      ]
    });
    return TestBed.inject(TransactionService);
  };

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn().mockReturnValue(of([])),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    projectServiceMock = {
      getProjectById: vi.fn()
    };

    categoryServiceMock = {
      getCategoryById: vi.fn()
    };

    service = createService([]);
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should load transactions on initialization', () => {
      expect(apiServiceMock.get).toHaveBeenCalledWith('transactions');
    });
  });

  describe('addTransaction', () => {
    it('should add a new transaction', () => {
      categoryServiceMock.getCategoryById.mockReturnValue({ name: 'Food' });
      const newTransaction = { description: 'T', amount: 10, type: 'Expense' as const, categoryId: 'c1', projectId: 'p1', member: 'P', date: new Date() };
      apiServiceMock.post.mockReturnValue(of({ ...newTransaction, id: '1', categoryName: 'Food' }));

      service.addTransaction(newTransaction);

      expect(apiServiceMock.post).toHaveBeenCalled();
    });
  });

  describe('Computed Properties', () => {
    it('should calculate total balance correctly', () => {
      const transactions = [
        { id: '1', amount: 100, type: 'Income', date: new Date() },
        { id: '2', amount: 40, type: 'Expense', date: new Date() }
      ];
      service = createService(transactions as any);
      expect(service.totalBalance()).toBe(60);
    });

    it('should filter by member', () => {
      const transactions = [
        { id: '1', member: 'Pablo', date: new Date() },
        { id: '2', member: 'Other', date: new Date() }
      ];
      service = createService(transactions as any);
      const filtered = service.getTransactionsByMember('Pablo');
      expect(filtered().length).toBe(1);
    });
  });
});
