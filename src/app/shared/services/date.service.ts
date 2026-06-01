import { computed, Injectable } from '@angular/core';
import { Temporal } from '@js-temporal/polyfill';
import { HistoryRecord } from '../../features/history/history.interface';

@Injectable({ providedIn: 'root' })
export class DateService {
  private readonly today = Temporal.Now.plainDateISO();
  private readonly prevMonth = this.today.subtract({ months: 1 });
  private readonly dateRange = { start: 1, end: this.prevMonth.daysInMonth };

  public lastMonthAndYear = computed(() =>
    this.prevMonth.toLocaleString('default', { year: 'numeric', month: 'long' }),
  );
  public billingPeriodHeader = computed(() => {
    return `0${this.dateRange.start} ${this.lastMonthAndYear()} - ${this.dateRange.end} ${this.lastMonthAndYear()}`;
  });

  public prevMonthIsPaid(record: HistoryRecord): boolean {
    const { billingPeriod, status } = record;
    const paymentFor = Temporal.PlainDate.from(billingPeriod);
    return (
      paymentFor.year === this.prevMonth.year &&
      paymentFor.month === this.prevMonth.month &&
      status === 'paid'
    );
  }
}
