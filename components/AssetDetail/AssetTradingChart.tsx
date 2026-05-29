"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Layer,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  useChartHeight,
  useChartWidth,
  useOffset,
  useXAxisScale,
  useYAxisScale,
} from "recharts";
import type { MouseHandlerDataParam } from "recharts";
import { ChartCanvasWrap } from "@/components/AssetDetail/AssetDetailPage.styled";
import type { AssetCandle } from "@/types/asset-detail";

const CHART_UP = "#007a55";
const CHART_DOWN = "#b02020";
const SYNC_ID = "asset-ohlcv";
const VOLUME_BAND_PX = 72;

type AssetTradingChartProps = {
  candles: AssetCandle[];
  rangeKey: string;
  currencyLabel?: string;
};

type OhlcLegend = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: number;
};

function formatOhlc(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatVolume(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2).replace(".", ",")} mi`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(".", ",")} mil`;
  return String(value);
}

function formatLegendTime(timeSec: number, rangeKey: string) {
  const d = new Date(timeSec * 1000);
  if (rangeKey === "1D") {
    return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" });
}

function formatAxisTime(timeSec: number, rangeKey: string) {
  const d = new Date(timeSec * 1000);
  if (rangeKey === "1D") {
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function computePriceDomain(candles: AssetCandle[]): [number, number] {
  if (candles.length === 0) return [0, 1];
  let min = Infinity;
  let max = -Infinity;
  for (const c of candles) {
    min = Math.min(min, c.low);
    max = Math.max(max, c.high);
  }
  const pad = (max - min) * 0.06 || max * 0.02;
  return [min - pad, max + pad];
}

function CandlestickSeriesLayer({ data, dividerColor }: { data: AssetCandle[]; dividerColor: string }) {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale("price");
  const offset = useOffset();
  const chartHeight = useChartHeight();
  const chartWidth = useChartWidth();

  if (!xScale || !yScale || !offset || chartHeight == null || chartWidth == null) return null;

  const plotWidth = chartWidth - offset.left - offset.right;
  const defaultStep = plotWidth / Math.max(data.length, 1);

  return (
    <Layer>
      {data.map((candle, index) => {
        const cx = xScale(candle.time, { position: "middle" });
        const yHigh = yScale(candle.high);
        const yLow = yScale(candle.low);
        const yOpen = yScale(candle.open);
        const yClose = yScale(candle.close);
        if (cx == null || yHigh == null || yLow == null || yOpen == null || yClose == null) return null;

        const next = data[index + 1];
        const prev = data[index - 1];
        const nextX = next ? xScale(next.time, { position: "middle" }) : undefined;
        const prevX = prev ? xScale(prev.time, { position: "middle" }) : undefined;
        const step =
          nextX != null && prevX != null
            ? Math.min(Math.abs(nextX - cx), Math.abs(cx - prevX))
            : nextX != null
              ? Math.abs(nextX - cx)
              : prevX != null
                ? Math.abs(cx - prevX)
                : defaultStep;

        const bodyWidth = Math.max(2, step * 0.55);
        const bullish = candle.close >= candle.open;
        const color = bullish ? CHART_UP : CHART_DOWN;
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(Math.abs(yClose - yOpen), 1);

        return (
          <g key={candle.time}>
            <line x1={cx} x2={cx} y1={yHigh} y2={yLow} stroke={color} strokeWidth={1} />
            <rect
              x={cx - bodyWidth / 2}
              y={bodyTop}
              width={bodyWidth}
              height={bodyHeight}
              fill={color}
              stroke={color}
              strokeWidth={1}
            />
          </g>
        );
      })}
      <line
        x1={offset.left}
        x2={offset.left + plotWidth}
        y1={chartHeight - offset.bottom}
        y2={chartHeight - offset.bottom}
        stroke={dividerColor}
        strokeWidth={1}
      />
    </Layer>
  );
}

function VolumeSeriesLayer({ data }: { data: AssetCandle[] }) {
  const xScale = useXAxisScale();
  const offset = useOffset();
  const chartHeight = useChartHeight();
  const chartWidth = useChartWidth();

  if (!xScale || !offset || chartHeight == null || chartWidth == null || data.length === 0) return null;

  const maxVol = Math.max(...data.map((d) => d.volume), 1);
  const volTop = chartHeight - offset.bottom + 6;
  const volHeight = Math.max(VOLUME_BAND_PX - 14, 40);
  const plotWidth = chartWidth - offset.left - offset.right;
  const defaultStep = plotWidth / Math.max(data.length, 1);

  return (
    <Layer>
      {data.map((candle, index) => {
        const cx = xScale(candle.time, { position: "middle" });
        if (cx == null) return null;

        const next = data[index + 1];
        const prev = data[index - 1];
        const nextX = next ? xScale(next.time, { position: "middle" }) : undefined;
        const prevX = prev ? xScale(prev.time, { position: "middle" }) : undefined;
        const step =
          nextX != null && prevX != null
            ? Math.min(Math.abs(nextX - cx), Math.abs(cx - prevX))
            : nextX != null
              ? Math.abs(nextX - cx)
              : prevX != null
                ? Math.abs(cx - prevX)
                : defaultStep;

        const barWidth = Math.max(2, step * 0.55);
        const barHeight = (candle.volume / maxVol) * volHeight;
        const bullish = candle.close >= candle.open;
        const fill = alpha(bullish ? CHART_UP : CHART_DOWN, 0.35);

        return (
          <rect
            key={`vol-${candle.time}`}
            x={cx - barWidth / 2}
            y={volTop + volHeight - barHeight}
            width={barWidth}
            height={Math.max(barHeight, 1)}
            fill={fill}
          />
        );
      })}
    </Layer>
  );
}

function TradingChartBody({
  data,
  rangeKey,
  chartColors,
  onHoverChange,
}: {
  data: AssetCandle[];
  rangeKey: string;
  chartColors: { text: string; grid: string; border: string; crosshair: string };
  onHoverChange: (index: number | null) => void;
}) {
  const priceDomain = useMemo(() => computePriceDomain(data), [data]);

  const handleMouseMove = useCallback(
    (state: MouseHandlerDataParam) => {
      const idx = typeof state.activeTooltipIndex === "number" ? state.activeTooltipIndex : null;
      onHoverChange(idx);
    },
    [onHoverChange],
  );

  const handleMouseLeave = useCallback(() => onHoverChange(null), [onHoverChange]);

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={280}>
      <ComposedChart
        data={data}
        syncId={SYNC_ID}
        margin={{ top: 8, right: 4, left: 4, bottom: VOLUME_BAND_PX }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(t) => formatAxisTime(Number(t), rangeKey)}
          tick={{ fill: chartColors.text, fontSize: 11 }}
          axisLine={{ stroke: chartColors.border }}
          tickLine={{ stroke: chartColors.border }}
          minTickGap={48}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="price"
          orientation="right"
          domain={priceDomain}
          tickFormatter={(v) => formatOhlc(Number(v))}
          tick={{ fill: chartColors.text, fontSize: 11 }}
          axisLine={{ stroke: chartColors.border }}
          tickLine={{ stroke: chartColors.border }}
          width={54}
        />
        <Tooltip
          cursor={{
            stroke: chartColors.crosshair,
            strokeWidth: 1,
            strokeDasharray: "4 4",
          }}
          content={() => null}
        />
        <Line
          yAxisId="price"
          type="monotone"
          dataKey="close"
          stroke="transparent"
          strokeWidth={0}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
        <CandlestickSeriesLayer data={data} dividerColor={chartColors.grid} />
        <VolumeSeriesLayer data={data} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function AssetTradingChart({ candles, rangeKey, currencyLabel = "BRL" }: AssetTradingChartProps) {
  const theme = useTheme();
  const [chartReady, setChartReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const lastCandle = candles[candles.length - 1];

  const chartColors = useMemo(
    () => ({
      text: theme.palette.text.secondary,
      grid: alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.65 : 1),
      border: theme.palette.divider,
      crosshair: alpha(theme.palette.text.primary, 0.25),
    }),
    [theme.palette.divider, theme.palette.mode, theme.palette.text.primary, theme.palette.text.secondary],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => setChartReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const activeCandle =
    hoveredIndex != null && candles[hoveredIndex] ? candles[hoveredIndex] : lastCandle;

  const display: OhlcLegend | null = activeCandle
    ? {
        open: activeCandle.open,
        high: activeCandle.high,
        low: activeCandle.low,
        close: activeCandle.close,
        volume: activeCandle.volume,
        time: activeCandle.time,
      }
    : null;

  const bullish = display ? display.close >= display.open : true;

  return (
    <Box sx={{ position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      {display ? (
        <Stack
          direction="row"
          flexWrap="wrap"
          useFlexGap
          spacing={2}
          sx={{
            mb: 1,
            px: 1.25,
            py: 1,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            bgcolor: "action.hover",
            gap: 1.5,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ width: "100%", fontWeight: 600 }}>
            {formatLegendTime(display.time, rangeKey)} · {currencyLabel}
          </Typography>
          {(
            [
              ["O", display.open],
              ["H", display.high],
              ["L", display.low],
              ["C", display.close],
            ] as const
          ).map(([label, value]) => (
            <Typography key={label} variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
              <Box component="span" sx={{ color: "text.secondary", mr: 0.5 }}>
                {label}
              </Box>
              <Box component="span" sx={{ color: bullish ? CHART_UP : CHART_DOWN }}>
                {formatOhlc(value)}
              </Box>
            </Typography>
          ))}
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
            <Box component="span" sx={{ color: "text.secondary", mr: 0.5 }}>
              Vol
            </Box>
            {formatVolume(display.volume)}
          </Typography>
        </Stack>
      ) : null}

      <ChartCanvasWrap
        sx={{
          minHeight: { xs: 280, md: 340 },
          height: { xs: 280, md: 340 },
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {chartReady && candles.length > 0 ? (
          <TradingChartBody
            data={candles}
            rangeKey={rangeKey}
            chartColors={chartColors}
            onHoverChange={setHoveredIndex}
          />
        ) : null}
      </ChartCanvasWrap>
    </Box>
  );
}
