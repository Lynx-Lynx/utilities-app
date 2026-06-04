import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TooltipDirective } from './tooltip.directive';

@Component({
  template: `<button [tooltip]="'Sign Out'">X</button>`,
  imports: [TooltipDirective],
})
class HostComponent {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let button: HTMLButtonElement;
  let directive: TooltipDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
    directive = fixture.debugElement.query(By.directive(TooltipDirective)).injector.get(TooltipDirective);
  });

  it('mouseenter creates an overlay with the tooltip text and fading false', () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    // Access private fields via any to assert internal state
    const compRef = (directive as any).componentRef;
    expect(compRef).not.toBeNull();
    expect(compRef.instance.text()).toBe('Sign Out');
    expect(compRef.instance.fading()).toBe(false);
  });

  it('mouseleave sets fading to true on the attached component', () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    const compRef = (directive as any).componentRef;
    button.dispatchEvent(new MouseEvent('mouseleave'));
    expect(compRef.instance.fading()).toBe(true);
  });

  it('overlay is disposed after mouseleave + 220ms', async () => {
    vi.useFakeTimers();
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    button.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(220);
    vi.useRealTimers();
    expect((directive as any).overlayRef).toBeNull();
    expect((directive as any).componentRef).toBeNull();
  });

  it('a second mouseenter while overlay is open does not create a second overlay', () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    const firstRef = (directive as any).overlayRef;
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect((directive as any).overlayRef).toBe(firstRef);
  });
});
