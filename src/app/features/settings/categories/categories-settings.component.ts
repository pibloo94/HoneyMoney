import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-categories-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Button, InputText, TableModule, Dialog, Select],
  templateUrl: './categories-settings.component.html',
  styleUrl: './categories-settings.component.css'
})
export class CategoriesSettingsComponent {
    private categoryService = inject(CategoryService);
    private fb = inject(FormBuilder);

    categories = this.categoryService.categories;
    displayDialog = false;
    editingId: string | null = null;
    types = ['Income', 'Expense'];

    form = this.fb.group({
        name: ['', Validators.required],
        type: ['Expense', Validators.required],
        icon: ['pi pi-tag', Validators.required],
        color: ['#64748b'] // Default slate
    });

    showAddDialog() {
        this.editingId = null;
        this.form.reset({ name: '', type: 'Expense', icon: 'pi pi-tag', color: '#64748b' });
        this.displayDialog = true;
    }

    showEditDialog(category: any) {
        this.editingId = category.id;
        this.form.patchValue({
            name: category.name,
            type: category.type,
            icon: category.icon,
            color: category.color
        });
        this.displayDialog = true;
    }

    saveCategory() {
        if (this.form.valid) {
            const val = this.form.value;
            
            if (this.editingId) {
                this.categoryService.updateCategory(this.editingId, {
                    name: val.name!,
                    type: val.type as any,
                    icon: val.icon!,
                    color: val.color!
                });
            } else {
                this.categoryService.addCategory({
                    name: val.name!,
                    type: val.type as any,
                    icon: val.icon!,
                    color: val.color!
                });
            }
            this.displayDialog = false;
        }
    }

    deleteCategory(id: string) {
        if(confirm('Are you sure?')) {
            this.categoryService.deleteCategory(id);
        }
    }
}
