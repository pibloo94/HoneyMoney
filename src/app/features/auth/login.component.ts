import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';

import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { Password } from 'primeng/password';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputText, ButtonDirective, Password, Toast],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-slate-800 mb-2">HoneyMoney</h1>
          <p class="text-slate-600">Inicia sesión en tu cuenta</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input 
              pInputText 
              id="email" 
              type="email" 
              formControlName="email"
              placeholder="tu@email.com"
              class="w-full"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
            <p-password 
              formControlName="password"
              [feedback]="false"
              [toggleMask]="true"
              placeholder="••••••••"
              styleClass="w-full"
              inputStyleClass="w-full"
            />
          </div>

          <button 
            pButton 
            type="submit" 
            label="Iniciar Sesión"
            [disabled]="form.invalid || loading"
            [loading]="loading"
            class="w-full"
          ></button>

          <div class="text-center text-sm text-slate-600">
            ¿No tienes cuenta? 
            <a routerLink="/register" class="text-indigo-600 hover:text-indigo-700 font-medium">Regístrate</a>
          </div>
        </form>
      </div>
      <p-toast />
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const { email, password } = this.form.value;

      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Sesión iniciada correctamente' });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Credenciales inválidas' });
        }
      });
    }
  }
}
