"use client";

import Favorite from "@mui/icons-material/Favorite";
import NewspaperOutlined from "@mui/icons-material/NewspaperOutlined";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { AssetChart } from "@/components/AssetChart";
import {
  ChartArea,
  HeaderActions,
  HeaderMain,
  Layout,
  LeftPanel,
  NewsItemRow,
  PanelHeader,
  RangeRow,
  RightPanel,
  RightSection,
  StatsFooter,
} from "@/components/AssetDetail/AssetDetailPage.styled";
import { AssetTypeBadge } from "@/components/AssetDetail/AssetTypeBadge";
import { AssetSectionHeading } from "@/components/AssetDetail/AssetSectionHeading";
import { AssetAboutPlainSection, AssetAboutSection } from "@/components/AssetDetail/panels/AssetAboutSection";
import { AssetDividendsSection } from "@/components/AssetDetail/panels/AssetDividendsSection";
import { AssetTopSummarySection } from "@/components/AssetDetail/panels/AssetTopSummarySection";
import { AssetTypeIndicatorsPanel } from "@/components/AssetDetail/panels/AssetTypeIndicatorsPanel";
import type { AssetCurrency, AssetDetailData } from "@/types/asset-detail";
import { isStockBrAsset } from "@/types/asset-detail";

const BRAND_PRIMARY = "#FF6B00";
const BRAND_POSITIVE = "#007a55";
const BRAND_NEGATIVE = "#b02020";

const RANGE_OPTIONS = ["1D", "1W", "1M", "3M", "6M", "1Y", "MAX"] as const;
type RangeKey = (typeof RANGE_OPTIONS)[number];

export type { AssetType, AssetCurrency, AssetDetailData, AssetDetailPageProps } from "@/types/asset-detail";

const CURRENCY_RATES: Record<AssetCurrency, number> = {
  BRL: 1,
  USD: 1 / 5.05,
  EUR: 1 / 5.45,
};

import { getCandlesForRange } from "@/lib/asset-detail/candles";

function tickerInitials(ticker: string): string {
  const t = ticker.replace(/\d/g, "").slice(0, 2);
  return (t || ticker.slice(0, 2)).toUpperCase();
}

