import { Component, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Transaction } from '../../core/models/transaction.model';
import { ProjectService } from '../../core/services/project.service';
import { CategoryService } from '../../core/services/category.service';
import { TransactionService } from '../../core/services/transaction.service';
import { MessageService, ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface BulkEditData {
  selectedTransactions: Transaction[];
}

@Component({
  selector: 'app-bulk-edit-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, SelectModule, DatePickerModule, CheckboxModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Editar Múltiples Transacciones</h2>
      
      <div class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p class="text-sm text-amber-800">
          <i class="pi pi-info-circle mr-2"></i>
          Editando <strong>{{ selectedCount }}</strong> transacciones
        </p>
      </div>

      <form [formGroup]="form" class="space-y-4">
        <!-- Member -->
        <div class="flex items-start gap-3">
          <p-checkbox 
            formControlName="applyMember" 
            [binary]="true"
            inputId="apply-member"
          />
          <div class="flex-1">
            <label for="member" class="block text-sm font-medium text-slate-700 mb-2">
              Miembro
            </label>
            <p-select
              formControlName="member"
              [options]="members()"
              placeholder="Seleccionar miembro"
              [disabled]="!form.get('applyMember')?.value"
              styleClass="w-full"
            />
          </div>
        </div>

        <!-- Category -->
        <div class="flex items-start gap-3">
          <p-checkbox 
            formControlName="applyCategory" 
            [binary]="true"
            inputId="apply-category"
          />
          <div class="flex-1">
            <label for="category" class="block text-sm font-medium text-slate-700 mb-2">
              Categoría
            </label>
            <p-select
              formControlName="categoryId"
              [options]="categories()"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccionar categoría"
              [disabled]="!form.get('applyCategory')?.value"
              styleClass="w-full"
            />
          </div>
        </div>

        <!-- Project -->
        <div class="flex items-start gap-3">
          <p-checkbox 
            formControlName="applyProject" 
            [binary]="true"
            inputId="apply-project"
          />
          <div class="flex-1">
            <label for="project" class="block text-sm font-medium text-slate-700 mb-2">
              Proyecto
            </label>
            <p-select
              formControlName="projectId"
              [options]="projects()"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccionar proyecto"
              [disabled]="!form.get('applyProject')?.value"
              styleClass="w-full"
            />
          </div>
        </div>

        <!-- Date -->
        <div class="flex items-start gap-3">
          <p-checkbox 
            formControlName="applyDate" 
            [binary]="true"
            inputId="apply-date"
          />
          <div class="flex-1">
            <label for="date" class="block text-sm font-medium text-slate-700 mb-2">
              Fecha
            </label>
            <p-datepicker
              formControlName="date"
              [disabled]="!form.get('applyDate')?.value"
              dateFormat="dd/mm/yy"
              styleClass="w-full"
              [showIcon]="true"
            />
          </div>
        </div>
      </form>

      <!-- Preview -->
      <div *ngIf="hasChanges()" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="text-sm font-semibold text-blue-900 mb-2">Vista Previa de Cambios:</h3>
        <ul class="text-sm text-blue-800 space-y-1">
          <li *ngIf="form.value.applyMember && form.value.member">
            <i class="pi pi-arrow-right mr-2"></i>
            Cambiar Miembro a: <strong>{{ form.value.member }}</strong>
          </li>
          <li *ngIf="form.value.applyCategory && form.value.categoryId">
            <i class="pi pi-arrow-right mr-2"></i>
            Cambiar Categoría a: <strong>{{ getCategoryName(form.value.categoryId) }}</strong>
          </li>
          <li *ngIf="form.value.applyProject && form.value.projectId">
            <i class="pi pi-arrow-right mr-2"></i>
            Cambiar Proyecto a: <strong>{{ getProjectName(form.value.projectId) }}</strong>
          </li>
          <li *ngIf="form.value.applyDate && form.value.date">
            <i class="pi pi-arrow-right mr-2"></i>
            Cambiar Fecha a: <strong>{{ form.value.date | date:'dd/MM/yyyy' }}</strong>
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <button 
          pButton 
          label="Cancelar" 
          severity="secondary"
          (click)="cancel()"
        ></button>
        <button 
          pButton 
          label="Aplicar Cambios" 
          [disabled]="!isValid() || !hasChanges()"
          (click)="confirmAndApply()"
        ></button>
      </div>

      <p-confirmDialog [style]="{width: '450px'}" />
    </div>
  `,
  styles: []
})
export class BulkEditDialogComponent {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private projectService = inject(ProjectService);
  private categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  selectedTransactions: Transaction[] = this.config.data?.selectedTransactions || [];
  selectedCount = this.selectedTransactions.length;

  projects = this.projectService.projects;
  categories = this.categoryService.categories;
  members = computed(() => this.projectService.activeProject()?.members || []);

  form = this.fb.group({
    applyMember: [false],
    member: [''],
    applyCategory: [false],
    categoryId: [''],
    applyProject: [false],
    projectId: [''],
    applyDate: [false],
    date: [new Date()]
  });

  constructor() {
    // Check validation on toggle
    effect(() => {
      // We can use valueChanges in Angular forms instead of effect for form interactions
    });

    this.form.get('applyMember')?.valueChanges.subscribe(apply => {
        const control = this.form.get('member');
        if (apply) {
            control?.setValidators(Validators.required);
        } else {
            control?.clearValidators();
        }
        control?.updateValueAndValidity();
    });

    this.form.get('applyCategory')?.valueChanges.subscribe(apply => {
        const control = this.form.get('categoryId');
        if (apply) {
            control?.setValidators(Validators.required);
        } else {
            control?.clearValidators();
        }
        control?.updateValueAndValidity();
    });

    this.form.get('applyProject')?.valueChanges.subscribe(apply => {
        const control = this.form.get('projectId');
        if (apply) {
            control?.setValidators(Validators.required);
        } else {
            control?.clearValidators();
        }
        control?.updateValueAndValidity();
    });
    
    this.form.get('applyDate')?.valueChanges.subscribe(apply => {
        const control = this.form.get('date');
        if (apply) {
            control?.setValidators(Validators.required);
        } else {
            control?.clearValidators();
        }
        control?.updateValueAndValidity();
    });
  }

  hasChanges() {
    const v = this.form.value;
    return (v.applyMember && !!v.member) || 
           (v.applyCategory && !!v.categoryId) || 
           (v.applyProject && !!v.projectId) || 
           (v.applyDate && !!v.date);
  }

  isValid() {
    return this.form.valid && this.hasChanges();
  }

  getCategoryName(id: string | null | undefined): string {
    if (!id) return '';
    return this.categories().find(c => c.id === id)?.name || '';
  }

  getProjectName(id: string | null | undefined): string {
    if (!id) return '';
    return this.projects().find(p => p.id === id)?.name || '';
  }

  confirmAndApply() {
    if (!this.isValid()) {
      return;
    }

    const changes: string[] = [];
    if (this.form.value.applyMember && this.form.value.member) {
      changes.push(`Miembro: ${this.form.value.member}`);
    }
    if (this.form.value.applyCategory && this.form.value.categoryId) {
      changes.push(`Categoría: ${this.getCategoryName(this.form.value.categoryId)}`);
    }
    if (this.form.value.applyProject && this.form.value.projectId) {
      changes.push(`Proyecto: ${this.getProjectName(this.form.value.projectId)}`);
    }
    if (this.form.value.applyDate && this.form.value.date) {
      changes.push(`Fecha: ${new Date(this.form.value.date).toLocaleDateString()}`);
    }

    this.confirmationService.confirm({
      header: 'Confirmación de Actualización Masiva',
      message: `
        <div class="font-sans">
          <p class="mb-3">Vas a actualizar <strong>${this.selectedCount} transacciones</strong> con los siguientes cambios:</p>
          <ul class="list-disc pl-5 space-y-1 mb-4">
            ${changes.map(c => `<li>${c}</li>`).join('')}
          </ul>
          <p class="text-amber-600 font-semibold text-sm">
            <i class="pi pi-exclamation-triangle mr-1"></i> Esta acción NO se puede deshacer.
          </p>
        </div>
      `,
      icon: 'pi pi-exclamation-circle',
      acceptLabel: 'Actualizar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.applyChanges();
      }
    });
  }

  applyChanges() {
    const updates: Partial<Transaction> = {};

    if (this.form.value.applyMember && this.form.value.member) {
      updates.member = this.form.value.member;
    }
    if (this.form.value.applyCategory && this.form.value.categoryId) {
      updates.categoryId = this.form.value.categoryId;
      updates.categoryName = this.getCategoryName(this.form.value.categoryId);
    }
    if (this.form.value.applyProject && this.form.value.projectId) {
      updates.projectId = this.form.value.projectId;
    }
    if (this.form.value.applyDate && this.form.value.date) {
      updates.date = new Date(this.form.value.date);
    }

    const ids = this.selectedTransactions.map(t => t.id);

    this.transactionService.bulkUpdateTransactions(ids, updates).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Actualización Exitosa', detail: 'Las transacciones han sido actualizadas.'});
        this.ref.close(true);
      },
      error: (error) => {
        console.error('Bulk update failed:', error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudieron actualizar las transacciones.'});
      }
    });
  }

  cancel() {
    this.ref.close(false);
  }
}
