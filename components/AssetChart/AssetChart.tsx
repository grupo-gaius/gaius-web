"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useEffect, useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AssetChartPoint, AssetChartProps } from "@/components/AssetChart/AssetChart.types";
import { AssetChartPaper, AssetChartPlot } from "@/components/AssetChart/AssetChart.styled";

function formatAxisTime(timeSec: number, rangeKey: string) {
  const d = new Date(timeSec * 1000);
  if (rangeKey === "1D") {
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function formatPrice(value: number, currencyLabel: string) {
  const currency = currencyLabel === "USD" ? "USD" : currencyLabel === "EUR" ? "EUR" : "BRL";
  const locale = currency === "BRL" ? "pt-BR" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function ChartTooltip({
  active,
  payload,
  currencyLabel,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: AssetChartPoint }>;
  currencyLabel: string;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload as AssetChartPoint | undefined;
  if (!row) return null;
  return (
    <Box
      component="div"
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        px: 1.25,
        py: 0.75,
        boxShadow: 2,
        pointerEvents: "none",
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block">
        {row.label}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {formatPrice(row.close, currencyLabel)}
      </Typography>
    </Box>
  );
}

export function AssetChart({
  candles,
  rangeKey,
  currencyLabel = "BRL",
  minHeight = 280,
  className,
}: AssetChartProps) {
  const theme = useTheme();
  const fillId = useId().replace(/:/g, "");
  const [chartReady, setChartReady] = useState(false);

  const data = useMemo<AssetChartPoint[]>(
    () =>
      candles.map((c) => ({
        time: c.time,
        close: c.close,
        label: formatAxisTime(c.time, rangeKey),
      })),
    [candles, rangeKey],
  );

  const stroke = theme.palette.primary.main;
  const fill = theme.palette.primary.main;

  useEffect(() => {
    const id = requestAnimationFrame(() => setChartReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <AssetChartPaper elevation={0} className={className} sx={{ minHeight }}>
      <AssetChartPlot sx={{ height: minHeight, mt: 1, overflow: "hidden" }}>
        {chartReady && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={fill} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={fill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
                tickLine={false}
                axisLine={{ stroke: theme.palette.divider }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
                tickLine={false}
                axisLine={false}
                width={52}
                tickFormatter={(v) =>
                  Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })
                }
              />
              <Tooltip
                animationDuration={0}
                isAnimationActive={false}
                content={(props) => (
                  <ChartTooltip {...props} currencyLabel={currencyLabel} />
                )}
                contentStyle={{
                  margin: 0,
                  padding: 0,
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                }}
                wrapperStyle={{ outline: "none", zIndex: 10 }}
                cursor={{
                  stroke: theme.palette.primary.main,
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                  strokeOpacity: 0.5,
                }}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={stroke}
                strokeWidth={2}
                fill={`url(#${fillId})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : null}
      </AssetChartPlot>
    </AssetChartPaper>
  );
}
