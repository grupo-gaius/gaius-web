"use client";

import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { AssetSectionHeading } from "@/components/AssetDetail/AssetSectionHeading";
import { MiniCard, RightSection } from "@/components/AssetDetail/AssetDetailPage.styled";
import type { AssetCurrency, AssetDetailData } from "@/types/asset-detail";
import { isStockBrAsset } from "@/types/asset-detail";
import type { FundamentalIndicatorItem } from "@/utils/stock-fundamental-indicators";
import { parseIndicatorNumber } from "@/utils/stock-fundamental-indicators";

const BRAND_POSITIVE = "#007a55";
const BRAND_NEGATIVE = "#b02020";

type AssetTopSummarySectionProps = {
  asset: AssetDetailData;
  displayPrice: number;
  displayCurrency: AssetCurrency;
};

function formatPrice(value: number, currency: AssetCurrency): string {
  const locale = currency === "BRL" ? "pt-BR" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatVariation12m(n: number): string {
  return `${n.toFixed(2).replace(".", ",")}%`;
}

function computeVariation12m(
  priceHistory: AssetDetailData["priceHistory"],
  fallback: number,
): number {
  const series = priceHistory.find((p) => p.range === "1Y")?.data ?? [];
  if (series.length < 2) return fallback;
  const first = series[0];
  const last = series[series.length - 1];
  return ((last - first) / first) * 100;
}

function findIndicator(indicators: FundamentalIndicatorItem[], ...labels: string[]): string | undefined {
  for (const label of labels) {
    const hit = indicators.find((i) => i.label === label);
    if (hit) return hit.value;
  }
  return undefined;
}

function companyLegalName(name: string): string {
  const base = name.includes("—") ? name.split("—")[0].trim() : name;
  return base.toUpperCase();
}

function SummaryMetric({
  label,
  value,
  valueColor,
  size = "primary",
}: {
  label: string;
  value: string;
  valueColor?: string;
  size?: "primary" | "secondary";
}) {
  const isPrimary = size === "primary";

  return (
    <MiniCard
      sx={{
        p: isPrimary ? 2.25 : 2,
        minHeight: isPrimary ? 96 : 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography
        color="text.secondary"
        display="block"
        sx={{
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: isPrimary ? "0.75rem" : "0.7rem",
          fontWeight: 600,
          mb: isPrimary ? 1 : 0.75,
          width: "100%",
        }}
      >
        {label}
      </Typography>
      <Typography
        component="p"
        sx={{
          m: 0,
          width: "100%",
          color: valueColor ?? "text.primary",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          fontSize: isPrimary ? { xs: "1.35rem", sm: "1.5rem" } : { xs: "1.15rem", sm: "1.28rem" },
        }}
      >
        {value}
      </Typography>
    </MiniCard>
  );
}

export function AssetTopSummarySection({
  asset,
  displayPrice,
  displayCurrency,
}: AssetTopSummarySectionProps) {
  const variation12m = useMemo(
    () => computeVariation12m(asset.priceHistory, asset.variation),
    [asset.priceHistory, asset.variation],
  );

  const legalName = companyLegalName(asset.name);

  const stockMetrics = useMemo(() => {
    if (!isStockBrAsset(asset)) return null;
    const s = asset.summary;
    return {
      pl: s?.pl ?? findIndicator(asset.indicators, "P/L") ?? "—",
      pvp: s?.pvp ?? findIndicator(asset.indicators, "P/VP") ?? "—",
      dy: s?.dy ?? findIndicator(asset.indicators, "Dividend Yield") ?? "—",
      logoUrl: s?.logoUrl,
      legalName: s?.companyLegalName ?? legalName,
      variation12m: s?.variation12m ?? variation12m,
    };
  }, [asset, legalName, variation12m]);

  const v12m = stockMetrics?.variation12m ?? variation12m;
  const displayLegalName = stockMetrics?.legalName ?? legalName;

  return (
    <RightSection sx={{ py: 2, px: 2 }}>
      <AssetSectionHeading icon={InsightsOutlined} title="Resumo do ativo" />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.75,
              mb: 1,
              textAlign: "center",
            }}
          >
            <Avatar
              src={stockMetrics?.logoUrl}
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1.25,
                bgcolor: "action.selected",
                fontSize: "0.85rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {asset.ticker.replace(/\d/g, "").slice(0, 2)}
            </Avatar>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.02em",
                lineHeight: 1.3,
                color: "text.primary",
              }}
            >
              {displayLegalName}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <SummaryMetric
            size="primary"
            label="Cotação"
            value={formatPrice(displayPrice, displayCurrency)}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <SummaryMetric
            size="primary"
            label="Variação (12M)"
            value={formatVariation12m(v12m)}
            valueColor={v12m >= 0 ? BRAND_POSITIVE : BRAND_NEGATIVE}
          />
        </Grid>

        {stockMetrics ? (
          <>
            <Grid size={{ xs: 4 }}>
              <SummaryMetric
                size="secondary"
                label="P/L"
                value={stockMetrics.pl.replace(/x$/i, "")}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <SummaryMetric
                size="secondary"
                label="P/VP"
                value={stockMetrics.pvp.replace(/x$/i, "")}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <SummaryMetric
                size="secondary"
                label="DY"
                value={stockMetrics.dy}
                valueColor={
                  (parseIndicatorNumber(stockMetrics.dy) ?? 0) > 6 ? BRAND_POSITIVE : undefined
                }
              />
            </Grid>
          </>
        ) : null}
      </Grid>
    </RightSection>
  );
}
