import { TestBed } from '@angular/core/testing';
import { Temporal } from '@js-temporal/polyfill';
import { DateService } from './date.service';
import { HistoryRecord } from '../../features/history/history.interface';

function makeRecord(billingPeriod: string, status: 'paid' | 'pending'): HistoryRecord {
  return {
    billingPeriod,
    status,
    metrics: {
      water: { consumption: 0, registered: 0, paid: 0 },
      electricity: { consumption: 0, registered: 0, paid: 0 },
      heating: { paid: 0 },
      security: { paid: 0 },
      service: { paid: 0 },
    },
    tariffs: { water: 0, electricity: 0, security: 0, service: 0 },
    totalPaid: 0,
    metadata: { createdAt: '', updatedAt: '' },
  };
}

describe('DateService', () => {
  let service: DateService;
  const prevMonth = Temporal.Now.plainDateISO().subtract({ months: 1 });
  const prevMonthISO = `${prevMonth.year}-${String(prevMonth.month).padStart(2, '0')}`;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateService);
  });

  it('lastMonthAndYear() contains the previous month year', () => {
    expect(service.lastMonthAndYear()).toContain(String(prevMonth.year));
  });

  it('billingPeriodHeader() starts with "01 " and includes lastMonthAndYear twice', () => {
    const header = service.billingPeriodHeader();
    const monthYear = service.lastMonthAndYear();
    expect(header.startsWith('01 ')).toBe(true);
    expect(header.split(monthYear).length - 1).toBe(2);
  });

  it('prevMonthIsPaid() returns true for the previous month with status paid', () => {
    expect(service.prevMonthIsPaid(makeRecord(prevMonthISO, 'paid'))).toBe(true);
  });

  it('prevMonthIsPaid() returns false for the previous month with status pending', () => {
    expect(service.prevMonthIsPaid(makeRecord(prevMonthISO, 'pending'))).toBe(false);
  });

  it('prevMonthIsPaid() returns false for the current month', () => {
    const today = Temporal.Now.plainDateISO();
    const currentISO = `${today.year}-${String(today.month).padStart(2, '0')}`;
    expect(service.prevMonthIsPaid(makeRecord(currentISO, 'paid'))).toBe(false);
  });

  it('prevMonthIsPaid() returns false for two months ago', () => {
    const twoMonthsAgo = Temporal.Now.plainDateISO().subtract({ months: 2 });
    const twoMonthsISO = `${twoMonthsAgo.year}-${String(twoMonthsAgo.month).padStart(2, '0')}`;
    expect(service.prevMonthIsPaid(makeRecord(twoMonthsISO, 'paid'))).toBe(false);
  });
});
