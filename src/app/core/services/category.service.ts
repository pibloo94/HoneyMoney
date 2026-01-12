import { Injectable, signal, computed, effect } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private STORAGE_KEY = 'honeymoney_categories';

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
    this.loadFromStorage();
    
    effect(() => {
        this.saveToStorage(this.categoriesSignal());
    });
  }

  addCategory(category: Omit<Category, 'id'>) {
    const newCategory: Category = {
        ...category,
        id: crypto.randomUUID()
    };
    this.categoriesSignal.update(cats => [...cats, newCategory]);
  }

  updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>) {
    this.categoriesSignal.update(cats => 
        cats.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  }

  deleteCategory(id: string) {
    this.categoriesSignal.update(cats => cats.filter(c => c.id !== id));
  }

  getCategoryById(id: string): Category | undefined {
    return this.categoriesSignal().find(c => c.id === id);
  }

  private loadFromStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
        try {
            this.categoriesSignal.set(JSON.parse(data));
        } catch (e) {
             this.categoriesSignal.set(this.defaultCategories);
        }
    } else {
        this.categoriesSignal.set(this.defaultCategories);
    }
  }

  private saveToStorage(categories: Category[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
  }
}
