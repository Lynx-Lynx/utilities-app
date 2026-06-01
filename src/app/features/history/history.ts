import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Column, columns } from './columns.config';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { HistoryRecord, TableData } from './history.interface';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [TableModule],
  providers: [DatePipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History implements OnInit {
  public readonly config = signal<Column[]>(columns);
  public readonly data = signal<TableData[]>([]);
  private destroyRef = inject(DestroyRef);

  constructor(
    private UtilitiesService: UtilitiesService,
    private date: DatePipe,
  ) {}

  public ngOnInit(): void {
    this.getPaymentHistory();
  }

  private updateTableData(response: HistoryRecord[]): void {
    const payload: TableData[] = response.map((record) => ({
      year: this.date.transform(record.billingPeriod, 'yyyy') as string,
      month: this.date.transform(record.billingPeriod, 'MMMM') as string,
      water: record?.metrics?.water ?? 0,
      electricity: record?.metrics?.electricity ?? 0,
      heating: record?.metrics?.heating.paid ?? 0,
      security: record?.metrics?.security.paid ?? 0,
      service: record?.metrics?.service.paid ?? 0,
      total: record?.totalPaid ?? 0,
    }));
    this.data.set(payload);
  }

  private getPaymentHistory(): void {
    this.UtilitiesService
      .getHistory()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.updateTableData(response),
        error: (err) => console.error('Error fetching history data:', err),
      });
  }

  public setPage(event: any): void {
    console.log(event);
  }
}
