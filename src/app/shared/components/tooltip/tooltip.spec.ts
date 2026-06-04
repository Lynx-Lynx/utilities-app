import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipComponent } from './tooltip';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the text signal value inside .custom-tooltip', () => {
    component.text.set('Sign Out');
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector('.custom-tooltip');
    expect(el?.textContent?.trim()).toBe('Sign Out');
  });

  it('adds custom-tooltip--fading class when fading signal is true', () => {
    component.fading.set(true);
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector('.custom-tooltip');
    expect(el?.classList.contains('custom-tooltip--fading')).toBe(true);
  });
});
