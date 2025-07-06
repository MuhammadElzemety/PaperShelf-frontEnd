import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashborad-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashborad-header.component.html',
  styleUrl: './dashborad-header.component.css'
})
export class DashboradHeaderComponent {
  constructor(public linkserv: AuthService, private logoutserv: RoleService) { }
  logout() {
    this.logoutserv.logout();
  }
}
