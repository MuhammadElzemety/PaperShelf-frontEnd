import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-dashborad-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './dashborad-sidebar.component.html',
  styleUrl: './dashborad-sidebar.component.css'
})
export class DashboradSidebarComponent {

}

