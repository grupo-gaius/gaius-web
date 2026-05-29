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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChartArea,
  ChartCanvasWrap,
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

const CHART_ANIM_MS = 400;

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

function drawLineChart(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: number[],
  progress: number,
  lineColor: string,
) {
  ctx.clearRect(0, 0, width, height);

  if (data.length < 2 || width <= 0 || height <= 0) return;

  const padX = 4;
  const padY = 8;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const count = Math.max(2, Math.floor(data.length * progress));
  const slice = data.slice(0, count);

  const points = slice.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * innerW,
    y: padY + innerH - ((v - min) / span) * innerH,
  }));

  const baselineY = padY + innerH;

  const gradient = ctx.createLinearGradient(0, padY, 0, baselineY);
  gradient.addColorStop(0, `${lineColor}33`);
  gradient.addColorStop(1, `${lineColor}00`);

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineTo(points[points.length - 1].x, baselineY);
  ctx.lineTo(points[0].x, baselineY);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();
}

function AssetLineChart({
  data,
  variation,
  rangeKey,
}: {
  data: number[];
  variation: number;
  rangeKey: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const startRef = useRef<number | null>(null);

  const isPositive = variation >= 0;
  const lineColor = isPositive ? BRAND_PRIMARY : BRAND_NEGATIVE;

  const paint = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;

      const rect = wrap.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w <= 0 || h <= 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawLineChart(ctx, w, h, data, progress, lineColor);
    },
    [data, lineColor],
  );

  useEffect(() => {
    progressRef.current = 0;
    startRef.current = null;
    if (animRef.current != null) {
      cancelAnimationFrame(animRef.current);
    }

    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / CHART_ANIM_MS);
      progressRef.current = t;
      paint(t);
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
    };
  }, [data, rangeKey, paint]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver(() => paint(progressRef.current));
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [paint]);

  return (
    <ChartCanvasWrap ref={wrapRef}>
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{ display: "block", width: "100%", height: "100%" }}
        aria-hidden
      />
    </ChartCanvasWrap>
  );
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

  const chartData = useMemo(() => {
    const entry = priceHistory.find((p) => p.range === range);
    return entry?.data ?? priceHistory[0]?.data ?? [];
  }, [priceHistory, range]);

  const chartVariation = useMemo(() => {
    if (chartData.length < 2) return variation;
    const first = chartData[0];
    const last = chartData[chartData.length - 1];
    return ((last - first) / first) * 100;
  }, [chartData, variation]);

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
          <AssetLineChart data={chartData} variation={chartVariation} rangeKey={range} />
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
