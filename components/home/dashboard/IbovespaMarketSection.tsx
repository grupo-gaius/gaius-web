"use client";

import { useEffect, useMemo, useState } from "react";
import ShowChart from "@mui/icons-material/ShowChart";
import TrendingDown from "@mui/icons-material/TrendingDown";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IbovespaChartPoint, IbovespaPeriod, StockMover } from "@/utils/mock-ibovespa";
import {
  IBOVESPA_HEADLINE,
  IBOVESPA_LAST_UPDATED_ISO,
  IBOVESPA_PERIODS,
  IBOVESPA_SERIES,
  STOCK_GAINERS,
  STOCK_LOSERS,
} from "@/utils/mock-ibovespa";

const lastUpdatedLabel = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
}).format(new Date(IBOVESPA_LAST_UPDATED_ISO));

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fmtPct = (n: number) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(2).replace(".", ",")}%`;

const fmtIbov = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: IbovespaChartPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        px: 1.25,
        py: 0.75,
        boxShadow: 2,
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block">
        {p.label}
      </Typography>
      <Typography variant="body2" fontWeight={800}>
        {fmtIbov(p.ibov)} pts
      </Typography>
    </Box>
  );
}

function MoverRow({ item, positive }: { item: StockMover; positive: boolean }) {
  const initials = item.symbol.replace(/\d/g, "").slice(0, 2).toUpperCase() || item.symbol.slice(0, 2);
  return (
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ py: 1 }}>
      <Avatar
        variant="rounded"
        sx={{
          width: 40,
          height: 40,
          fontSize: "0.75rem",
          fontWeight: 800,
          bgcolor: positive ? "success.dark" : "error.dark",
          color: "common.white",
        }}
      >
        {initials}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={800} noWrap>
          {item.symbol}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap title={item.name}>
          {item.name}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right", flexShrink: 0 }}>
        <Typography variant="body2" fontWeight={800} color={positive ? "success.dark" : "error.dark"}>
          {fmtPct(item.changePercent)}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {money.format(item.priceBRL)}
        </Typography>
      </Box>
    </Stack>
  );
}

function MoversColumn({
  title,
  icon,
  items,
  positive,
}: {
  title: string;
  icon: React.ReactNode;
  items: StockMover[];
  positive: boolean;
}) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
        {icon}
        <Typography variant="subtitle2" fontWeight={800}>
          {title}
        </Typography>
      </Stack>
      <Divider sx={{ mb: 0.75, borderColor: (t) => alpha(t.palette.divider, 0.3) }} />
      <Stack spacing={0.25}>
        {items.map((row) => (
          <MoverRow key={row.symbol} item={row} positive={positive} />
        ))}
      </Stack>
    </Box>
  );
}

export function IbovespaMarketSection() {
  const theme = useTheme();
  const [period, setPeriod] = useState<IbovespaPeriod>("1D");
  const [chartReady, setChartReady] = useState(false);
  const data = useMemo(() => IBOVESPA_SERIES[period], [period]);
  const stroke = theme.palette.primary.main;
  const fill = theme.palette.primary.main;

  useEffect(() => {
    const id = requestAnimationFrame(() => setChartReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const h = IBOVESPA_HEADLINE;

  return (
    <Box component="section" sx={{ py: { xs: 3, md: 4 } }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2, letterSpacing: "-0.02em" }}>
        Ibovespa
      </Typography>

      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Grid container>
          <Grid size={{ xs: 12, lg: 7 }} sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ShowChart color="primary" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Índice Bovespa (mock)
                  </Typography>
                  <Typography variant="h5" fontWeight={900} sx={{ lineHeight: 1.2 }}>
                    {fmtIbov(h.value)} pts
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="body2" fontWeight={800} color="success.main">
                      {fmtPct(h.changePct)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {h.changePts >= 0 ? "+" : ""}
                      {h.changePts.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} pts no dia
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Stack>

            <Box sx={{ mb: 2 }}>
              <ToggleButtonGroup
                exclusive
                value={period}
                onChange={(_, v) => v && setPeriod(v)}
                size="small"
                aria-label="Período do gráfico"
                sx={{
                  flexWrap: "wrap",
                  gap: 0.5,
                  "& .MuiToggleButton-root": {
                    px: 1.25,
                    py: 0.5,
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "none",
                  },
                }}
              >
                {IBOVESPA_PERIODS.map((p) => (
                  <ToggleButton key={p} value={p}>
                    {p}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            <Box
              sx={{
                width: "100%",
                minWidth: 0,
                height: { xs: 240, sm: 280 },
                bgcolor: "action.hover",
                borderRadius: 2,
              }}
            >
              {chartReady ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                  <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ibovFill" x1="0" y1="0" x2="0" y2="1">
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
                    />
                    <YAxis
                      domain={["dataMin - 80", "dataMax + 80"]}
                      tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      width={44}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="ibov"
                      stroke={stroke}
                      strokeWidth={2}
                      fill="url(#ibovFill)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : null}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              Última atualização: {lastUpdatedLabel}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }} sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MoversColumn
                  title="Maiores altas"
                  icon={<TrendingUp color="success" fontSize="small" />}
                  items={STOCK_GAINERS}
                  positive
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MoversColumn
                  title="Maiores baixas"
                  icon={<TrendingDown color="error" fontSize="small" />}
                  items={STOCK_LOSERS}
                  positive={false}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
