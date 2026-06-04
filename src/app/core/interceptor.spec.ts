import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { authInterceptor } from './interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpController: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => httpController.verify());

  it('sets withCredentials on every request', () => {
    http.get('/test').subscribe({ error: () => {} });
    const req = httpController.expectOne('/test');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('navigates to /login on a 401 response', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    http.get('/test').subscribe({ error: () => {} });
    httpController.expectOne('/test').flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('rethrows the error and does NOT navigate on non-401 errors', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    let caughtError: any;
    http.get('/test').subscribe({ error: (e) => (caughtError = e) });
    httpController.expectOne('/test').flush('Server Error', { status: 500, statusText: 'Server Error' });
    expect(caughtError?.status).toBe(500);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
