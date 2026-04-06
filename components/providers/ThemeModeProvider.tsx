"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material/styles";
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { FloatingCalculator } from "@/components/calculator/FloatingCalculator";
import { createAppTheme, MODE_STORAGE_KEY } from "@/lib/app-theme";

type ThemeModeContextValue = {
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
  toggleMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const modeListeners = new Set<() => void>();

function subscribeMode(onStoreChange: () => void) {
  modeListeners.add(onStoreChange);
  if (typeof window !== "undefined") {
    const onStorage = (e: StorageEvent) => {
      if (e.key === MODE_STORAGE_KEY || e.key === null) onStoreChange();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      modeListeners.delete(onStoreChange);
      window.removeEventListener("storage", onStorage);
    };
  }
  return () => {
    modeListeners.delete(onStoreChange);
  };
}

function emitMode() {
  modeListeners.forEach((cb) => cb());
}

function readStoredMode(): PaletteMode {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return "light";
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }
  return ctx;
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore<PaletteMode>(subscribeMode, readStoredMode, () => "light");

  const setMode = useCallback((next: PaletteMode) => {
    try {
      localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    emitMode();
  }, []);

  const toggleMode = useCallback(() => {
    setMode(readStoredMode() === "dark" ? "light" : "dark");
  }, [setMode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode, setMode, toggleMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
        <FloatingCalculator />
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
