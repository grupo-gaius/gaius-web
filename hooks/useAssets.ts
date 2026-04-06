"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAssetsFromApi } from "@/lib/assets-api";
import { getErrorMessage } from "@/lib/api-client";
import { buildSimulatedAssets } from "@/utils/mock-assets";
import type { Asset } from "@/types/api";

const HOUR_MS = 60 * 60 * 1000;

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [usingSimulation, setUsingSimulation] = useState(false);
  const assetsRef = useRef<Asset[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAssetsFromApi();
      assetsRef.current = list;
      setAssets(list);
      setUsingSimulation(false);
      setLastUpdated(new Date());
    } catch (e) {
      const msg = getErrorMessage(e, "Não foi possível carregar os ativos.");
      setError(msg);
      const simulated = buildSimulatedAssets(assetsRef.current);
      assetsRef.current = simulated;
      setAssets(simulated);
      setUsingSimulation(true);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), HOUR_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  return {
    assets,
    loading,
    error,
    lastUpdated,
    usingSimulation,
    refresh,
  };
}
