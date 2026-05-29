import type { FundamentalIndicatorItem } from "@/utils/stock-fundamental-indicators";

export type AssetType = "STOCK_BR" | "FII" | "ETF_BR" | "STOCK_US" | "ETF_US" | "CRYPTO";
export type AssetCurrency = "BRL" | "USD" | "EUR";

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  STOCK_BR: "Ação",
  FII: "FII",
  ETF_BR: "ETF",
  STOCK_US: "Stock",
  ETF_US: "ETF",
  CRYPTO: "Cripto",
};

export interface AssetDetailNewsItem {
  title: string;
  source: string;
  time: string;
}

export interface AssetDetailStats {
  volume: string;
  low52w: string;
  high52w: string;
  marketCap: string;
}

export interface AssetDetailOhlc {
  open: number;
  prevClose: number;
  dayLow: number;
  dayHigh: number;
}

export interface AssetDetailPriceRange {
  range: string;
  /** Série de fechamento (legado / fallback). */
  data: number[];
  /** Velas OHLCV para o gráfico de trading. */
  candles?: AssetCandle[];
}

export interface AssetCandle {
  /** Unix timestamp (segundos). */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AssetAboutSection {
  title?: string;
  paragraphs: string[];
}

/** Conteúdo estruturado da aba/seção Sobre (ações). */
export interface AssetAboutDetail {
  companyTitle: string;
  userRatingLabel?: string;
  sections: AssetAboutSection[];
}

export interface DividendYearYield {
  year: number;
  yieldPct: number;
}

export interface DividendPayment {
  id: string;
  type: string;
  comDate: string;
  paymentDate: string;
  valuePerShare: number;
}

export interface AssetDividendsData {
  yearlyYield: DividendYearYield[];
  payments: DividendPayment[];
}

/** Campos comuns a qualquer tela de ativo. */
export interface AssetDetailBase {
  ticker: string;
  name: string;
  exchange: string;
  type: AssetType;
  currency: AssetCurrency;
  currentPrice: number;
  variation: number;
  priceHistory: AssetDetailPriceRange[];
  about: string;
  news: AssetDetailNewsItem[];
  stats: AssetDetailStats;
  ohlc: AssetDetailOhlc;
}

/** Resumo exibido no topo do painel direito (ações). */
export interface StockBrAssetSummary {
  variation12m?: number;
  logoUrl?: string;
  companyLegalName?: string;
  pl?: string;
  pvp?: string;
  dy?: string;
}

/** Ação listada na B3 — indicadores fundamentalistas completos. */
export interface StockBrAssetDetail extends AssetDetailBase {
  type: "STOCK_BR";
  indicators: FundamentalIndicatorItem[];
  summary?: StockBrAssetSummary;
  aboutDetail?: AssetAboutDetail;
  dividends?: AssetDividendsData;
}

/** Outros tipos — painel específico será plugado depois. */
export type OtherAssetDetail = AssetDetailBase & {
  type: Exclude<AssetType, "STOCK_BR">;
};

export type AssetDetailData = StockBrAssetDetail | OtherAssetDetail;

export function isStockBrAsset(data: AssetDetailData): data is StockBrAssetDetail {
  return data.type === "STOCK_BR";
}

/** @deprecated Use AssetDetailData */
export type AssetDetailPageProps = AssetDetailData;
