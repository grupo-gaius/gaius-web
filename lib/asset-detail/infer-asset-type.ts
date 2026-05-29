import type { AssetType } from "@/types/asset-detail";

const CRYPTO_TICKERS = new Set(["BTC", "ETH", "SOL", "BNB", "ADA", "XRP"]);

/** Heurística até a API informar o tipo explicitamente. */
export function inferAssetType(ticker: string): AssetType {
  const t = ticker.trim().toUpperCase();

  if (CRYPTO_TICKERS.has(t)) return "CRYPTO";
  if (/^[A-Z]{4}11$/.test(t) || /^\d{2}[A-Z]{4}\d{2}$/.test(t)) return "FII";
  if (/^(BOVA|IVVB|SMAL|HASH|DIVO)\d{2}$/i.test(t)) return "ETF_BR";
  if (/^[A-Z]{1,5}$/.test(t) && t.length <= 5 && !/\d/.test(t)) return "STOCK_US";
  if (/^[A-Z]{4}\d{1,2}$/.test(t)) return "STOCK_BR";

  return "STOCK_BR";
}
