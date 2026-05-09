import { AuthService } from './../../services/auth.service';
import { Component, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly tabs: string[];
  public readonly activeTab: WritableSignal<number>;

  constructor(public authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.tabs = ['current', 'history', 'settings'];
    this.activeTab = signal(0);
  }

  public switchTab(index: number): void {
    this.activeTab.set(index);
    this.router.navigate([`/${this.tabs.at(index)}`]);
  }
}
