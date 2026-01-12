import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TransactionService } from '../../core/services/transaction.service';
import { ProjectService } from '../../core/services/project.service';
import { CategoryService } from '../../core/services/category.service';
import { Project } from '../../core/models/project.model';

import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    DatePicker, Select, InputNumber, InputText, Button, FloatLabel
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(TransactionService);
  private projectService = inject(ProjectService);
  private categoryService = inject(CategoryService);

  isIncome = false;
  
  projects = this.projectService.projects;
  selectedProject = signal<string | null>(null);
  
  // Available categories based on type
  categories = computed(() => {
    return this.isIncome 
        ? this.categoryService.incomeCategories() 
        : this.categoryService.expenseCategories();
  });

  // Members depend on selected project
  projectMembers = computed(() => {
    const projectId = this.selectedProject();
    const project = this.projects().find(p => p.id === projectId);
    return project ? project.members.map(m => ({ label: m, value: m })) : [];
  });

  form = this.fb.group({
    description: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    date: [new Date(), Validators.required],
    projectId: [null as string | null, Validators.required], 
    categoryId: [null as string | null, Validators.required],
    member: [null as string | null, Validators.required]
  });

  editingId: string | null = null;

  ngOnInit() {
    // Determine type from URL
    const url = this.router.url;
    this.isIncome = url.includes('income');

    // Subscribe to projectId changes
    this.form.controls.projectId.valueChanges.subscribe(val => {
        this.selectedProject.set(val);
        // Reset member when project changes (only if not initial load/edit)
        // We need to be careful not to wipe it during patchValue
        const currentMember = this.form.controls.member.value;
        const project = this.projects().find(p => p.id === val);
        if (project && currentMember && !project.members.includes(currentMember)) {
             this.form.controls.member.reset();
        }
    });

    // Check for ID param
    this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
            this.editingId = id;
            const transaction = this.service.getTransactionById(id);
            if (transaction) {
                // Determine type from transaction if needed, but route usually dictates logic
                this.isIncome = transaction.type === 'Income'; 
                
                // Patch form
                this.form.patchValue({
                    description: transaction.description,
                    amount: transaction.amount,
                    date: transaction.date,
                    projectId: transaction.projectId,
                    categoryId: transaction.categoryId,
                    member: transaction.member
                });
            }
        } else {
             // Set default project if available (New Mode)
            if (this.projects().length > 0) {
                const defaultProj = this.projectService.activeProject() || this.projects()[0];
                if (defaultProj) {
                    this.form.patchValue({ projectId: defaultProj.id });
                }
            }
        }
    });
  }

  onSubmit() {
    if (this.form.valid) {
        const val = this.form.value;
        
        if (this.editingId) {
             this.service.updateTransaction(this.editingId, {
                description: val.description!,
                amount: val.amount!,
                date: val.date!,
                projectId: val.projectId!,
                categoryId: val.categoryId!,
                member: val.member!,
                type: this.isIncome ? 'Income' : 'Expense'
            });
        } else {
            this.service.addTransaction({
                description: val.description!,
                amount: val.amount!,
                date: val.date!,
                projectId: val.projectId!,
                categoryId: val.categoryId!,
                member: val.member!,
                type: this.isIncome ? 'Income' : 'Expense'
            });
        }
        this.router.navigate(['/dashboard']);
    }
  }
}
