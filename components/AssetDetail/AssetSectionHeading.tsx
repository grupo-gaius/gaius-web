import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";
import type { ReactNode } from "react";

const BRAND_PRIMARY = "#FF6B00";

type AssetSectionHeadingProps = {
  icon: SvgIconComponent;
  title: string;
  endAdornment?: ReactNode;
  sx?: SxProps<Theme>;
};

export function AssetSectionHeading({ icon: Icon, title, endAdornment, sx }: AssetSectionHeadingProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1.5}
      sx={{ mb: 2, ...sx }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            bgcolor: `${BRAND_PRIMARY}1a`,
            color: BRAND_PRIMARY,
            border: `1px solid ${BRAND_PRIMARY}33`,
          }}
        >
          <Icon sx={{ fontSize: 22 }} aria-hidden />
        </Box>
        <Typography
          component="h2"
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
            fontSize: { xs: "1.05rem", sm: "1.125rem" },
            color: "text.primary",
          }}
        >
          {title}
        </Typography>
      </Stack>
      {endAdornment ? <Box sx={{ flexShrink: 0 }}>{endAdornment}</Box> : null}
    </Stack>
  );
}
