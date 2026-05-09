export interface HistoryRecord {
  billingPeriod: string;
  metrics: {
    water: { consumption: number; registered: number; paid: number };
    electricity: { consumption: number; registered: number; paid: number };
    heating: { paid: number };
    security: { paid: number };
    service: { paid: number };
  };
  tariffs: {
    water: number;
    electricity: number;
    security: number;
    service: number;
  };
  totalPaid: number;
  status: 'paid' | 'pending';
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

export interface TableData {
  electricity: { consumption: number; registered: number; paid: number };
  heating: number;
  month: string;
  security: number;
  service: number;
  total: number;
  water: { consumption: number; registered: number; paid: number };
  year: string;
}