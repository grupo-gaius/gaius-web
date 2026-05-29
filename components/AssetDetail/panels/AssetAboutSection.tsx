"use client";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import StarOutline from "@mui/icons-material/StarOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { AssetSectionHeading } from "@/components/AssetDetail/AssetSectionHeading";
import { RightSection } from "@/components/AssetDetail/AssetDetailPage.styled";
import type { AssetAboutDetail } from "@/types/asset-detail";

const BRAND_PRIMARY = "#FF6B00";
const PREVIEW_PARAGRAPHS = 2;
const PLAIN_ABOUT_PREVIEW_LEN = 200;

type AssetAboutSectionProps = {
  aboutDetail: AssetAboutDetail;
  /** Fallback quando não há aboutDetail (texto simples). */
  plainAbout?: string;
};

export function AssetAboutSection({ aboutDetail, plainAbout }: AssetAboutSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [following, setFollowing] = useState(true);

  const allParagraphs = useMemo(
    () => aboutDetail.sections.flatMap((s) => s.paragraphs),
    [aboutDetail.sections],
  );

  const hasMore = allParagraphs.length > PREVIEW_PARAGRAPHS;

  const previewContent = useMemo(() => {
    if (expanded) return aboutDetail.sections;
    const first = aboutDetail.sections[0];
    if (!first) return [];
    return [
      {
        ...first,
        paragraphs: first.paragraphs.slice(0, PREVIEW_PARAGRAPHS),
      },
    ];
  }, [aboutDetail.sections, expanded]);

  if (!aboutDetail.sections.length && plainAbout) {
    return (
      <RightSection>
        <AssetSectionHeading icon={BusinessOutlined} title="Sobre a empresa" sx={{ mb: 1.5 }} />
        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
          {plainAbout}
        </Typography>
      </RightSection>
    );
  }

  return (
    <RightSection>
      <AssetSectionHeading icon={BusinessOutlined} title="Sobre a empresa" />
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, lineHeight: 1.35, letterSpacing: "0.01em" }}>
        {aboutDetail.companyTitle}
      </Typography>

      {aboutDetail.userRatingLabel ? (
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
          <StarOutline sx={{ fontSize: 18, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            {aboutDetail.userRatingLabel}
          </Typography>
          <Button size="small" variant="text" sx={{ minWidth: 0, px: 0.5, color: BRAND_PRIMARY, fontWeight: 600 }}>
            Avalie
          </Button>
        </Stack>
      ) : null}

      <Button
        size="small"
        variant="outlined"
        onClick={() => setFollowing((f) => !f)}
        sx={{
          mb: 2,
          borderColor: "divider",
          color: "text.secondary",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        {following ? "Deixar de seguir" : "Seguir"}
      </Button>

      {previewContent.map((section) => (
        <Box key={section.title ?? "section"} sx={{ mb: 2 }}>
          {section.title ? (
            <Typography
              variant="subtitle2"
              display="block"
              sx={{ mb: 1, fontWeight: 700, color: "text.primary", letterSpacing: "0.01em" }}
            >
              {section.title}
            </Typography>
          ) : null}
          {section.paragraphs.map((paragraph) => (
            <Typography
              key={paragraph.slice(0, 48)}
              variant="body2"
              color="text.secondary"
              lineHeight={1.65}
              sx={{ mb: 1.25 }}
            >
              {paragraph}
            </Typography>
          ))}
        </Box>
      ))}

      {hasMore ? (
        <Button
          size="small"
          color="inherit"
          onClick={() => setExpanded((e) => !e)}
          endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
          sx={{ mt: 0.25, px: 0, minWidth: 0, color: BRAND_PRIMARY, fontWeight: 600 }}
        >
          {expanded ? "ver menos" : "ver mais"}
        </Button>
      ) : null}
    </RightSection>
  );
}

export function AssetAboutPlainSection({ about }: { about: string }) {
  const [expanded, setExpanded] = useState(false);
  const preview =
    about.length <= PLAIN_ABOUT_PREVIEW_LEN || expanded
      ? about
      : `${about.slice(0, PLAIN_ABOUT_PREVIEW_LEN).trim()}…`;

  return (
    <RightSection>
      <AssetSectionHeading icon={BusinessOutlined} title="Sobre a empresa" sx={{ mb: 1.5 }} />
      <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
        {preview}
      </Typography>
      {about.length > PLAIN_ABOUT_PREVIEW_LEN ? (
        <Button
          size="small"
          color="inherit"
          onClick={() => setExpanded((e) => !e)}
          endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
          sx={{ mt: 0.5, px: 0, minWidth: 0, color: BRAND_PRIMARY, fontWeight: 600 }}
        >
          {expanded ? "ver menos" : "ver mais"}
        </Button>
      ) : null}
    </RightSection>
  );
}
