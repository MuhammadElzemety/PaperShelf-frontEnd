import { Component, OnInit } from '@angular/core';
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
export class DashboradHeaderComponent implements OnInit{
  name: string | null = null;
  email: string | null = null;
  
  constructor(public linkserv: AuthService, private logoutserv: RoleService) { }

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.email = user.email;
      this.name = user.name;
    }
  }
  logout() {
    this.logoutserv.logout();
  }
}
