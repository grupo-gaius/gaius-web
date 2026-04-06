import { alpha, createTheme } from "@mui/material/styles";
import type { PaletteMode, Theme } from "@mui/material/styles";

const fontStack = 'var(--font-plus-jakarta), "Segoe UI", "Helvetica Neue", sans-serif';

export const MODE_STORAGE_KEY = "gaius-mode";

const sharedShape = { borderRadius: 12 };

const sharedTypography = {
  fontFamily: fontStack,
  h4: { fontWeight: 800 as const },
  h5: { fontWeight: 800 as const },
  h6: { fontWeight: 700 as const },
  button: { fontWeight: 700 as const },
};

const sharedComponents = {
  MuiButton: {
    styleOverrides: {
      root: { textTransform: "none" as const, borderRadius: 10 },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        backgroundImage: "none",
        ...(theme.palette.mode === "dark" && {
          border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
          boxShadow: `0 1px 0 ${alpha(theme.palette.common.black, 0.4)}`,
        }),
      }),
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) =>
        theme.palette.mode === "dark"
          ? {
              backgroundImage: "none",
              border: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
            }
          : {},
    },
  },
};

/** Tema MUI clássico (sem CSS variables) — um objeto por modo, troca estável com React state. */
export function createAppTheme(mode: PaletteMode): Theme {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      ...(isDark
        ? {
            primary: {
              main: "#fb923c",
              light: "#fdba74",
              dark: "#f97316",
              contrastText: "#1c1917",
            },
            secondary: {
              main: "#a8a29e",
              light: "#d6d3d1",
              dark: "#78716c",
              contrastText: "#1c1917",
            },
            background: {
              default: "#090807",
              paper: "#141210",
            },
            text: {
              primary: "#f5f5f4",
              secondary: "#a8a29e",
            },
            divider: "rgba(245, 245, 244, 0.1)",
            success: { main: "#4ade80", light: "#86efac", dark: "#22c55e" },
            error: { main: "#f87171", light: "#fca5a5", dark: "#ef4444" },
            action: {
              hover: "rgba(251, 146, 60, 0.08)",
              selected: "rgba(251, 146, 60, 0.14)",
            },
          }
        : {
            primary: {
              main: "#ea580c",
              light: "#fb923c",
              dark: "#c2410c",
              contrastText: "#ffffff",
            },
            secondary: {
              main: "#57534e",
              light: "#78716c",
              dark: "#292524",
              contrastText: "#fafaf9",
            },
            background: {
              default: "#e7e5e4",
              paper: "#fafaf9",
            },
            text: {
              primary: "#1c1917",
              secondary: "#44403c",
            },
            divider: "rgba(28, 25, 23, 0.1)",
            success: { main: "#15803d", dark: "#166534" },
            error: { main: "#b91c1c", dark: "#991b1b" },
          }),
    },
    shape: sharedShape,
    typography: sharedTypography,
    components: sharedComponents,
  });
}
