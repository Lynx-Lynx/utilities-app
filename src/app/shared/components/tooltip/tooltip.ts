import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  standalone: true,
})
export class TooltipComponent {
  public readonly text = signal('');
  public readonly fading = signal(false);
}
