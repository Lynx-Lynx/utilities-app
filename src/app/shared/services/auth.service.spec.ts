import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from './auth.service';

const BASE = 'http://localhost:3000';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => httpController.verify());

  it('getUserInfo() sets user signal on success', () => {
    const user = { name: 'Ada', picture: 'avatar.png' };
    service.getUserInfo().subscribe();
    httpController.expectOne(`${BASE}/api/me`).flush(user);
    expect(service.user()).toEqual(user);
  });

  it('getUserInfo() clears user signal and navigates to /login on error', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    service.getUserInfo().subscribe();
    httpController.expectOne(`${BASE}/api/me`).flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(service.user()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('logOut() clears user signal and navigates to /login on HTTP error', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    service.logOut().subscribe();
    httpController.expectOne(`${BASE}/auth/logout`).flush('error', { status: 500, statusText: 'Server Error' });
    expect(service.user()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('loginWithGoogle() sets window.location.href to the Google auth URL', () => {
    let capturedHref = '';
    Object.defineProperty(window, 'location', {
      value: { ...window.location, set href(v: string) { capturedHref = v; } },
      writable: true,
      configurable: true,
    });
    service.loginWithGoogle();
    expect(capturedHref).toBe(`${BASE}/auth/google`);
  });
});
