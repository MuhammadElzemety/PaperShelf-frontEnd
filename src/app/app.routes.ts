import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { RegisterFormComponent } from './auth/register-form/register-form.component';
import { ForgotPasswordFormComponent } from './auth/forgot-password-form/forgot-password-form.component';
import { OtpFormComponent } from './auth/otp-form/otp-form.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { MainShopComponent } from './shop/main-shop/main-shop.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { HomeComponent } from './home/home.component';
import { roleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
import { BookSliderComponent } from './book-slider/book-slider.component';
import { DashboardGuard } from './guards/admin.guard';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { NotFoundDashboardComponent } from './admin/not-found-dashboard/not-found-dashboard.component';
import { HomeDashboardComponent } from './admin/home-dashboard/home-dashboard.component';
import { ListUsersDashboardComponent } from './admin/users/list-users-dashboard/list-users-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginFormComponent },
      { path: 'register', component: RegisterFormComponent },
      { path: 'forgot', component: ForgotPasswordFormComponent },
      { path: 'otp', component: OtpFormComponent },
      { path: 'verify', component: VerifyComponent },
    ],
  },

  { path: 'shop', component: MainShopComponent },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'book', component: BookSliderComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [DashboardGuard],
    children: [
      { path: '', component: HomeDashboardComponent },
      { path: 'users', component: ListUsersDashboardComponent },
      { path: 'users/authors', component: ListUsersDashboardComponent },
      { path: 'users/admins', component: ListUsersDashboardComponent },
      { path: '**', component: NotFoundDashboardComponent },
    ],
  },
  { path: '**', component: NotfoundComponent, canActivate: [AuthGuard] },
];
