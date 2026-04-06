"use client";

import AccountBalance from "@mui/icons-material/AccountBalance";
import Agriculture from "@mui/icons-material/Agriculture";
import Apartment from "@mui/icons-material/Apartment";
import CandlestickChart from "@mui/icons-material/CandlestickChart";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import CurrencyBitcoin from "@mui/icons-material/CurrencyBitcoin";
import CurrencyExchange from "@mui/icons-material/CurrencyExchange";
import Domain from "@mui/icons-material/Domain";
import Layers from "@mui/icons-material/Layers";
import Leaderboard from "@mui/icons-material/Leaderboard";
import Link from "@mui/icons-material/Link";
import PieChart from "@mui/icons-material/PieChart";
import Public from "@mui/icons-material/Public";
import RocketLaunch from "@mui/icons-material/RocketLaunch";
import Savings from "@mui/icons-material/Savings";
import ShowChart from "@mui/icons-material/ShowChart";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ComponentType } from "react";
import type { AssetCategoryCard } from "@/utils/mock-dashboard-data";

const ASSET_ICONS: Record<string, ComponentType<SvgIconProps>> = {
  acoes: CandlestickChart,
  fiis: Apartment,
  stocks: ShowChart,
  bdrs: Link,
  "etfs-int": Public,
  reits: Domain,
  etfs: PieChart,
  "fundos-invest": Layers,
  "renda-fixa": Savings,
  "tesouro-direto": AccountBalance,
  fiagros: Agriculture,
  cripto: CurrencyBitcoin,
  indices: Leaderboard,
  moedas: CurrencyExchange,
  startups: RocketLaunch,
};

type AllAssetsSectionProps = {
  categories: AssetCategoryCard[];
};

export function AllAssetsSection({ categories }: AllAssetsSectionProps) {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 0.75, letterSpacing: "-0.02em" }}>
        Ampla Cobertura de Ativos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
        Um só lugar para navegar entre classes — mock visual até a listagem dinâmica.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            md: "repeat(5, minmax(0, 1fr))",
          },
        }}
      >
        {categories.map((item) => {
          const Icon = ASSET_ICONS[item.id] ?? CategoryOutlined;
          return (
            <Box key={item.id} sx={{ minWidth: 0 }}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: 1,
                  borderColor: "divider",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s, border-color 0.2s, transform 0.2s",
                  "&:hover": {
                    boxShadow: 6,
                    borderColor: (t) => alpha(t.palette.primary.main, 0.35),
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardActionArea
                  component="div"
                  onClick={(e) => e.preventDefault()}
                  sx={{ height: "100%", alignItems: "stretch", display: "block" }}
                >
                  <CardContent sx={{ p: 2.25, "&:last-child": { pb: 2.25 } }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1.5,
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.14),
                        color: "primary.main",
                        "& .MuiSvgIcon-root": { fontSize: 26 },
                      }}
                    >
                      <Icon aria-hidden />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5, lineHeight: 1.25 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.4 }}>
                      {item.subtitle}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
