import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {

  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)
      ]],
      role: ['', Validators.required] // ✅ Added role field
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      const { name, email, password, role } = this.registerForm.value;

      this.authService.register({ name, email, password, role }).subscribe({
        next: () => this.router.navigate(['/auth/verify']),
        error: (err: any) => {
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please correct the highlighted errors to proceed.';
    }
  }
}
