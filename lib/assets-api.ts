import { apiClient } from "@/lib/api-client";
import type {
  Asset,
  AssetApiItem,
  AssetDetailResponse,
  AssetQuote,
  AssetsListResponse,
  ListAssetsParams,
  SearchAssetsParams,
  SyncAssetsResponse,
} from "@/types/assets";

function toAsset(row: AssetApiItem | Asset): Asset {
  const r = row as Asset & AssetApiItem;
  const price = r.price ?? r.current_price ?? r.value ?? 0;
  const change =
    r.changePercent ?? r.change_percent ?? r.variation_percent ?? 0;
  return {
    id: String(r.id),
    name: r.name,
    symbol: r.symbol ?? r.ticker ?? String(r.id).slice(0, 4).toUpperCase(),
    price: Number(price) || 0,
    changePercent: Number(change) || 0,
  };
}

function extractList(data: unknown): AssetApiItem[] {
  if (Array.isArray(data)) return data as AssetApiItem[];
  if (data && typeof data === "object") {
    const o = data as AssetsListResponse;
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.assets)) return o.assets;
    if (Array.isArray(o.items)) return o.items;
  }
  return [];
}

/** GET /assets */
export async function listAssets(params?: ListAssetsParams): Promise<AssetsListResponse> {
  const { data } = await apiClient.get<AssetsListResponse>("/assets", { params });
  return data;
}

/** GET /assets — lista normalizada para UI (legado) */
export async function fetchAssetsFromApi(params?: ListAssetsParams): Promise<Asset[]> {
  const data = await listAssets(params);
  return extractList(data).map(toAsset);
}

/** GET /assets/search */
export async function searchAssets(params: SearchAssetsParams): Promise<AssetsListResponse> {
  const { data } = await apiClient.get<AssetsListResponse>("/assets/search", { params });
  return data;
}

/** GET /assets/:ticker */
export async function getAssetByTicker(ticker: string): Promise<AssetDetailResponse> {
  const { data } = await apiClient.get<AssetDetailResponse>(`/assets/${encodeURIComponent(ticker)}`);
  return data;
}

/** GET /assets/:ticker/quote */
export async function getAssetQuote(ticker: string): Promise<AssetQuote> {
  const { data } = await apiClient.get<AssetQuote>(`/assets/${encodeURIComponent(ticker)}/quote`);
  return data;
}

/** POST /assets/sync */
export async function syncAssets(): Promise<SyncAssetsResponse> {
  const { data } = await apiClient.post<SyncAssetsResponse>("/assets/sync");
  return data;
}

/** POST /assets/quotes/refresh */
export async function refreshAllAssetQuotes(): Promise<SyncAssetsResponse> {
  const { data } = await apiClient.post<SyncAssetsResponse>("/assets/quotes/refresh");
  return data;
}

/** POST /assets/:ticker/sync */
export async function syncAssetByTicker(ticker: string): Promise<SyncAssetsResponse> {
  const { data } = await apiClient.post<SyncAssetsResponse>(
    `/assets/${encodeURIComponent(ticker)}/sync`,
  );
  return data;
}

/** POST /assets/:ticker/quote/refresh */
export async function refreshAssetQuote(ticker: string): Promise<AssetQuote> {
  const { data } = await apiClient.post<AssetQuote>(
    `/assets/${encodeURIComponent(ticker)}/quote/refresh`,
  );
  return data;
}

export { toAsset, extractList as extractAssetList };
