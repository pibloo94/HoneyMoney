import { Injectable, signal, computed, inject } from '@angular/core';
import { Category } from '../models/category.model';
import { ApiService } from './api.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiService = inject(ApiService);
  private messageService = inject(MessageService);

  private defaultCategories: Category[] = [
    { id: 'cat-1', name: 'Salary', type: 'Income', icon: 'pi pi-money-bill', color: '#10b981' },
    { id: 'cat-2', name: 'Freelance', type: 'Income', icon: 'pi pi-briefcase', color: '#3b82f6' },
    { id: 'cat-3', name: 'Groceries', type: 'Expense', icon: 'pi pi-shopping-cart', color: '#f59e0b' },
    { id: 'cat-4', name: 'Rent', type: 'Expense', icon: 'pi pi-home', color: '#ef4444' },
    { id: 'cat-5', name: 'Utilities', type: 'Expense', icon: 'pi pi-bolt', color: '#f97316' },
    { id: 'cat-6', name: 'Dining Out', type: 'Expense', icon: 'pi pi-apple', color: '#8b5cf6' },
    { id: 'cat-7', name: 'Transport', type: 'Expense', icon: 'pi pi-car', color: '#6366f1' },
    { id: 'cat-8', name: 'Entertainment', type: 'Expense', icon: 'pi pi-ticket', color: '#ec4899' },
    { id: 'cat-9', name: 'Health', type: 'Expense', icon: 'pi pi-heart', color: '#ef4444' },
    { id: 'cat-10', name: 'Shopping', type: 'Expense', icon: 'pi pi-shopping-bag', color: '#14b8a6' },
  ];

  private categoriesSignal = signal<Category[]>([]);
  
  categories = computed(() => this.categoriesSignal());
  
  incomeCategories = computed(() => this.categories().filter(c => c.type === 'Income'));
  expenseCategories = computed(() => this.categories().filter(c => c.type === 'Expense'));

  constructor() {
    this.loadCategories();
  }

  private loadCategories() {
    this.apiService.get<Category[]>('categories').subscribe({
      next: (categories) => {
        if (categories.length === 0) {
          // Initialize with default categories
          this.initializeDefaultCategories();
        } else {
          this.categoriesSignal.set(categories);
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load categories.' });
        this.categoriesSignal.set(this.defaultCategories);
      }
    });
  }

  private initializeDefaultCategories() {
    // Create all default categories in the backend
    this.defaultCategories.forEach(cat => {
      this.apiService.post<Category>('categories', cat).subscribe({
        next: (savedCat) => {
          this.categoriesSignal.update(cats => [...cats, savedCat]);
        },
        error: (error) => {
          console.error('Error initializing category:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to initialize category: ${cat.name}` });
        }
      });
    });
  }

  addCategory(category: Omit<Category, 'id'>) {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID()
    };
    
    this.apiService.post<Category>('categories', newCategory).subscribe({
      next: (savedCategory) => {
        this.categoriesSignal.update(cats => [...cats, savedCategory]);
      },
      error: (error) => {
        console.error('Error adding category:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add category.' });
      }
    });
  }

  updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>) {
    this.apiService.put<Category>(`categories/${id}`, updates).subscribe({
      next: (updatedCategory) => {
        this.categoriesSignal.update(cats => 
          cats.map(c => c.id === id ? updatedCategory : c)
        );
      },
      error: (error) => {
        console.error('Error updating category:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category.' });
      }
    });
  }

  deleteCategory(id: string) {
    this.apiService.delete(`categories/${id}`).subscribe({
      next: () => {
        this.categoriesSignal.update(cats => cats.filter(c => c.id !== id));
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete category.' });
      }
    });
  }

  getCategoryById(id: string): Category | undefined {
    return this.categoriesSignal().find(c => c.id === id);
  }
}

