import { Component, DestroyRef, inject, linkedSignal } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateService } from '../../shared/services/date.service';
import { UtilitiesService } from '../../shared/services/utilities.service';

export interface TariffSettings {
  water: number | null;
  electricity: number | null;
  security: number | null;
  service: number | null;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  imports: [InputNumberModule, FormsModule],
})
export class Settings {
  public dateService = inject(DateService);
  private http = inject(UtilitiesService);
  private utilitiesService = inject(UtilitiesService);
  private destroyRef = inject(DestroyRef);

  private readonly model = linkedSignal<TariffSettings>(() => {
    const tariffs = this.http.latestRecord()?.tariffs;
    return {
      water: tariffs?.water ?? null,
      electricity: tariffs?.electricity ?? null,
      security: tariffs?.security ?? null,
      service: tariffs?.service ?? null,
    };
  });
  protected readonly tariffsForm = form(this.model);

  ngOnInit(): void {
    this.http.getLatestRecord().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  public submit(): void {
    this.utilitiesService
      .setTariffs(this.model())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
