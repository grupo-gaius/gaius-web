import Chip from "@mui/material/Chip";
import { ASSET_TYPE_LABELS, type AssetType } from "@/types/asset-detail";

const BRAND_PRIMARY = "#FF6B00";

type AssetTypeBadgeProps = {
  type: AssetType;
  /** Destaque no header (cor da marca). */
  prominent?: boolean;
};

export function AssetTypeBadge({ type, prominent = false }: AssetTypeBadgeProps) {
  return (
    <Chip
      label={ASSET_TYPE_LABELS[type]}
      size="small"
      variant={prominent ? "filled" : "outlined"}
      sx={{
        height: prominent ? 24 : 22,
        fontSize: "0.7rem",
        fontWeight: 600,
        ...(prominent
          ? {
              bgcolor: `${BRAND_PRIMARY}22`,
              color: BRAND_PRIMARY,
              border: `1px solid ${BRAND_PRIMARY}55`,
            }
          : {}),
      }}
    />
  );
}
