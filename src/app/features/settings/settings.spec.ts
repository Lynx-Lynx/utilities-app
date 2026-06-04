import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Settings } from './settings';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { DateService } from '../../shared/services/date.service';
import { HistoryRecord } from '../history/history.interface';

function makeRecord(tariffs: HistoryRecord['tariffs']): HistoryRecord {
  return {
    billingPeriod: '2025-05',
    status: 'paid',
    metrics: {
      water: { consumption: 0, registered: 0, paid: 0 },
      electricity: { consumption: 0, registered: 0, paid: 0 },
      heating: { paid: 0 },
      security: { paid: 0 },
      service: { paid: 0 },
    },
    tariffs,
    totalPaid: 0,
    metadata: { createdAt: '', updatedAt: '' },
  };
}

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;
  let latestRecord: ReturnType<typeof signal<HistoryRecord | null>>;
  let setTariffs: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    latestRecord = signal<HistoryRecord | null>(null);
    setTariffs = vi.fn(() => of({}));

    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [
        {
          provide: UtilitiesService,
          useValue: {
            latestRecord,
            getLatestRecord: vi.fn(() => of(null)),
            setTariffs,
          },
        },
        {
          provide: DateService,
          useValue: { lastMonthAndYear: signal('May 2025') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form model pre-populates from latestRecord tariffs', () => {
    const tariffs = { water: 5, electricity: 0.4, security: 30, service: 20 };
    latestRecord.set(makeRecord(tariffs));
    fixture.detectChanges();
    component.submit();
    expect(setTariffs).toHaveBeenCalledWith(tariffs);
  });

  it('submit() calls setTariffs with the current model', () => {
    component.submit();
    expect(setTariffs).toHaveBeenCalledWith({ water: null, electricity: null, security: null, service: null });
  });
});
