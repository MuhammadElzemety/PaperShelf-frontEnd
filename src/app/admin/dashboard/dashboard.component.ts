import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboradFooterComponent } from '../dashborad-footer/dashborad-footer.component';
import { DashboradHeaderComponent } from '../dashborad-header/dashborad-header.component';
import { DashboradSidebarComponent } from '../dashborad-sidebar/dashborad-sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, DashboradFooterComponent, DashboradHeaderComponent, DashboradSidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  ngOnInit() {
    this.loadCSS('assets/admin/css/fonts.css');
    this.loadCSS('assets/admin/css/plugin.min.css');
    this.loadCSS('assets/admin/css/stylee.css');
    this.loadScriptSequentially([
      'assets/admin/js/plugins.min.js',
      'assets/admin/js/script.min.js'
    ]);
  }

  loadCSS(cssUrl: string) {
    const link = document.createElement('link');
    link.href = cssUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  loadScriptSequentially(scripts: string[]) {
    const loadNext = (index: number) => {
      if (index >= scripts.length) return;
      const script = document.createElement('script');
      script.src = scripts[index];
      script.defer = true;
      script.onload = () => loadNext(index + 1);
      document.body.appendChild(script);
    };
    loadNext(0);
  }
}
