/** Mock Ibovespa + movimentação — substituir por API. */

export type IbovespaPeriod = "1D" | "7D" | "30D" | "6M" | "1A" | "5A";

export const IBOVESPA_PERIODS: IbovespaPeriod[] = ["1D", "7D", "30D", "6M", "1A", "5A"];

export interface IbovespaChartPoint {
  label: string;
  ibov: number;
}

export interface StockMover {
  symbol: string;
  name: string;
  changePercent: number;
  priceBRL: number;
}

/** Série determinística (sem Math.random) para o gráfico não “pular” a cada render. */
function seq(base: number, deltas: number[]): IbovespaChartPoint[] {
  let v = base;
  return deltas.map((d) => {
    v += d;
    return { label: "", ibov: Math.round(v * 100) / 100 };
  });
}

const LABELS_1D = [
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

const D_1D = [
  0, 45, -22, 80, -15, 60, 30, -40, 55, -10, 25, -35, 70, 20, -25, 90, 15, -50, 40, -20, 35,
];

export const IBOVESPA_SERIES: Record<IbovespaPeriod, IbovespaChartPoint[]> = {
  "1D": seq(127980, D_1D).map((p, i) => ({
    ...p,
    label: LABELS_1D[i] ?? `${i}h`,
  })),
  "7D": seq(127200, [180, -90, 220, 140, -160, 310, 95]).map((p, i) => ({
    ...p,
    label: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i] ?? `${i}`,
  })),
  "30D": seq(
    125800,
    Array.from({ length: 30 }, (_, i) => Math.sin(i / 4.5) * 140 + (i % 5) * 12),
  ).map((p, i) => ({ ...p, label: `${i + 1}` })),
  "6M": seq(
    121400,
    [420, -180, 310, -90, 520, -240, 380, 110, -150, 290, 200, -80, 340, -120, 410, 90, -200, 260, 150, -70, 310, 40, -130, 220, 180, -60],
  ).map((p, i) => ({ ...p, label: `S${i + 1}` })),
  "1A": seq(118200, [800, -400, 600, 200, -350, 900, 150, -500, 700, 250, -200, 550]).map((p, i) => ({
    ...p,
    label: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][i] ?? `M${i}`,
  })),
  "5A": seq(92000, [4200, -1800, 5100, -900, 3800]).map((p, i) => ({
    ...p,
    label: ["2021", "2022", "2023", "2024", "2025"][i] ?? `${i}`,
  })),
};

export const IBOVESPA_HEADLINE = {
  value: 128_420.12,
  changePct: 0.42,
  changePts: 538.5,
};

/** ISO — exibido como “última atualização” (mock). */
export const IBOVESPA_LAST_UPDATED_ISO = "2026-04-05T16:45:00-03:00";

export const STOCK_GAINERS: StockMover[] = [
  { symbol: "HAPV3", name: "Hapvida", changePercent: 5.82, priceBRL: 18.05 },
  { symbol: "MGLU3", name: "Magazine Luiza", changePercent: 4.2, priceBRL: 2.87 },
  { symbol: "PETR4", name: "Petrobras PN", changePercent: 3.12, priceBRL: 38.42 },
  { symbol: "WEGE3", name: "WEG ON", changePercent: 2.91, priceBRL: 42.15 },
  { symbol: "VALE3", name: "Vale ON", changePercent: 2.05, priceBRL: 62.1 },
];

export const STOCK_LOSERS: StockMover[] = [
  { symbol: "BHIA3", name: "Via", changePercent: -4.35, priceBRL: 0.88 },
  { symbol: "CVCB3", name: "CVC Brasil", changePercent: -3.18, priceBRL: 3.05 },
  { symbol: "AZUL4", name: "Azul PN", changePercent: -2.64, priceBRL: 12.18 },
  { symbol: "SOMA3", name: "Grupo Soma", changePercent: -2.1, priceBRL: 14.22 },
  { symbol: "RENT3", name: "Localiza", changePercent: -1.55, priceBRL: 11.42 },
];
