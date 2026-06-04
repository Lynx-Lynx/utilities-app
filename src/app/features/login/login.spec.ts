import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Login } from './login';
import { AuthService } from '../../shared/services/auth.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let loginWithGoogle: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    loginWithGoogle = vi.fn();

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [{ provide: AuthService, useValue: { loginWithGoogle } }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clicking the sign-in button calls loginWithGoogle()', () => {
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button');
    button!.click();
    expect(loginWithGoogle).toHaveBeenCalledOnce();
  });
});
