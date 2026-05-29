"use client";

import { useEffect, useState } from "react";
import { extractAssetList, searchAssets, toAsset } from "@/lib/assets-api";
import { filterAssetCatalog } from "@/utils/asset-search-catalog";
import type { Asset } from "@/types/assets";

const DEBOUNCE_MS = 280;
const DEFAULT_LIMIT = 8;

export function useAssetSearch(query: string) {
  const [results, setResults] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchAssets({ q, limit: DEFAULT_LIMIT });
        if (cancelled) return;
        const fromApi = extractAssetList(data).map(toAsset);
        setResults(fromApi.length > 0 ? fromApi : filterAssetCatalog(q, DEFAULT_LIMIT));
      } catch {
        if (cancelled) return;
        setResults(filterAssetCatalog(q, DEFAULT_LIMIT));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  return { results, loading };
}
