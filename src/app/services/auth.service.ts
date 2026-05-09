import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';

interface User {
  name: string;
  picture: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  public readonly user: WritableSignal<User | null>;

  constructor(private http: HttpClient) {
    this.user = signal(null);
  }

  public loginWithGoogle(): void {
    window.location.href = `${environment.host}/auth/google`;
  }

  public logOut(): void {
    window.location.href = `${environment.host}/auth/logout`;
  }

  public getUserInfo(): Observable<User> {
    return this.http.get<User>(`${environment.host}/api/me`).pipe(
      tap((user) => this.user.set(user)),
    );
  }
}


