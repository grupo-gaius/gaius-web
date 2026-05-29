/** Altura do AppBar fixo (toolbar + faixa mobile de atalhos). */
export const DASHBOARD_APP_BAR_HEIGHT = {
  xs: 108,
  sm: 64,
} as const;

/** Área principal abaixo do menu — preenche o viewport restante. */
export const dashboardMainBelowAppBarSx = {
  height: "100dvh",
  boxSizing: "border-box",
  pt: {
    xs: `${DASHBOARD_APP_BAR_HEIGHT.xs}px`,
    sm: `${DASHBOARD_APP_BAR_HEIGHT.sm}px`,
  },
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
} as const;

/** Shell de página com menu fixo no topo. */
export const dashboardPageShellSx = {
  height: "100dvh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  bgcolor: "background.default",
} as const;
