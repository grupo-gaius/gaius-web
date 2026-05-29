"use client";

import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
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

function DividendPaymentRow({ row }: { row: DividendPayment }) {
  return (
    <ListItem
      disablePadding
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.95fr)",
        alignItems: "center",
        px: 1.5,
        py: 1.25,
        gap: 0.5,
      }}
    >
      <Typography variant="body2" fontWeight={600}>
        {row.type}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {row.comDate}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {row.paymentDate}
      </Typography>
      <Typography variant="body2" fontWeight={600} textAlign="right">
        {money.format(row.valuePerShare)}
      </Typography>
    </ListItem>
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
    setChartReady(true);
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
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "flex-start" }}
        sx={{ minHeight: 0 }}
      >
        <Box
          sx={{
            flex: { md: "1 1 50%" },
            minWidth: 0,
            height: { xs: 220, md: 280 },
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
            flex: { md: "1 1 50%" },
            minWidth: 0,
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
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.95fr)",
                gap: 0.5,
                px: 1.5,
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

            <List disablePadding component="ul">
              {pagePayments.map((row, index) => (
                <Box key={row.id} component="li" sx={{ listStyle: "none" }}>
                  <DividendPaymentRow row={row} />
                  {index < pagePayments.length - 1 ? <Divider component="div" /> : null}
                </Box>
              ))}
            </List>
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
