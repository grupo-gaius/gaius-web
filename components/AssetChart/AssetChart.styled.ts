import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export const AssetChartPaper = styled(Paper)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  minWidth: 0,
  overflow: "visible",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const AssetChartPlot = styled("div")({
  flex: 1,
  width: "100%",
  minWidth: 0,
  position: "relative",
});
