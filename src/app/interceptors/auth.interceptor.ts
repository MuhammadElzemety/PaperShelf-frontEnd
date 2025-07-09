import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');
  const authService = inject(AuthService);
  const router = inject(Router);

  if (req.url.includes('/auth/refresh-token')) {
    return next(req);
  }

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            const newToken = localStorage.getItem('accessToken');
            if (!newToken) {
              
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => error);
            }

            const newAuthReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            
            return next(newAuthReq);
          }),
          catchError((refreshError) => {
            
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
