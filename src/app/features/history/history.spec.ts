import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { History } from './history';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { HistoryRecord } from './history.interface';

const RECORD: HistoryRecord = {
  billingPeriod: '2025-04-01',
  status: 'paid',
  metrics: {
    water: { consumption: 10, registered: 10, paid: 50 },
    electricity: { consumption: 200, registered: 200, paid: 80 },
    heating: { paid: 120 },
    security: { paid: 30 },
    service: { paid: 20 },
  },
  tariffs: { water: 5, electricity: 0.4, security: 30, service: 20 },
  totalPaid: 300,
  metadata: { createdAt: '2025-05-01', updatedAt: '2025-05-01' },
};

describe('History', () => {
  let component: History;
  let fixture: ComponentFixture<History>;
  let getHistory: ReturnType<typeof vi.fn>;

  async function setup(response: any) {
    getHistory = vi.fn(() => response);
    await TestBed.configureTestingModule({
      imports: [History],
      providers: [{ provide: UtilitiesService, useValue: { getHistory } }],
    }).compileComponents();

    fixture = TestBed.createComponent(History);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', async () => {
    await setup(of([]));
    expect(component).toBeTruthy();
  });

  it('maps HistoryRecord fields to TableData correctly', async () => {
    await setup(of([RECORD]));
    const row = component.data()[0];
    expect(row.year).toBe('2025');
    expect(row.month).toBe('April');
    expect(row.water).toEqual(RECORD.metrics.water);
    expect(row.electricity).toEqual(RECORD.metrics.electricity);
    expect(row.heating).toBe(RECORD.metrics.heating.paid);
    expect(row.security).toBe(RECORD.metrics.security.paid);
    expect(row.service).toBe(RECORD.metrics.service.paid);
    expect(row.total).toBe(RECORD.totalPaid);
  });

  it('data() remains empty when getHistory() errors', async () => {
    await setup(throwError(() => new Error('Network error')));
    expect(component.data()).toEqual([]);
  });
});
