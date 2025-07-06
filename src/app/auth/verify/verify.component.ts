import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {

  verifyForm: FormGroup;
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      otp: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ]]
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.verifyForm.markAllAsTouched();

    if (this.verifyForm.valid) {
      const { otp } = this.verifyForm.value;

      this.authService.verifyEmail({otp}).subscribe({
        next: (response) => {
          console.log('✅ Email verified successfully!', response);
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          console.error('❌ OTP verification failed:', err);
          this.errorMessage = err.error?.message || 'OTP verification failed. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please enter the OTP code correctly.';
    }
  }
}
