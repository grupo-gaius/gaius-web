import type { Asset, AssetApiItem, AssetsListResponse } from "@/types/api";
import { apiClient } from "@/lib/api-client";

function toAsset(row: AssetApiItem | Asset): Asset {
  const r = row as Asset & AssetApiItem;
  const price = r.price ?? r.current_price ?? r.value ?? 0;
  const change =
    r.changePercent ?? r.change_percent ?? r.variation_percent ?? 0;
  return {
    id: String(r.id),
    name: r.name,
    symbol: r.symbol ?? String(r.id).slice(0, 4).toUpperCase(),
    price: Number(price) || 0,
    changePercent: Number(change) || 0,
  };
}

function extractList(data: unknown): (AssetApiItem | Asset)[] {
  if (Array.isArray(data)) return data as (AssetApiItem | Asset)[];
  if (data && typeof data === "object") {
    const o = data as AssetsListResponse;
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.assets)) return o.assets;
  }
  return [];
}

export async function fetchAssetsFromApi(): Promise<Asset[]> {
  const { data } = await apiClient.get<unknown>("/assets");
  return extractList(data).map(toAsset);
}
