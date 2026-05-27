import type { PageParams, PaginatedResponse } from "@/types/common";

/** Modelo normalizado usado na UI (legado). */
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  changePercent: number;
}

export interface AssetApiItem {
  id: string;
  name: string;
  symbol?: string;
  ticker?: string;
  type?: string;
  exchange?: string;
  country?: string;
  price?: number;
  current_price?: number;
  value?: number;
  change_percent?: number;
  variation_percent?: number;
  changePercent?: number;
}

export interface AssetsListResponse extends PaginatedResponse<AssetApiItem> {
  assets?: AssetApiItem[];
}

export interface ListAssetsParams extends PageParams {
  type?: string;
  exchange?: string;
  country?: string;
}

export interface SearchAssetsParams extends PageParams {
  q: string;
}

export interface AssetQuote {
  ticker?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  change_percent?: number;
  currency?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface AssetDetailResponse extends AssetApiItem {
  quote?: AssetQuote;
  [key: string]: unknown;
}

export interface SyncAssetsResponse {
  message?: string;
  synced?: number;
  [key: string]: unknown;
}
