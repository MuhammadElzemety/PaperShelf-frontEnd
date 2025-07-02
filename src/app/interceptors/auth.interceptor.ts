import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken'); 

  if (token) {
    console.log('[authInterceptor] Attaching token:', token);

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq);
  } else {
    console.log('[authInterceptor] No token found, sending request without token');
    return next(req);
  }
};
