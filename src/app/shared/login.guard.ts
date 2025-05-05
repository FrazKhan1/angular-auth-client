import { CanActivateFn, Router } from '@angular/router';
import { UserEncService } from '../auth/user-enc.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserEncService);
  const user = authService.getUser();
  const token = user?.token;

  if (token) {
    const router = new Router();
    router.navigate(['/']);
    return false;
  }
  return true;
};
