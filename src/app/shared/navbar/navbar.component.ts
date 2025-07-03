import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';
import { Subscription } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink , RouterLinkActive , CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
role: string | null = null;
name: string | null = null;
  private userSub!: Subscription;
  constructor(public linkserv : AuthService , private logoutserv:RoleService ) {   
   }
  @ViewChild('cartSidebar') cartSidebar!: ElementRef;

private cartInstance: any;
  ngOnInit(): void {
    this.userSub = this.logoutserv.userChanged.subscribe(user => {
      if (user) {
        this.role = user.role;
        this.name = user.name;
      } else {
        this.role = null;
        this.name = null;
      }
    });
    // Trigger initial value
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.role = user.role;
      this.name = user.name;
    }
  }
ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
toggleCart() {
  if (!this.cartInstance) {
    this.cartInstance = new bootstrap.Offcanvas(this.cartSidebar.nativeElement);
  }

  if (this.cartSidebar.nativeElement.classList.contains('show')) {
    this.cartInstance.hide();
  } else {
    this.cartInstance.show();
  }
}
  
  logout() {
    this.logoutserv.logout();
  }
}
