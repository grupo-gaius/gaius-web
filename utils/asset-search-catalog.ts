import type { Asset } from "@/types/assets";
import { buildSimulatedAssets } from "@/utils/mock-assets";
import { MARKET_TOPIC_RANKINGS, SHOWCASE_TICKERS } from "@/utils/mock-dashboard-data";
import { STOCK_GAINERS, STOCK_LOSERS } from "@/utils/mock-ibovespa";

function uniqueBySymbol(assets: Asset[]): Asset[] {
  const seen = new Set<string>();
  return assets.filter((a) => {
    const key = a.symbol.toUpperCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildCatalog(): Asset[] {
  const items: Asset[] = buildSimulatedAssets().map((a) => ({ ...a }));

  for (const t of SHOWCASE_TICKERS) {
    items.push({
      id: t.id,
      symbol: t.symbol,
      name: t.name,
      price: 0,
      changePercent: t.changePct,
    });
  }

  for (const m of [...STOCK_GAINERS, ...STOCK_LOSERS]) {
    items.push({
      id: m.symbol,
      symbol: m.symbol,
      name: m.name,
      price: m.priceBRL,
      changePercent: m.changePercent,
    });
  }

  for (const bundle of Object.values(MARKET_TOPIC_RANKINGS)) {
    for (const lists of Object.values(bundle)) {
      for (const row of lists) {
        items.push({
          id: row.symbol,
          symbol: row.symbol,
          name: row.name,
          price: 0,
          changePercent: 0,
        });
      }
    }
  }

  return uniqueBySymbol(items);
}

const CATALOG = buildCatalog();

export function filterAssetCatalog(query: string, limit = 8): Asset[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return CATALOG.filter(
    (a) => a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q),
  ).slice(0, limit);
}
