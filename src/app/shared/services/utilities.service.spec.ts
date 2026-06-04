import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UtilitiesService } from './utilities.service';
import { HistoryRecord } from '../../features/history/history.interface';
import { TariffSettings } from '../../features/settings/settings';

const BASE = 'http://localhost:3000';

function makeRecord(overrides: Partial<HistoryRecord> = {}): HistoryRecord {
  return {
    billingPeriod: '2025-04',
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
    ...overrides,
  };
}

describe('UtilitiesService', () => {
  let service: UtilitiesService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UtilitiesService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('getLatestRecord() updates latestRecord signal on success', () => {
    const record = makeRecord();
    service.getLatestRecord().subscribe();
    httpController.expectOne(`${BASE}/api/utilities/latest`).flush(record);
    expect(service.latestRecord()).toEqual(record);
  });

  it('getLatestRecord() sets latestRecord to null on HTTP error', () => {
    service.getLatestRecord().subscribe();
    httpController
      .expectOne(`${BASE}/api/utilities/latest`)
      .flush('error', { status: 500, statusText: 'Server Error' });
    expect(service.latestRecord()).toBeNull();
  });

  it('getLatestRecord() shareReplay — two subscribers produce only one HTTP request', () => {
    const record = makeRecord();
    service.getLatestRecord().subscribe();
    service.getLatestRecord().subscribe();
    const req = httpController.expectOne(`${BASE}/api/utilities/latest`);
    req.flush(record);
    expect(service.latestRecord()).toEqual(record);
  });

  it('getHistory() emits the flushed array', () => {
    const records = [makeRecord(), makeRecord({ billingPeriod: '2025-03', totalPaid: 250 })];
    let result: HistoryRecord[] | undefined;
    service.getHistory().subscribe((r) => (result = r as HistoryRecord[]));
    httpController.expectOne(`${BASE}/api/utilities`).flush(records);
    expect(result).toEqual(records);
  });

  it('submitCurrentMetrics() POSTs to /api/utilities with the given body', () => {
    const metrics = { water: 1.5, electricity: 100, heating: 50 };
    service.submitCurrentMetrics(metrics).subscribe();
    const req = httpController.expectOne(`${BASE}/api/utilities`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(metrics);
    req.flush({});
  });

  it('setTariffs() POSTs to /api/utilities/tariffs with the given body', () => {
    const tariffs: TariffSettings = { water: 5, electricity: 0.4, security: 30, service: 20 };
    service.setTariffs(tariffs).subscribe();
    const req = httpController.expectOne(`${BASE}/api/utilities/tariffs`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(tariffs);
    req.flush({});
  });
});
