"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
  subscribeAuthStorage,
} from "@/utils/storage";

export function useAuth() {
  const [hydrated, setHydrated] = useState(false);

  const token = useSyncExternalStore(subscribeAuthStorage, getStoredToken, () => null);

  useEffect(() => {
    // Após a hidratação, libera leitura consistente do storage para guards de rota.
    queueMicrotask(() => setHydrated(true));
  }, []);

  const login = useCallback((newToken: string) => {
    setStoredToken(newToken);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
  }, []);

  return {
    token,
    hydrated,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };
}
