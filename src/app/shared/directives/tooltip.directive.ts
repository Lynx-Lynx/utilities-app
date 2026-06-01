import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  inject,
  input,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipComponent } from '../components/tooltip/tooltip';

@Directive({
  selector: '[tooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  public readonly tooltip = input.required<string>();

  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef<HTMLElement>);
  private overlayRef: OverlayRef | null = null;
  private componentRef: ComponentRef<TooltipComponent> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('mouseenter')
  show(): void {
    if (this.overlayRef) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.componentRef = this.overlayRef.attach(new ComponentPortal(TooltipComponent));
    this.componentRef.instance.text.set(this.tooltip());
    this.componentRef.instance.fading.set(false);
  }

  @HostListener('mouseleave')
  hide(): void {
    if (!this.componentRef) return;
    this.componentRef.instance.fading.set(true);
    this.hideTimer = setTimeout(() => this.destroy(), 220);
  }

  private destroy(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.componentRef = null;
  }

  ngOnDestroy(): void {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.destroy();
  }
}