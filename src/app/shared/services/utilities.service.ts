import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { HistoryRecord } from '../../features/history/history.interface';
import { environment } from '../../../environments/environment';
import { TariffSettings } from '../../features/settings/settings';

@Injectable({ providedIn: 'root' })
export class UtilitiesService {
  public readonly latestRecord = signal<HistoryRecord | null>(null);
  private readonly http = inject(HttpClient);

  private readonly latestRecord$ = this.http
    .get<HistoryRecord>(`${environment.host}/api/utilities/latest`)
    .pipe(
      tap((record) => this.latestRecord.set(record)),
      catchError((err) => {
        this.latestRecord.set(null);
        return of(err);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  private readonly history$ = this.http
    .get<HistoryRecord[]>(`${environment.host}/api/utilities`)
    .pipe(
      catchError((err) => of(err)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  public getLatestRecord(): Observable<HistoryRecord> {
    return this.latestRecord$;
  }

  public getHistory(): Observable<HistoryRecord[]> {
    return this.history$;
  }

  public submitCurrentMetrics(metrics: { water: number | null; electricity: number | null; heating: number | null }): Observable<any> {
    return this.http.post(`${environment.host}/api/utilities`, metrics);
  }

  public setTariffs(tariffs: TariffSettings): Observable<any> {
    return this.http.post(`${environment.host}/api/utilities/tariffs`, tariffs);
  }
}
