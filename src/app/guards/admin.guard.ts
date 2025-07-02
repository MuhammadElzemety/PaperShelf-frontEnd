import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RoleService } from '../services/role.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  private roleService = inject(RoleService);
  private router = inject(Router);

  canActivate(): boolean {
    const userRole = this.roleService.getRole();

    if (!this.roleService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (userRole === 'admin') {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}
