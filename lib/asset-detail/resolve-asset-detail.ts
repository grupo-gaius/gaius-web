import { inferAssetType } from "@/lib/asset-detail/infer-asset-type";
import { buildDefaultPriceHistory, hashTicker } from "@/mock/assets/_helpers";
import { kncr11Detail } from "@/mock/assets/fii/kncr11";
import { STOCK_BR_REGISTRY } from "@/mock/assets/stock-br";
import type { AssetDetailData, AssetType, OtherAssetDetail, StockBrAssetDetail } from "@/types/asset-detail";
import { STOCK_BR_FUNDAMENTAL_INDICATORS } from "@/utils/stock-fundamental-indicators";

const OTHER_REGISTRY: Record<string, AssetDetailData> = {
  KNCR11: kncr11Detail,
};

function buildGenericStockBr(ticker: string): StockBrAssetDetail {
  const h = hashTicker(ticker);
  const base = 8 + (h % 120);
  const price = Math.round(base * 100) / 100;
  const variation = ((h % 200) - 100) / 40;

  const indicators = STOCK_BR_FUNDAMENTAL_INDICATORS.map((label, i) => {
    const v = ((h + i * 17) % 50) / 10;
    const isPct = label.includes("Margem") || label.includes("RO") || label.includes("CAGR") || label.includes("Yield") || label === "Payout";
    const isMoney = label === "VPA" || label === "LPA";
    let value: string;
    if (isMoney) value = `R$ ${(v + 1).toFixed(2).replace(".", ",")}`;
    else if (isPct) value = `${v.toFixed(1).replace(".", ",")}%`;
    else value = `${(v / 2 + 1).toFixed(1).replace(".", ",")}x`;

    return {
      label,
      value,
      highlight: label === "Dividend Yield" && v > 6,
    };
  });

  return {
    ticker,
    name: `${ticker} — Empresa listada na B3`,
    exchange: "B3",
    type: "STOCK_BR",
    currency: "BRL",
    currentPrice: price,
    variation,
    priceHistory: buildDefaultPriceHistory(price),
    indicators,
    about: `Dados mock para ${ticker}. Quando a API estiver conectada, esta tela carregará cotações, histórico e indicadores fundamentalistas reais da ação.`,
    news: [
      { title: `Mercado acompanha ${ticker} após movimento do setor`, source: "Gaius", time: "há 1 h" },
      { title: "Ibovespa opera em alta com commodities", source: "Reuters", time: "há 4 h" },
    ],
    stats: {
      volume: `R$ ${((h % 900) + 100)} mi`,
      low52w: `R$ ${(price * 0.82).toFixed(2).replace(".", ",")}`,
      high52w: `R$ ${(price * 1.18).toFixed(2).replace(".", ",")}`,
      marketCap: `R$ ${((h % 400) + 10)} bi`,
    },
    ohlc: {
      open: price * 0.998,
      prevClose: price * 0.995,
      dayLow: price * 0.985,
      dayHigh: price * 1.012,
    },
  };
}

function buildPlaceholder(ticker: string, type: Exclude<AssetType, "STOCK_BR">): OtherAssetDetail {
  const h = hashTicker(ticker);
  const price = Math.round((10 + (h % 200)) * 100) / 100;

  return {
    ticker,
    name: `${ticker} — Ativo (${type})`,
    exchange: type === "STOCK_US" || type === "ETF_US" ? "NYSE" : type === "CRYPTO" ? "Global" : "B3",
    type,
    currency: type === "STOCK_US" || type === "ETF_US" || type === "CRYPTO" ? "USD" : "BRL",
    currentPrice: price,
    variation: ((h % 80) - 40) / 20,
    priceHistory: buildDefaultPriceHistory(price),
    about: `Tela dedicada para ${type} em desenvolvimento. O tipo do ativo já é identificado para exibir o layout correto quando os dados estiverem disponíveis.`,
    news: [{ title: `Acompanhe ${ticker} na Gaius`, source: "Gaius", time: "agora" }],
    stats: {
      volume: "—",
      low52w: "—",
      high52w: "—",
      marketCap: "—",
    },
    ohlc: { open: price, prevClose: price, dayLow: price * 0.98, dayHigh: price * 1.02 },
  };
}

/** Resolve dados da tela pelo ticker (mock + inferência de tipo). */
export function resolveAssetDetail(ticker: string): AssetDetailData {
  const key = ticker.trim().toUpperCase();

  if (STOCK_BR_REGISTRY[key]) return STOCK_BR_REGISTRY[key];
  if (OTHER_REGISTRY[key]) return OTHER_REGISTRY[key];

  const type = inferAssetType(key);

  if (type === "STOCK_BR") return buildGenericStockBr(key);
  return buildPlaceholder(key, type as Exclude<AssetType, "STOCK_BR">);
}

export function listKnownAssetTickers(): string[] {
  return [...Object.keys(STOCK_BR_REGISTRY), ...Object.keys(OTHER_REGISTRY)].sort();
}
