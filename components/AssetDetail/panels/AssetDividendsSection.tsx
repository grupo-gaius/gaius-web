"use client";

import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AssetSectionHeading } from "@/components/AssetDetail/AssetSectionHeading";
import { RightSection } from "@/components/AssetDetail/AssetDetailPage.styled";
import type { AssetDividendsData, DividendPayment, DividendYearYield } from "@/types/asset-detail";

const BRAND_PRIMARY = "#FF6B00";
const PAYMENTS_PAGE_SIZE = 5;
const DIVIDEND_CHART_HEIGHT = 280;

/** Grid da tabela de proventos (md+). */
const paymentTableGridSx = {
  display: { xs: "none", md: "grid" },
  gridTemplateColumns: {
    md: "minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
  },
  alignItems: "center",
  gap: { md: 0.75, lg: 1 },
  px: { md: 1.25, lg: 1.5 },
} as const;

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

function formatYieldPct(n: number) {
  return `${n.toFixed(2).replace(".", ",")}%`;
}

function DividendChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: DividendYearYield }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
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
        {row.year}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {formatYieldPct(row.yieldPct)}
      </Typography>
    </Box>
  );
}

function DividendPaymentField({
  label,
  value,
  valueAlign = "left",
}: {
  label: string;
  value: string;
  valueAlign?: "left" | "right";
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.65rem", mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: valueAlign, wordBreak: "break-word" }}>
        {value}
      </Typography>
    </Box>
  );
}

function DividendPaymentCard({ row }: { row: DividendPayment }) {
  const value = money.format(row.valuePerShare);

  return (
    <Box sx={{ px: 1.5, py: 1.25 }}>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
          <Typography variant="body2" fontWeight={700} sx={{ minWidth: 0 }}>
            {row.type}
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ flexShrink: 0, textAlign: "right" }}>
            {value}
          </Typography>
        </Stack>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1,
          }}
        >
          <DividendPaymentField label="Data COM" value={row.comDate} />
          <DividendPaymentField label="Pagamento" value={row.paymentDate} />
        </Box>
      </Stack>
    </Box>
  );
}

function DividendPaymentTableRow({ row }: { row: DividendPayment }) {
  const value = money.format(row.valuePerShare);

  return (
    <Box sx={{ ...paymentTableGridSx, py: 1.25 }}>
      <Typography variant="body2" fontWeight={600} noWrap title={row.type}>
        {row.type}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap title={row.comDate}>
        {row.comDate}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap title={row.paymentDate}>
        {row.paymentDate}
      </Typography>
      <Typography variant="body2" fontWeight={600} textAlign="right" noWrap title={value}>
        {value}
      </Typography>
    </Box>
  );
}

function DividendPaymentsTableHeader() {
  return (
    <Box
      sx={{
        ...paymentTableGridSx,
        py: 1,
        bgcolor: "action.hover",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      {(["Tipo", "Data COM", "Pagamento", "Valor"] as const).map((head) => (
        <Typography
          key={head}
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontSize: "0.65rem",
            textAlign: head === "Valor" ? "right" : "left",
          }}
        >
          {head}
        </Typography>
      ))}
    </Box>
  );
}

type AssetDividendsSectionProps = {
  dividends: AssetDividendsData;
};

export function AssetDividendsSection({ dividends }: AssetDividendsSectionProps) {
  const theme = useTheme();
  const [chartReady, setChartReady] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = requestAnimationFrame(() => setChartReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const totalPages = Math.max(1, Math.ceil(dividends.payments.length / PAYMENTS_PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const pagePayments = useMemo(() => {
    const start = (page - 1) * PAYMENTS_PAGE_SIZE;
    return dividends.payments.slice(start, start + PAYMENTS_PAGE_SIZE);
  }, [dividends.payments, page]);

  const chartData = useMemo(
    () =>
      dividends.yearlyYield.map((y) => ({
        ...y,
        label: String(y.year),
      })),
    [dividends.yearlyYield],
  );

  const maxYield = useMemo(
    () => Math.max(...dividends.yearlyYield.map((y) => y.yieldPct), 1),
    [dividends.yearlyYield],
  );

  return (
    <RightSection>
      <AssetSectionHeading icon={PaymentsOutlined} title="Dividendos" />

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        alignItems="stretch"
        sx={{ minHeight: 0, width: "100%" }}
      >
        <Box
          sx={{
            flex: { lg: "1 1 48%" },
            minWidth: 0,
            width: "100%",
            height: { xs: 220, sm: 240, lg: DIVIDEND_CHART_HEIGHT },
            bgcolor: "action.hover",
            borderRadius: 2,
            p: 1,
          }}
        >
          {chartReady ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                  tickLine={false}
                  axisLine={{ stroke: theme.palette.divider }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                  domain={[0, Math.ceil(maxYield * 1.15)]}
                />
                <Tooltip content={<DividendChartTooltip />} cursor={{ fill: `${BRAND_PRIMARY}12` }} />
                <Bar dataKey="yieldPct" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.year}
                      fill={
                        entry.year === chartData[chartData.length - 1]?.year
                          ? BRAND_PRIMARY
                          : `${BRAND_PRIMARY}99`
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </Box>

        <Box
          sx={{
            flex: { lg: "1 1 52%" },
            minWidth: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="nav"
            aria-label="Histórico de proventos"
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
              width: "100%",
            }}
          >
            <Stack divider={<Divider />} spacing={0} sx={{ display: { xs: "flex", md: "none" } }}>
              {pagePayments.map((row) => (
                <DividendPaymentCard key={row.id} row={row} />
              ))}
            </Stack>

            <Box
              sx={{
                display: { xs: "none", md: "block" },
                overflowX: "auto",
                maxWidth: "100%",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <Box sx={{ minWidth: 340 }}>
                <DividendPaymentsTableHeader />
                <Stack divider={<Divider />} spacing={0}>
                  {pagePayments.map((row) => (
                    <DividendPaymentTableRow key={row.id} row={row} />
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>

          {totalPages > 1 ? (
            <Stack alignItems="center" sx={{ mt: 1.5 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                size="small"
                color="primary"
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
                sx={{
                  "& .MuiPaginationItem-root.Mui-selected": {
                    bgcolor: BRAND_PRIMARY,
                    "&:hover": { bgcolor: "#e05e00" },
                  },
                }}
              />
            </Stack>
          ) : null}
        </Box>
      </Stack>
    </RightSection>
  );
}
