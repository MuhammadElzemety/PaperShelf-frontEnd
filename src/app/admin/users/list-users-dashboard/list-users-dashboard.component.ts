import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserAdminService } from '../../../services/user-admin.service';
import { CommonModule } from '@angular/common';
UserAdminService
@Component({
  selector: 'app-list-users-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-users-dashboard.component.html',
  styleUrls: ['./list-users-dashboard.component.css']
})
export class ListUsersDashboardComponent implements OnInit {
  users: any[] = [];
  filter: string | null = null;
  loading = true;
  currentPage = 1;
  pageSize = 20;
  totalUsers = 0;
  totalPages = 0;

  constructor(
    private route: ActivatedRoute,
    private UserAdminService: UserAdminService
  ) { }

  ngOnInit(): void {
    console.log('[ngOnInit] Component initialized');

    this.route.url.subscribe(urlSegments => {
      console.log('[Route URL] urlSegments:', urlSegments);

      if (urlSegments.length > 0) {
        const lastSegment = urlSegments[urlSegments.length - 1].path;
        console.log('[Route URL] lastSegment:', lastSegment);

        if (lastSegment === 'authors') {
          this.filter = 'author';
        } else if (lastSegment === 'admins') {
          this.filter = 'admin';
        } else {
          this.filter = null;
        }
      } else {
        this.filter = null;
      }

      console.log('[Filter] Current filter:', this.filter);
      this.loadUsers();
    });
  }

  loadUsers() {
    console.log(`[loadUsers] Loading users with filter=${this.filter}, page=${this.currentPage}, limit=${this.pageSize}`);

    this.loading = true;
    this.UserAdminService.getUsers(this.filter ?? undefined, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        console.log('[API Response] Users loaded:', res);
        this.users = res.users; 
        this.totalUsers = res.total || 0;
        this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
        this.loading = false;
        console.log(`[Users] Updated users list: ${this.users.length} users loaded. Total users: ${this.totalUsers}, Pages: ${this.totalPages}`);
      },
      error: (err) => {
        console.error('[API Error] Failed to load users:', err);
        this.loading = false;
      }
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    console.log(`[Pagination] Changing to page ${page}`);
    this.loadUsers();
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    console.log(`[Pagination] Changing page size to ${size}`);
    this.loadUsers();
  }
  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement; // ✅ التصحيح هنا
    const pageSize = target.value;
    console.log('[Pagination] Selected page size:', pageSize);
    // هنا ممكن تستخدم pageSize عشان تطبق pagination لو بتدعمه من الـ backend
  }
  viewUser(user: any) { console.log('[Action] View user:', user); }
  editUser(user: any) { console.log('[Action] Edit user:', user); }
  deleteUser(user: any) { console.log('[Action] Delete user:', user); }
}