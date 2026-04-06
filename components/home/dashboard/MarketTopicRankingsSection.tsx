"use client";

import AccountBalance from "@mui/icons-material/AccountBalance";
import Apartment from "@mui/icons-material/Apartment";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import CandlestickChart from "@mui/icons-material/CandlestickChart";
import CurrencyBitcoin from "@mui/icons-material/CurrencyBitcoin";
import Percent from "@mui/icons-material/Percent";
import PieChart from "@mui/icons-material/PieChart";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import type {
  MarketTopicRankingsBundle,
  RankingAssetClass,
  RankedItem,
} from "@/utils/mock-dashboard-data";
import {
  MARKET_TOPIC_RANKINGS,
  RANKING_ASSET_CLASSES,
  RANKING_ASSET_LABELS,
} from "@/utils/mock-dashboard-data";

const ASSET_CLASS_ICONS: Record<
  RankingAssetClass,
  React.ComponentType<{ sx?: object; "aria-hidden"?: boolean }>
> = {
  fiis: Apartment,
  acoes: CandlestickChart,
  etf: PieChart,
  cripto: CurrencyBitcoin,
};

const ROW_AVATAR_PX = 40;

function RankingRowVisual({ assetClass, row }: { assetClass: RankingAssetClass; row: RankedItem }) {
  const url = row.avatarUrl;
  if (url) {
    return (
      <Box
        sx={{
          position: "relative",
          width: ROW_AVATAR_PX,
          height: ROW_AVATAR_PX,
          flexShrink: 0,
          borderRadius: 1.5,
          overflow: "hidden",
          bgcolor: "grey.100",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Image src={url} alt="" fill sizes="40px" style={{ objectFit: "contain" }} />
      </Box>
    );
  }
  const ClassIcon = ASSET_CLASS_ICONS[assetClass];
  return (
    <Box
      sx={{
        width: ROW_AVATAR_PX,
        height: ROW_AVATAR_PX,
        flexShrink: 0,
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: (t) => alpha(t.palette.primary.main, 0.14),
        color: "primary.main",
        border: 1,
        borderColor: "divider",
        "& .MuiSvgIcon-root": { fontSize: 22 },
      }}
    >
      <ClassIcon aria-hidden />
    </Box>
  );
}

type ColumnProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  items: RankedItem[];
  accent?: "primary" | "secondary";
  assetClass: RankingAssetClass;
};

function RankingColumn({ title, subtitle, icon, items, accent = "primary", assetClass }: ColumnProps) {
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          background: (t) =>
            accent === "primary"
              ? `linear-gradient(90deg, ${t.palette.primary.main}12, transparent)`
              : `linear-gradient(90deg, ${t.palette.secondary.main}10, transparent)`,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 0.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: accent === "primary" ? "primary.main" : "secondary.main",
              color: accent === "primary" ? "primary.contrastText" : "secondary.contrastText",
              opacity: 0.95,
              "& .MuiSvgIcon-root": { fontSize: 22 },
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" fontWeight={800} component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <List disablePadding>
          {items.map((row) => (
            <ListItemButton
              key={row.symbol}
              component="div"
              onClick={(e) => e.preventDefault()}
              sx={{
                py: 1.5,
                px: 2,
                borderBottom: 1,
                borderColor: "divider",
                "&:last-of-type": { borderBottom: 0 },
                "&:hover": { bgcolor: "action.hover" },
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <RankingRowVisual assetClass={assetClass} row={row} />
              <ListItemText
                sx={{ flex: 1, minWidth: 0, m: 0 }}
                primary={
                  <Typography component="span" fontWeight={800} color="text.primary">
                    {row.symbol}
                  </Typography>
                }
                secondary={
                  <Box component="span" sx={{ display: "block" }}>
                    <Typography variant="body2" component="span" color="text.secondary" display="block">
                      {row.name}
                    </Typography>
                    <Typography variant="caption" component="span" color="primary.dark" fontWeight={700}>
                      {row.metric} · {row.detail}
                    </Typography>
                  </Box>
                }
                primaryTypographyProps={{ component: "div" }}
                secondaryTypographyProps={{ component: "div" }}
              />
              <ArrowForwardIos sx={{ fontSize: 12, color: "text.disabled", ml: 0.5, mt: 0.75, flexShrink: 0 }} />
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

function columnsForBundle(bundle: MarketTopicRankingsBundle) {
  return [
    {
      key: "dy",
      title: "Maiores dividend yield",
      subtitle: "Rendimento com proventos ou yield equivalente (mock)",
      icon: <Percent aria-hidden />,
      items: bundle.dividendYield,
      accent: "primary" as const,
    },
    {
      key: "mcap",
      title: "Maiores valor de mercado",
      subtitle: "Capitalização ou PL do fundo, conforme o ativo",
      icon: <AccountBalance aria-hidden />,
      items: bundle.marketCap,
      accent: "secondary" as const,
    },
    {
      key: "rev",
      title: "Maiores receitas",
      subtitle: "Receita 12m ou proxy ilustrativo",
      icon: <ReceiptLong aria-hidden />,
      items: bundle.revenue,
      accent: "primary" as const,
    },
  ];
}

export function MarketTopicRankingsSection() {
  const [assetClass, setAssetClass] = useState<RankingAssetClass>("fiis");
  const bundle = MARKET_TOPIC_RANKINGS[assetClass];
  const cols = columnsForBundle(bundle);

  return (
    <Box component="section" sx={{ py: { xs: 4, md: 5 } }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, letterSpacing: "-0.02em" }}>
        Rankings em destaque
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, maxWidth: 720 }}>
        Escolha a classe de ativo para ver os três tópicos — mockup para futura integração com API.
      </Typography>

      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" sx={{ width: "100%", sm: { width: "auto" } }}>
          Atualizar por:
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={assetClass}
          onChange={(_, v: RankingAssetClass | null) => {
            if (v != null) setAssetClass(v);
          }}
          size="small"
          sx={{
            flexWrap: "wrap",
            gap: 0.5,
            "& .MuiToggleButton-root": {
              px: 2,
              py: 0.75,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px !important",
              border: 1,
              borderColor: "divider",
            },
          }}
        >
          {RANKING_ASSET_CLASSES.map((c) => {
            const AssetIcon = ASSET_CLASS_ICONS[c];
            return (
              <ToggleButton key={c} value={c}>
                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                  <AssetIcon sx={{ fontSize: 18, opacity: 0.9 }} aria-hidden />
                  {RANKING_ASSET_LABELS[c]}
                </Box>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {cols.map((col) => (
          <Grid key={col.key} size={{ xs: 12, md: 4 }}>
            <RankingColumn
              title={col.title}
              subtitle={col.subtitle}
              icon={col.icon}
              items={col.items}
              accent={col.accent}
              assetClass={assetClass}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
