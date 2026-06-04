import { UtilitiesService } from './../../shared/services/utilities.service';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { DateService } from '../../shared/services/date.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface UtilityMetrics {
  water: number | null;
  electricity: number | null;
  heating: number | null;
}

@Component({
  selector: 'app-current',
  standalone: true,
  imports: [InputNumberModule, FormsModule],
  templateUrl: './current.html',
  styleUrl: './current.scss',
})
export class Current {
  public dateService = inject(DateService);
  public utilitiesService = inject(UtilitiesService);
  private destroyRef = inject(DestroyRef);

  public readonly alreadyPaid = computed(() => {
    const record = this.utilitiesService.latestRecord();
    if (!record?.billingPeriod) return false;
    return this.dateService.prevMonthIsPaid(record);
  });

  private readonly model = signal<UtilityMetrics>({
    water: null,
    electricity: null,
    heating: null,
  });
  protected readonly metricsForm = form(this.model);

  ngOnInit(): void {
    this.utilitiesService.getLatestRecord().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public submit(): void {
    const { water, electricity, heating } = this.model();
    this.utilitiesService
      .submitCurrentMetrics({ water, electricity, heating })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (record) => this.utilitiesService.latestRecord.set(record),
      });
  }
}
