import type { AssetCandle, AssetDetailPriceRange } from "@/types/asset-detail";

const BAR_SECONDS: Record<string, number> = {
  "1D": 3600,
  "1W": 86400,
  "1M": 86400,
  "3M": 86400,
  "6M": 604_800,
  "1Y": 2_592_000,
  MAX: 5_184_000,
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** Gera velas OHLCV determinísticas a partir de preços de fechamento. */
export function buildCandlesFromCloses(closes: number[], barSeconds: number): AssetCandle[] {
  const n = closes.length;
  if (n === 0) return [];

  const endSec = Math.floor(Date.now() / 1000);
  const startSec = endSec - (n - 1) * barSeconds;

  return closes.map((close, i) => {
    const open = i > 0 ? closes[i - 1]! : close * 0.998;
    const body = Math.abs(close - open);
    const wick = Math.max(body * 0.65, close * 0.0018);
    const high = Math.max(open, close) + wick * (0.35 + (i % 4) * 0.08);
    const low = Math.min(open, close) - wick * (0.35 + (i % 3) * 0.07);
    const volume = Math.round(650_000 + ((i * 7919 + close * 100) % 4_200_000));

    return {
      time: startSec + i * barSeconds,
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
      volume,
    };
  });
}

export function getCandlesForRange(entry: AssetDetailPriceRange | undefined): AssetCandle[] {
  if (!entry) return [];
  if (entry.candles?.length) return entry.candles;
  const barSec = BAR_SECONDS[entry.range] ?? 86_400;
  return buildCandlesFromCloses(entry.data, barSec);
}

export function attachCandlesToPriceHistory(ranges: AssetDetailPriceRange[]): AssetDetailPriceRange[] {
  return ranges.map((entry) => ({
    ...entry,
    candles: entry.candles ?? buildCandlesFromCloses(entry.data, BAR_SECONDS[entry.range] ?? 86_400),
  }));
}
