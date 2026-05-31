import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { HistoryRecord } from '../components/history/history.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly recordsCache: WritableSignal<HistoryRecord[] | null>;

  constructor(private http: HttpClient) {
    this.recordsCache = signal(null);
  }

  public getLatestRecord(): Observable<HistoryRecord> {
    return this.http
      .get<HistoryRecord>(`${environment.host}/api/utilities/latest`)
      .pipe(
        // tap((records) => this.recordsCache.set(records)),
        // catchError((err) => {
        //   this.recordsCache.set(null);
        //   return of(err);
        // })
      );
  }

  public getHistory(): Observable<HistoryRecord[]> {
    if (this.recordsCache()) return of(this.recordsCache()) as Observable<HistoryRecord[]>;
    return this.http
      .get<HistoryRecord[]>(`${environment.host}/api/utilities`)
      .pipe(
        tap((records) => this.recordsCache.set(records)),
        catchError((err) => {
          this.recordsCache.set(null);
          return of(err);
        })
      );
  }
}
