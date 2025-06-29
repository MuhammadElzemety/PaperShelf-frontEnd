import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterLink, 
    RouterLinkActive],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.css'
})
export class ForgotPasswordFormComponent {

  forgetForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private forgotpass: AuthService,
    private router: Router
  ) {
    this.forgetForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }
  onSubmit() {
    this.errorMessage = null;
    this.forgetForm.markAllAsTouched();

    if (this.forgetForm.valid) {
      const { email, password } = this.forgetForm.value;

      this.forgotpass.requestPasswordReset({ email}).subscribe({
        next: (response) => {
          console.log('Code Send successful:', response);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.router.navigate(['/auth/otp']);
        },
        error: (err: any) => {
          console.error('❌ Verfiy failed:', err);
          this.errorMessage = err.error?.message || 'Code Sent failed. Please try again.';
        }
      });
    } else {
      console.log('❌ Form is invalid. Please check the fields.');
      this.errorMessage = 'Please correct the highlighted errors to proceed.';
    }
  }

  
}

