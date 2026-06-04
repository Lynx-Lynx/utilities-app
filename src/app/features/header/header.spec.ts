import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { Header } from './header';
import { AuthService } from '../../shared/services/auth.service';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let router: Router;
  let logOut: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    logOut = vi.fn(() => of(null));

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            user: signal({ name: 'Ada', picture: 'avatar.png' }),
            logOut,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('user avatar img src is bound to user().picture', () => {
    const img = (fixture.nativeElement as HTMLElement).querySelector<HTMLImageElement>('.header__logo');
    expect(img?.src).toContain('avatar.png');
  });

  it('clicking a tab button navigates to the correct route', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const tabs = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.header__tab');
    tabs[1].click();
    expect(navigateSpy).toHaveBeenCalledWith(['/history']);
  });

  it('clicking logout calls authService.logOut() and navigates to /login', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const logoutBtn = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.header__logout');
    logoutBtn!.click();
    expect(logOut).toHaveBeenCalledOnce();
    await fixture.whenStable();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
