import AnalyticsOutlined from "@mui/icons-material/AnalyticsOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AssetSectionHeading } from "@/components/AssetDetail/AssetSectionHeading";
import { AssetTypeBadge } from "@/components/AssetDetail/AssetTypeBadge";
import { RightSection } from "@/components/AssetDetail/AssetDetailPage.styled";
import { ASSET_TYPE_LABELS, type AssetType } from "@/types/asset-detail";

const BRAND_PRIMARY = "#FF6B00";

const PLACEHOLDER_COPY: Partial<Record<AssetType, string>> = {
  FII: "Indicadores de fundos imobiliários (DY, P/VP, vacância, patrimônio) serão exibidos aqui.",
  ETF_BR: "Indicadores de ETFs nacionais (taxa de administração, tracking error, PL) em breve.",
  ETF_US: "Indicadores de ETFs internacionais em breve.",
  STOCK_US: "Indicadores fundamentalistas de ações americanas em breve.",
  CRYPTO: "Métricas on-chain, dominância e volume 24h em breve.",
};

type AssetTypePlaceholderPanelProps = {
  type: Exclude<AssetType, "STOCK_BR">;
};

export function AssetTypePlaceholderPanel({ type }: AssetTypePlaceholderPanelProps) {
  return (
    <RightSection>
      <AssetSectionHeading
        icon={AnalyticsOutlined}
        title={`Indicadores · ${ASSET_TYPE_LABELS[type]}`}
        endAdornment={<AssetTypeBadge type={type} prominent />}
      />
      <Box
        sx={{
          py: 3,
          px: 2,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          borderStyle: "dashed",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {PLACEHOLDER_COPY[type] ?? "Painel específico para este tipo de ativo em desenvolvimento."}
        </Typography>
        <Typography variant="caption" sx={{ color: BRAND_PRIMARY, fontWeight: 600 }}>
          Tipo detectado: {ASSET_TYPE_LABELS[type]}
        </Typography>
      </Box>
    </RightSection>
  );
}
