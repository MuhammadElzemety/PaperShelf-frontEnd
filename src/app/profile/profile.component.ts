import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserAdminService } from '../services/user-admin.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  showEditName = false;
  showEditPassword = false;

  user: any;
  userId: string = '';

  editNameForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userAdminService: UserAdminService
  ) {
    this.editNameForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      currentPassword: ['', [Validators.required]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
        ]
      ],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.user = JSON.parse(storedUser);

      if (this.user?.token) {
        try {
          const tokenPayload = JSON.parse(atob(this.user.token.split('.')[1]));
          this.userId = tokenPayload.userId || tokenPayload._id || '';
        } catch (err) {
          this.toastr.error('Invalid token format.', 'Error', {
            toastClass: 'custom-toast error-toast',
            positionClass: 'custom-position'
          });
        }
      }

      if (!this.userId) {
        this.toastr.error('User ID not found. Please login again.', 'Error', {
          toastClass: 'custom-toast error-toast',
          positionClass: 'custom-position'
        });
      }
    } else {
      this.toastr.error('User not found. Please log in again.', 'Error', {
        toastClass: 'custom-toast error-toast',
        positionClass: 'custom-position'
      });
    }
  }

  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmNewPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  toggleEditName() {
    this.showEditName = !this.showEditName;
    if (this.showEditName) {
      this.showEditPassword = false;
      this.editNameForm.reset();
    }
  }

  toggleEditPassword() {
    this.showEditPassword = !this.showEditPassword;
    if (this.showEditPassword) {
      this.showEditName = false;
      this.passwordForm.reset();
    }
  }

  submitEditName() {
    if (this.editNameForm.invalid) {
      this.toastr.error('Please fill all fields correctly.', 'Invalid Input', {
        toastClass: 'custom-toast error-toast',
        positionClass: 'custom-position'
      });
      return;
    }

    const { name, currentPassword } = this.editNameForm.value;
    const payload = { name, currentPassword };

    this.userAdminService.updateOwnProfile(payload).subscribe({
      next: () => {
        this.user.name = name;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.toastr.success('Name updated successfully.', 'Success', {
          toastClass: 'custom-toast success-toast',
          positionClass: 'custom-position'
        });
        this.toggleEditName();
      },
      error: (err: any) => {
        this.toastr.error(`${err.error.message || 'Error updating name'}`, 'Update Failed', {
          toastClass: 'custom-toast error-toast',
          positionClass: 'custom-position'
        });
      }
    });
  }

  submitChangePassword() {
    if (this.passwordForm.invalid) {
      this.toastr.error('Please enter a valid password with all rules.', 'Invalid Input', {
        toastClass: 'custom-toast error-toast',
        positionClass: 'custom-position'
      });
      return;
    }

    const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm.value;
    const payload = { currentPassword, newPassword, confirmNewPassword };

    this.userAdminService.updateOwnProfile(payload).subscribe({
      next: () => {
        this.toastr.success('Password updated successfully.', 'Success', {
          toastClass: 'custom-toast success-toast',
          positionClass: 'custom-position'
        });
        this.toggleEditPassword();
      },
      error: (err: any) => {
        this.toastr.error(`${err.error.message || 'Error updating password'}`, 'Update Failed', {
          toastClass: 'custom-toast error-toast',
          positionClass: 'custom-position'
        });
      }
    });
  }
}
