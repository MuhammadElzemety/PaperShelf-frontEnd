import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');
  const authService = inject(AuthService);

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('[authInterceptor] Got 401, trying to refresh token...');
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            const newToken = localStorage.getItem('accessToken');
            const newAuthReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            return next(newAuthReq);
          })
        );
      }
      return throwError(() => error);
    })
  );
};