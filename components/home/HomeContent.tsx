"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import { DashboardAppBar } from "@/components/home/dashboard/DashboardAppBar";
import { DashboardFooter } from "@/components/home/dashboard/DashboardFooter";
import { MarketShowcase } from "@/components/home/dashboard/MarketShowcase";
import { AllAssetsSection } from "@/components/home/dashboard/AllAssetsSection";
import { SubscriptionPlansSection } from "@/components/home/dashboard/SubscriptionPlansSection";
import { FeaturedNewsSection } from "@/components/home/dashboard/FeaturedNewsSection";
import { IbovespaMarketSection } from "@/components/home/dashboard/IbovespaMarketSection";
import { MarketTopicRankingsSection } from "@/components/home/dashboard/MarketTopicRankingsSection";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import {
  ASSET_CATEGORY_CARDS,
  FEATURED_NEWS,
  MOST_READ_NEWS,
  SHOWCASE_TICKERS,
  SUBSCRIPTION_PLANS,
} from "@/utils/mock-dashboard-data";

/** Mockup visual do dashboard de investimentos (sem chamadas de API). */
export function HomeContent() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { user, loading: profileLoading } = useProfile(isAuthenticated);

  function handleLogout() {
    logout();
    router.replace("/home");
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <DashboardAppBar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        userName={user?.name}
        userEmail={user?.email}
        profileLoading={profileLoading}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          pt: { xs: "108px", sm: "64px" },
          overflowX: "hidden",
        }}
      >
        <MarketShowcase items={SHOWCASE_TICKERS} />

        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <FeaturedNewsSection
            main={FEATURED_NEWS[0]}
            secondary={[FEATURED_NEWS[1], FEATURED_NEWS[2]]}
            mostRead={MOST_READ_NEWS}
          />
          <MarketTopicRankingsSection />
          <IbovespaMarketSection />
          <SubscriptionPlansSection plans={SUBSCRIPTION_PLANS} />
          <AllAssetsSection categories={ASSET_CATEGORY_CARDS} />
        </Container>

        <DashboardFooter />
      </Box>
    </Box>
  );
}
