import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (): MaybeAsync<GuardResult> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return toObservable(authService.user).pipe(
    filter((user) => !!user),
    take(1),
    map((user) => (user ? true : router.createUrlTree(['/login'])))
  );
};
