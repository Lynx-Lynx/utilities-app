import { TitleCasePipe } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TitleCasePipe, TooltipDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  public authService = inject(AuthService);

  public readonly tabs = signal<string[]>(['current', 'history', 'settings']);
  public readonly currentTab = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects.substring(1)),
    ),
    { initialValue: this.router.url },
  );

  public switchTab(tab: string): void {
    this.router.navigate([`/${tab}`]);
  }

  public logOut(): void {
    this.authService
      .logOut()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => this.router.navigate(['/login']),
      });
  }
}
