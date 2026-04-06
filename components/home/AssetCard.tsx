"use client";

import TrendingDown from "@mui/icons-material/TrendingDown";
import TrendingFlat from "@mui/icons-material/TrendingFlat";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Asset } from "@/types/api";

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

type AssetCardProps = {
  asset: Asset;
};

export function AssetCard({ asset }: AssetCardProps) {
  const { changePercent } = asset;
  const positive = changePercent > 0;
  const negative = changePercent < 0;
  const TrendIcon = positive ? TrendingUp : negative ? TrendingDown : TrendingFlat;
  const trendColor = positive ? "success.main" : negative ? "error.main" : "text.secondary";

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {asset.symbol}
          </Typography>
          <Typography variant="h6" component="h2">
            {asset.name}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {money.format(asset.price)}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: trendColor }}>
            <TrendIcon fontSize="small" />
            <Typography variant="body2" fontWeight={600}>
              {positive ? "+" : ""}
              {changePercent.toFixed(2)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              variação
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
