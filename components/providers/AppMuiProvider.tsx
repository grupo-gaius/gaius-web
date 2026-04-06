"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeModeProvider } from "@/components/providers/ThemeModeProvider";

export function AppMuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeModeProvider>{children}</ThemeModeProvider>
    </AppRouterCacheProvider>
  );
}
