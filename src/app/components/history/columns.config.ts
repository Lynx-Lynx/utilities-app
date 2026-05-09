export interface Column {
  format: string;
  header: string;
  metric?: string;
  prop: string;
}

export const columns: Column[] = [
  {
    format: 'string',
    header: 'Month',
    prop: 'month',
  },
  {
    format: 'nested',
    header: 'Water',
    metric: 'm³',
    prop: 'water'
  },
  {
    format: 'nested',
    header: 'Electricity',
    metric: 'kWh',
    prop: 'electricity'
  },
  {
    format: 'currency',
    header: 'Heat. (₴)',
    prop: 'heating',
  },
  {
    format: 'currency',
    header: 'Security (₴)',
    prop: 'security',
  },
  {
    format: 'currency',
    header: 'Service (₴)',
    prop: 'service',
  },
  {
    format: 'currency',
    header: 'Total (₴)',
    prop: 'total',
  },
];
