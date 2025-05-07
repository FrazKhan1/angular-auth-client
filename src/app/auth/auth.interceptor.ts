import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserEncService } from './user-enc.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(UserEncService);  // Use inject() here
  const user = authService.getUser();
  const token = user?.token;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};
