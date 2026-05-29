import type { AssetDetailPriceRange } from "@/types/asset-detail";

export function series(base: number, deltas: number[]): number[] {
  let v = base;
  return deltas.map((d) => {
    v += d;
    return Math.round(v * 100) / 100;
  });
}

export function buildDefaultPriceHistory(basePrice: number): AssetDetailPriceRange[] {
  return [
    {
      range: "1D",
      data: series(basePrice * 0.98, [
        0.08, -0.05, 0.12, 0.04, -0.09, 0.15, 0.06, -0.03, 0.11, 0.07, -0.02, 0.09, 0.14, -0.06, 0.1, 0.05,
        -0.04, 0.08, 0.12, 0.03, -0.07, 0.11, 0.06, 0.04,
      ]),
    },
    { range: "1W", data: series(basePrice * 0.96, [0.35, -0.18, 0.42, 0.28, -0.22, 0.55, 0.31]) },
    {
      range: "1M",
      data: series(basePrice * 0.93, Array.from({ length: 30 }, (_, i) => Math.sin(i / 5) * 0.35 + 0.12)),
    },
    {
      range: "3M",
      data: series(basePrice * 0.9, Array.from({ length: 36 }, (_, i) => Math.sin(i / 5) * 0.35 + 0.12)),
    },
    {
      range: "6M",
      data: series(basePrice * 0.85, [0.45, -0.2, 0.38, 0.52, -0.15, 0.62, 0.28, -0.18, 0.48, 0.35, 0.22, -0.1]),
    },
    { range: "1Y", data: series(basePrice * 0.78, [0.55, 0.32, -0.28, 0.68, 0.42, -0.35, 0.72, 0.48, -0.22, 0.58, 0.35, 0.28]) },
    { range: "MAX", data: series(basePrice * 0.58, [0.8, 0.45, -0.35, 1.1, 0.62, -0.48, 0.95, 0.7, -0.4, 1.2, 0.85, 0.55]) },
  ];
}

export function hashTicker(ticker: string): number {
  let h = 0;
  for (let i = 0; i < ticker.length; i++) h = (h * 31 + ticker.charCodeAt(i)) >>> 0;
  return h;
}
