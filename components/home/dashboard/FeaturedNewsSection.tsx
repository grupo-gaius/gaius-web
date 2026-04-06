"use client";

import ArrowForward from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { FeaturedNewsCategory, FeaturedNewsItem, MostReadNewsItem } from "@/utils/mock-dashboard-data";
import { FEATURED_NEWS_CATEGORY_LABELS } from "@/utils/mock-dashboard-data";

const CATEGORY_CHIP_COLOR: Record<
  FeaturedNewsCategory,
  "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info"
> = {
  internacional: "info",
  mercado: "primary",
  acoes: "secondary",
  fii: "success",
  cripto: "warning",
  economia: "default",
};

function noopClick(e: React.MouseEvent) {
  e.preventDefault();
}

type FeaturedNewsSectionProps = {
  main: FeaturedNewsItem;
  secondary: [FeaturedNewsItem, FeaturedNewsItem];
  mostRead: MostReadNewsItem[];
};

export function FeaturedNewsSection({ main, secondary, mostRead }: FeaturedNewsSectionProps) {
  return (
    <Box component="section" sx={{ py: { xs: 3, md: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2.5 }}>
        <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
          Notícias em destaque
        </Typography>
        <Button
          component="a"
          href="#"
          onClick={noopClick}
          endIcon={<ArrowForward fontSize="small" />}
          color="primary"
          size="small"
          sx={{ fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}
        >
          Ver lista completa
        </Button>
      </Stack>

      <Grid container spacing={2.5} sx={{ alignItems: "stretch" }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainStoryCard item={main} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
          <Stack spacing={2} sx={{ width: "100%", flex: 1 }}>
            <CompactStoryCard item={secondary[0]} grow />
            <CompactStoryCard item={secondary[1]} grow />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
          <MostReadList items={mostRead} />
        </Grid>
      </Grid>
    </Box>
  );
}

function MainStoryCard({ item }: { item: FeaturedNewsItem }) {
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
      <CardActionArea component="div" onClick={noopClick} sx={{ alignItems: "stretch", height: "100%" }}>
        <Box sx={{ position: "relative", aspectRatio: "4 / 3", bgcolor: "grey.300" }}>
          <Box
            component="img"
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <CategoryChip category={item.category} sx={{ position: "absolute", top: 10, left: 10 }} />
        </Box>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Typography variant="h6" fontWeight={800} component="h3" sx={{ mb: 1, lineHeight: 1.3, fontSize: "1.05rem" }}>
            {item.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.excerpt}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {item.source} · {item.timeLabel}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function CompactStoryCard({ item, grow }: { item: FeaturedNewsItem; grow?: boolean }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        borderColor: "divider",
        boxShadow: "none",
        flex: grow ? 1 : undefined,
        minHeight: grow ? 0 : undefined,
        display: "flex",
        flexDirection: "column",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <CardActionArea
        component="div"
        onClick={noopClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          width: "100%",
          flex: grow ? 1 : undefined,
          p: 0,
          gap: 0,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "21 / 9",
            minHeight: 100,
            maxHeight: 132,
            bgcolor: "grey.300",
          }}
        >
          <Box
            component="img"
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <CategoryChip category={item.category} size="tiny" sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }} />
        </Box>
        <CardContent
          sx={{
            flex: grow ? 1 : undefined,
            py: 1.5,
            px: 1.75,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            "&:last-child": { pb: 1.5 },
          }}
        >
          <Typography variant="subtitle2" fontWeight={800} component="h4" sx={{ mb: 0.75, lineHeight: 1.35 }}>
            {item.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.45,
              mb: 0.75,
              fontSize: "0.8125rem",
            }}
          >
            {item.excerpt}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: "0.7rem", mt: "auto" }}>
            {item.source} · {item.timeLabel}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function CategoryChip({
  category,
  sx,
  size = "normal",
}: {
  category: FeaturedNewsCategory;
  sx?: Record<string, unknown>;
  size?: "normal" | "tiny";
}) {
  const tiny = size === "tiny";
  return (
    <Chip
      label={FEATURED_NEWS_CATEGORY_LABELS[category]}
      color={CATEGORY_CHIP_COLOR[category]}
      size="small"
      variant="filled"
      sx={{
        fontWeight: 800,
        fontSize: tiny ? "0.65rem" : "0.7rem",
        height: tiny ? 22 : 26,
        // Cores sólidas do tema (contraste automático); sem overlay branco que gerava texto ilegível.
        "& .MuiChip-label": { px: tiny ? 0.75 : 1 },
        ...sx,
      }}
    />
  );
}

function MostReadList({ items }: { items: MostReadNewsItem[] }) {
  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        pl: { xs: 0, md: 0.5 },
        borderLeft: { xs: "none", md: 1 },
        borderColor: { md: "divider" },
        pt: { xs: 1, md: 0 },
      }}
    >
      <Typography variant="subtitle2" fontWeight={800} color="primary.dark" sx={{ mb: 1, letterSpacing: "0.02em" }}>
        Mais lidas
      </Typography>
      <List disablePadding dense>
        {items.map((row, index) => (
          <Box key={row.id}>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={noopClick}
                sx={{
                  borderRadius: 1,
                  py: 1,
                  px: 1,
                  alignItems: "flex-start",
                  gap: 1.25,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    flexShrink: 0,
                    borderRadius: 1.5,
                    overflow: "hidden",
                    bgcolor: "grey.300",
                  }}
                >
                  <Box
                    component="img"
                    src={row.imageUrl}
                    alt={row.title}
                    loading="lazy"
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.4, mb: 0.25 }}>
                    {row.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {row.readsLabel}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
            {index < items.length - 1 ? <Divider component="li" sx={{ my: 0.5 }} /> : null}
          </Box>
        ))}
      </List>
    </Box>
  );
}
