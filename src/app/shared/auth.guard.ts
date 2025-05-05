import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserEncService } from '../auth/user-enc.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserEncService);
  const router = inject(Router);

  const user = authService.getUser();
  return user?.token ? true : router.createUrlTree(['/login']);
};
