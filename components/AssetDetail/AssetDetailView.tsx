"use client";

import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { AssetDetailPage } from "@/components/AssetDetail/AssetDetailPage";
import { DashboardAppBar } from "@/components/home/dashboard/DashboardAppBar";
import {
  dashboardMainBelowAppBarSx,
  dashboardPageShellSx,
} from "@/components/home/dashboard/dashboard-app-bar-layout";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { resolveAssetDetail } from "@/lib/asset-detail/resolve-asset-detail";

type AssetDetailViewProps = {
  ticker: string;
};

/** Carrega dados do ativo (mock/API) e renderiza a tela pelo tipo. */
export function AssetDetailView({ ticker }: AssetDetailViewProps) {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { user, loading: profileLoading } = useProfile(isAuthenticated);
  const asset = useMemo(() => resolveAssetDetail(ticker), [ticker]);

  function handleLogout() {
    logout();
    router.replace("/home");
  }

  return (
    <Box sx={dashboardPageShellSx}>
      <DashboardAppBar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        userName={user?.name}
        userEmail={user?.email}
        profileLoading={profileLoading}
      />

      <Box component="main" sx={dashboardMainBelowAppBarSx}>
        <AssetDetailPage {...asset} />
      </Box>
    </Box>
  );
}
