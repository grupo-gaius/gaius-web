"use client";

import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import { useThemeMode } from "@/components/providers/ThemeModeProvider";

export function ThemeModeToggle() {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";
  const onAppBarDark = theme.palette.mode === "dark";

  return (
    <IconButton
      type="button"
      size="large"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMode();
      }}
      sx={{
        color: onAppBarDark ? "rgba(255,255,255,0.88)" : "text.primary",
        border: 2,
        borderColor: onAppBarDark ? "rgba(234, 88, 12, 0.45)" : "divider",
        bgcolor: onAppBarDark ? "rgba(234, 88, 12, 0.1)" : "action.hover",
        "&:hover": {
          bgcolor: onAppBarDark ? "rgba(234, 88, 12, 0.18)" : "action.selected",
        },
      }}
    >
      {isDark ? <LightModeOutlined /> : <DarkModeOutlined />}
    </IconButton>
  );
}
