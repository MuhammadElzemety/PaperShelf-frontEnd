import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthComponent } from './auth/auth.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , AuthComponent , NavbarComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(public linkserv : AuthService){}
  title = 'paper_shelf';
}
