import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

interface User {
  name: string;
  picture: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly user = signal<User | null>(null);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  public loginWithGoogle(): void {
    window.location.href = `${environment.host}/auth/google`;
  }

  public logOut(): Observable<Object | null> {
    return this.http.post(`${environment.host}/auth/logout`, {}).pipe(
      catchError(() => {
        this.user.set(null);
        this.router.navigate(['/login']);
        return of(null);
      })
    );
  }

  public getUserInfo(): Observable<User | null> {
    return this.http.get<User>(`${environment.host}/api/me`).pipe(
      tap((user) => this.user.set(user)),
      catchError(() => {
        this.user.set(null);
        this.router.navigate(['/login']);
        return of(null);
      })
    );
  }
}