function formatPrice(value: number, currency: AssetCurrency): string {
  const locale = currency === "BRL" ? "pt-BR" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPct(n: number): string {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2).replace(".", ",")}%`;
}

export function AssetDetailPage(props: AssetDetailData) {
  const {
    ticker,
    name,
    exchange,
    type,
    currency: defaultCurrency,
    currentPrice,
    variation,
    priceHistory,
    about,
    news,
    stats,
    ohlc,
  } = props;
  const [range, setRange] = useState<RangeKey>("1M");
  const [displayCurrency, setDisplayCurrency] = useState<AssetCurrency>(defaultCurrency);
  const [favorite, setFavorite] = useState(false);

  const rate = CURRENCY_RATES[displayCurrency];
  const displayPrice = currentPrice * rate;

  const chartEntry = useMemo(
    () => priceHistory.find((p) => p.range === range),
    [priceHistory, range],
  );

  const chartCandles = useMemo(() => getCandlesForRange(chartEntry), [chartEntry]);

  const chartVariation = useMemo(() => {
    if (chartCandles.length < 2) return variation;
    const first = chartCandles[0]!.close;
    const last = chartCandles[chartCandles.length - 1]!.close;
    return ((last - first) / first) * 100;
  }, [chartCandles, variation]);

  function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      void navigator.share({ title: `${ticker} — ${name}`, url });
    } else if (url) {
      void navigator.clipboard?.writeText(url);
    }
  }

  return (
    <Layout>
      <LeftPanel>
        <PanelHeader>
          <HeaderMain>
            <Avatar
              variant="rounded"
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                bgcolor: "action.selected",
                color: "text.primary",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {tickerInitials(ticker)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                <Typography variant="subtitle1" fontWeight={500} noWrap>
                  {ticker}
                </Typography>
                <AssetTypeBadge type={type} prominent />
              </Stack>
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {name} · {exchange}
              </Typography>
            </Box>
          </HeaderMain>
          <HeaderActions>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={displayCurrency}
              onChange={(_, v) => v && setDisplayCurrency(v)}
              aria-label="Moeda"
            >
              {(["BRL", "USD", "EUR"] as const).map((c) => (
                <ToggleButton key={c} value={c} sx={{ px: 1.25, py: 0.25, fontSize: "0.75rem" }}>
                  {c}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <IconButton
              size="small"
              aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              onClick={() => setFavorite((f) => !f)}
              sx={{ color: favorite ? BRAND_PRIMARY : "text.secondary" }}
            >
              {favorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </IconButton>
            <IconButton size="small" aria-label="Compartilhar" onClick={handleShare}>
              <ShareOutlined fontSize="small" />
            </IconButton>
          </HeaderActions>
        </PanelHeader>

        <RangeRow>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={range}
            onChange={(_, v) => v && setRange(v)}
            aria-label="Período do gráfico"
            sx={{
              flexWrap: "wrap",
              gap: 0.5,
              "& .MuiToggleButtonGroup-grouped": { border: 0, mx: 0.25 },
              "& .Mui-selected": {
                backgroundColor: `${BRAND_PRIMARY} !important`,
                color: "#fff !important",
              },
              "& .Mui-selected:hover": {
                backgroundColor: "#e05e00 !important",
              },
            }}
          >
            {RANGE_OPTIONS.map((r) => (
              <ToggleButton key={r} value={r} sx={{ px: 1.25, py: 0.35, fontSize: "0.75rem" }}>
                {r}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </RangeRow>

        <ChartArea>
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Typography variant="h5" fontWeight={500}>
              {formatPrice(displayPrice, displayCurrency)}
            </Typography>
            <Chip
              size="small"
              label={formatPct(chartVariation)}
              sx={{
                fontWeight: 600,
                bgcolor: chartVariation >= 0 ? `${BRAND_POSITIVE}18` : `${BRAND_NEGATIVE}18`,
                color: chartVariation >= 0 ? BRAND_POSITIVE : BRAND_NEGATIVE,
              }}
            />
          </Stack>
          <AssetChart
            candles={chartCandles}
            rangeKey={range}
            currencyLabel={displayCurrency}
          />
        </ChartArea>

        <StatsFooter>
          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 4 }}
            flexWrap="wrap"
            useFlexGap
            justifyContent="center"
            alignItems="flex-start"
          >
            {(
              [
                ["Volume", stats.volume],
                ["52w Low", stats.low52w],
                ["52w High", stats.high52w],
                ["Market Cap", stats.marketCap],
              ] as const
            ).map(([label, value]) => (
              <Box key={label} sx={{ textAlign: "center", minWidth: { xs: 100, sm: 120 } }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.5 }}
                >
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Stack>
        </StatsFooter>
      </LeftPanel>

      <Divider orientation="vertical" flexItem />

      <RightPanel>
        <AssetTopSummarySection
          asset={props}
          displayPrice={displayPrice}
          displayCurrency={displayCurrency}
        />

        <Divider />

        <AssetTypeIndicatorsPanel asset={props} />

        <Divider />

        {isStockBrAsset(props) && props.dividends ? (
          <>
            <AssetDividendsSection dividends={props.dividends} />
            <Divider />
          </>
        ) : null}

        {isStockBrAsset(props) && props.aboutDetail ? (
          <AssetAboutSection aboutDetail={props.aboutDetail} plainAbout={about} />
        ) : (
          <AssetAboutPlainSection about={about} />
        )}

        <Divider />

        <RightSection>
          <AssetSectionHeading icon={NewspaperOutlined} title="Notícias relacionadas" />
          {news.map((item, index) => (
            <NewsItemRow key={item.title}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  mt: 0.75,
                  flexShrink: 0,
                  bgcolor: index === 0 ? BRAND_PRIMARY : "text.disabled",
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.25 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.source} · {item.time}
                </Typography>
              </Box>
            </NewsItemRow>
          ))}
        </RightSection>
      </RightPanel>
    </Layout>
  );
}
