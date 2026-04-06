"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ShowcaseTicker } from "@/utils/mock-dashboard-data";

type MarketShowcaseProps = {
  items: ShowcaseTicker[];
};

function formatPct(value: number): string {
  const s = value.toFixed(2).replace(".", ",");
  return `${value >= 0 ? "+" : ""}${s}%`;
}

/** Repete os tickers para preencher telas largas; duas metades idênticas = loop infinito sem salto. */
function buildInfiniteTrack(source: ShowcaseTicker[], repeatsPerHalf: number): ShowcaseTicker[] {
  const segment = Array.from({ length: repeatsPerHalf }, () => source).flat();
  return [...segment, ...segment];
}

/**
 * Faixa tipo *stock ticker* / *ticker tape* (também chamado de marquee):
 * texto em movimento contínuo na horizontal, em loop.
 */
export function MarketShowcase({ items }: MarketShowcaseProps) {
  const repeatsPerHalf = Math.max(10, Math.ceil(48 / Math.max(items.length, 1)));
  const loop = buildInfiniteTrack(items, repeatsPerHalf);
  const durationSec = Math.min(260, Math.max(64, loop.length * 1.55));

  return (
    <Box
      component="section"
      aria-label="Cotações em rotação — ticker do mercado"
      sx={{
        position: "relative",
        width: "100vw",
        maxWidth: "100vw",
        left: "50%",
        transform: "translateX(-50%)",
        py: { xs: 2, md: 2.5 },
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
        "@media (prefers-reduced-motion: reduce)": {
          overflowX: "auto",
        },
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          width: "max-content",
          animation: `showcase-marquee ${durationSec}s linear infinite`,
          "@keyframes showcase-marquee": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-50%)" },
          },
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
          },
          "@media (hover: hover)": {
            "&:hover": {
              animationPlayState: "paused",
            },
          },
        }}
      >
        {loop.map((item, i) => (
          <Box
            key={`${item.id}-${i}`}
            sx={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: 1.5,
              flexShrink: 0,
              px: { xs: 2.5, sm: 3.5 },
              py: 0.5,
              borderRight: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              component="span"
              variant="subtitle1"
              fontWeight={800}
              color="primary.dark"
              sx={{ letterSpacing: "0.04em", fontSize: { xs: "0.95rem", sm: "1.05rem" }, whiteSpace: "nowrap" }}
            >
              {item.symbol}
            </Typography>
            <Typography
              component="span"
              variant="subtitle1"
              fontWeight={800}
              sx={{
                fontVariantNumeric: "tabular-nums",
                color: item.changePct >= 0 ? "success.dark" : "error.dark",
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                whiteSpace: "nowrap",
              }}
            >
              {formatPct(item.changePct)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
