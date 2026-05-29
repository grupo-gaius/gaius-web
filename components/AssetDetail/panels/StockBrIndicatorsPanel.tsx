"use client";

import AnalyticsOutlined from "@mui/icons-material/AnalyticsOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { AssetSectionHeading } from "@/components/AssetDetail/AssetSectionHeading";
import { AssetTypeBadge } from "@/components/AssetDetail/AssetTypeBadge";
import { MiniCard, RightSection } from "@/components/AssetDetail/AssetDetailPage.styled";
import type { FundamentalIndicatorItem } from "@/utils/stock-fundamental-indicators";
import { isFundamentalIndicatorHighlighted } from "@/utils/stock-fundamental-indicators";

const BRAND_PRIMARY = "#FF6B00";
const BRAND_POSITIVE = "#007a55";

/** Quantidade exibida antes de expandir (grade 2 colunas). */
const VISIBLE_INDICATOR_COUNT = 8;

type StockBrIndicatorsPanelProps = {
  indicators: FundamentalIndicatorItem[];
};

function IndicatorGrid({ items }: { items: FundamentalIndicatorItem[] }) {
  return (
    <Grid container spacing={1.5}>
      {items.map((ind) => {
        const highlighted = isFundamentalIndicatorHighlighted(
          ind.label,
          ind.value,
          ind.highlight,
        );
        return (
          <Grid key={ind.label} size={{ xs: 6 }}>
            <MiniCard>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ lineHeight: 1.35 }}
              >
                {ind.label}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: highlighted ? BRAND_POSITIVE : undefined }}
              >
                {ind.value}
              </Typography>
            </MiniCard>
          </Grid>
        );
      })}
    </Grid>
  );
}

export function StockBrIndicatorsPanel({ indicators }: StockBrIndicatorsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const visible = indicators.slice(0, VISIBLE_INDICATOR_COUNT);
  const hidden = indicators.slice(VISIBLE_INDICATOR_COUNT);
  const hasMore = hidden.length > 0;

  return (
    <RightSection>
      <AssetSectionHeading
        icon={AnalyticsOutlined}
        title="Indicadores fundamentalistas"
        endAdornment={<AssetTypeBadge type="STOCK_BR" />}
      />

      <IndicatorGrid items={visible} />

      {hasMore ? (
        <>
          <Collapse in={expanded} unmountOnExit>
            <Box sx={{ mt: 1.5 }}>
              <IndicatorGrid items={hidden} />
            </Box>
          </Collapse>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setExpanded((e) => !e)}
            sx={{
              mt: 1.5,
              borderColor: "divider",
              color: "text.secondary",
              fontWeight: 600,
              "&:hover": {
                borderColor: BRAND_PRIMARY,
                color: BRAND_PRIMARY,
                bgcolor: `${BRAND_PRIMARY}0a`,
              },
            }}
          >
            {expanded ? "Ver menos indicadores" : `Ver todos os indicadores (${hidden.length})`}
          </Button>
        </>
      ) : null}
    </RightSection>
  );
}
