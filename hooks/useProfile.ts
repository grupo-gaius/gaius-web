"use client";

import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/lib/users-api";
import { getErrorMessage } from "@/lib/api-client";
import type { AuthUser } from "@/types/api";

/** Só chama GET /users/me quando `enabled` é true (evita 401 desnecessário na home pública). */
export function useProfile(enabled: boolean) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setUser(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const u = await fetchCurrentUser();
        if (!cancelled) setUser(u);
      } catch (e) {
        if (!cancelled) {
          setUser(null);
          setError(getErrorMessage(e, "Não foi possível carregar o perfil."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { user, loading, error };
}
