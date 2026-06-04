import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { authGuard } from './auth-guard';
import { AuthService } from '../../shared/services/auth.service';

function runGuard() {
  return TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );
}

describe('authGuard', () => {
  let mockAuthService: { user: ReturnType<typeof signal<{ name: string; picture: string } | null>> };

  beforeEach(() => {
    mockAuthService = { user: signal<{ name: string; picture: string } | null>(null) };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
  });

  it('emits true when user is already set', () => {
    mockAuthService.user.set({ name: 'Ada', picture: 'avatar.png' });
    return new Promise<void>((resolve) => {
      (runGuard() as any).subscribe((result: boolean) => {
        expect(result).toBe(true);
        resolve();
      });
    });
  });

  it('emits true after user is set asynchronously', () => {
    // guard only resolves when user is truthy — a permanently-null user causes it to wait forever
    const result$ = runGuard() as any;
    const promise = new Promise<void>((resolve) => {
      result$.subscribe((result: boolean) => {
        expect(result).toBe(true);
        resolve();
      });
    });
    mockAuthService.user.set({ name: 'Ada', picture: 'avatar.png' });
    return promise;
  });
});
