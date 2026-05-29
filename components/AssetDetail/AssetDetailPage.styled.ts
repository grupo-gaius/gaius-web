import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const Layout = styled(Box)({
  display: "flex",
  flex: 1,
  width: "100%",
  minHeight: 0,
  overflow: "hidden",
});

export const LeftPanel = styled(Box)({
  flex: 1.6,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
});

export const RightPanel = styled(Box)({
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
});

export const PanelHeader = styled(Box)({
  padding: "16px 20px",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  flexShrink: 0,
});

export const HeaderMain = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
});

export const HeaderActions = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
});

export const RangeRow = styled(Box)({
  padding: "8px 20px",
  flexShrink: 0,
});

export const ChartArea = styled(Box)({
  flex: 1,
  padding: "16px 20px",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
});

export const ChartCanvasWrap = styled(Box)({
  flex: 1,
  position: "relative",
  minHeight: 120,
  marginTop: 12,
});

export const StatsFooter = styled(Box)(({ theme }) => ({
  padding: "14px 20px",
  borderTop: `1px solid ${theme.palette.divider}`,
  flexShrink: 0,
  textAlign: "center",
}));

export const RightSection = styled(Box)({
  padding: "14px 16px",
});

export const MiniCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.25, 1.5),
  height: "100%",
}));

export const NewsItemRow = styled(Box)({
  display: "flex",
  gap: 10,
  alignItems: "flex-start",
  marginBottom: 12,
  "&:last-of-type": {
    marginBottom: 0,
  },
});
