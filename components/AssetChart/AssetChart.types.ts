/** Ponto da série de preço (fechamento). */
export interface AssetChartPoint {
  time: number;
  close: number;
  label: string;
}

export interface AssetChartProps {
  candles: Array<{ time: number; close: number }>;
  rangeKey: string;
  currencyLabel?: string;
  minHeight?: number;
  className?: string;
}
