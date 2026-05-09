import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (): MaybeAsync<GuardResult> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return Boolean(authService.user()) || router.createUrlTree(['/login']);
};
