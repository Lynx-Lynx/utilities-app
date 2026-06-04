import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Current } from './current';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { DateService } from '../../shared/services/date.service';
import { HistoryRecord } from '../history/history.interface';

function makeRecord(billingPeriod: string, status: 'paid' | 'pending'): HistoryRecord {
  return {
    billingPeriod,
    status,
    metrics: {
      water: { consumption: 10, registered: 10, paid: 50 },
      electricity: { consumption: 200, registered: 200, paid: 80 },
      heating: { paid: 120 },
      security: { paid: 30 },
      service: { paid: 20 },
    },
    tariffs: { water: 5, electricity: 0.4, security: 30, service: 20 },
    totalPaid: 300,
    metadata: { createdAt: '', updatedAt: '' },
  };
}

describe('Current', () => {
  let component: Current;
  let fixture: ComponentFixture<Current>;
  let latestRecord: ReturnType<typeof signal<HistoryRecord | null>>;
  let submitCurrentMetrics: ReturnType<typeof vi.fn>;
  let prevMonthIsPaid: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    latestRecord = signal<HistoryRecord | null>(null);
    submitCurrentMetrics = vi.fn(() => of({ billingPeriod: '2025-04', totalPaid: 300 } as any));
    prevMonthIsPaid = vi.fn(() => false);

    await TestBed.configureTestingModule({
      imports: [Current],
      providers: [
        {
          provide: UtilitiesService,
          useValue: {
            latestRecord,
            getLatestRecord: vi.fn(() => of(null)),
            submitCurrentMetrics,
          },
        },
        {
          provide: DateService,
          useValue: {
            billingPeriodHeader: signal('01 May 2025 - 31 May 2025'),
            prevMonthIsPaid,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Current);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('alreadyPaid() is false when latestRecord is null', () => {
    expect(component.alreadyPaid()).toBe(false);
  });

  it('alreadyPaid() is false when prevMonthIsPaid returns false', () => {
    latestRecord.set(makeRecord('2025-05', 'pending'));
    fixture.detectChanges();
    expect(component.alreadyPaid()).toBe(false);
  });

  it('alreadyPaid() is true when latestRecord is set and prevMonthIsPaid returns true', () => {
    prevMonthIsPaid.mockReturnValue(true);
    latestRecord.set(makeRecord('2025-05', 'paid'));
    fixture.detectChanges();
    expect(component.alreadyPaid()).toBe(true);
  });

  it('submit() calls submitCurrentMetrics with the current model values', () => {
    component.submit();
    expect(submitCurrentMetrics).toHaveBeenCalledWith({ water: null, electricity: null, heating: null });
  });

  it('submit() updates latestRecord signal with the response', () => {
    component.submit();
    expect(latestRecord()).toEqual({ billingPeriod: '2025-04', totalPaid: 300 });
  });
});
