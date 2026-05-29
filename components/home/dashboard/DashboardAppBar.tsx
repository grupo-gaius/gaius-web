"use client";

import { Fragment, useState } from "react";
import AccountBalance from "@mui/icons-material/AccountBalance";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CalculateOutlined from "@mui/icons-material/CalculateOutlined";
import Logout from "@mui/icons-material/Logout";
import ShowChart from "@mui/icons-material/ShowChart";
import Timeline from "@mui/icons-material/Timeline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { AssetSearchField } from "@/components/home/dashboard/AssetSearchField";
import { ThemeModeToggle } from "@/components/home/dashboard/ThemeModeToggle";
import { NAV_TOOL_LABELS } from "@/utils/mock-dashboard-data";

const APP_BAR_BG_DARK = "#1c1917";
const APP_BAR_BORDER_DARK = "rgba(255,255,255,0.08)";

const TOOL_ICONS = {
  calc: <CalculateOutlined fontSize="small" />,
  indices: <ShowChart fontSize="small" />,
  sim: <Timeline fontSize="small" />,
} as const;

type DashboardAppBarProps = {
  isAuthenticated: boolean;
  onLogout?: () => void;
  userName?: string | null;
  userEmail?: string | null;
  profileLoading?: boolean;
};

export function DashboardAppBar({
  isAuthenticated,
  onLogout,
  userName,
  userEmail,
  profileLoading,
}: DashboardAppBarProps) {
  const theme = useTheme();
  const barOnDark = theme.palette.mode === "dark";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  function handlePlaceholderToolClick(e: React.MouseEvent) {
    e.preventDefault();
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: barOnDark ? APP_BAR_BG_DARK : theme.palette.background.paper,
        backgroundImage: "none",
        borderBottom: 1,
        borderColor: barOnDark ? APP_BAR_BORDER_DARK : "divider",
        color: barOnDark ? "common.white" : "text.primary",
        boxShadow: barOnDark ? "none" : "0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3 } }}>
        <Box
          component={Link}
          href="/home"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            textDecoration: "none",
            color: "inherit",
            flexShrink: 0,
            "&:hover": { opacity: 0.92 },
          }}
        >
          <AccountBalance
            sx={{
              color: "primary.main",
              fontSize: { xs: 30, sm: 32 },
            }}
            aria-hidden
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: barOnDark ? "#ffffff" : "text.primary",
            }}
          >
            Gaius
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
            px: 1,
          }}
        >
          {NAV_TOOL_LABELS.map((t) => (
            <Fragment key={t.id}>
              {t.id === "calc" ? <AssetSearchField barOnDark={barOnDark} minWidth={220} /> : null}
              <Button
                component={Link}
                href={t.id === "calc" ? "/home/calculadora" : "#"}
                color="inherit"
                size="small"
                startIcon={TOOL_ICONS[t.id as keyof typeof TOOL_ICONS]}
                onClick={t.id === "calc" ? undefined : handlePlaceholderToolClick}
                sx={{
                  color: barOnDark ? "rgba(255,255,255,0.78)" : "text.secondary",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 1.5,
                  "& .MuiButton-startIcon": { color: "primary.main" },
                  "&:hover": {
                    bgcolor: barOnDark ? "rgba(255,255,255,0.08)" : "action.hover",
                    color: barOnDark ? "#fff" : "text.primary",
                  },
                }}
              >
                {t.label}
              </Button>
            </Fragment>
          ))}
        </Box>

        <Box sx={{ flex: { xs: 1, sm: "none" } }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
          <ThemeModeToggle />
          {isAuthenticated ? (
            <AccountMenu
              menuOpen={menuOpen}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              userName={userName}
              userEmail={userEmail}
              profileLoading={profileLoading}
              onLogout={onLogout}
              barOnDark={barOnDark}
            />
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                component={Link}
                href="/login"
                color="inherit"
                size="small"
                sx={{
                  fontWeight: 600,
                  color: barOnDark ? "rgba(255,255,255,0.85)" : "text.primary",
                  "&:hover": { bgcolor: barOnDark ? "rgba(255,255,255,0.08)" : "action.hover" },
                }}
              >
                Entrar
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                color="primary"
                size="small"
                disableElevation
                sx={{ fontWeight: 700, borderRadius: 2, px: 2 }}
              >
                Criar conta
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>

      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          gap: 1,
          px: 2,
          pb: 1.5,
          overflowX: "auto",
          scrollbarWidth: "thin",
          bgcolor: barOnDark ? APP_BAR_BG_DARK : theme.palette.background.paper,
          borderTop: 1,
          borderColor: barOnDark ? APP_BAR_BORDER_DARK : "divider",
        }}
      >
        {NAV_TOOL_LABELS.map((t) => (
          <Fragment key={t.id}>
            {t.id === "calc" ? (
              <AssetSearchField barOnDark={barOnDark} minWidth={168} />
            ) : null}
            <Button
              component={Link}
              href={t.id === "calc" ? "/home/calculadora" : "#"}
              size="small"
              variant="outlined"
              color="primary"
              startIcon={TOOL_ICONS[t.id as keyof typeof TOOL_ICONS]}
              onClick={t.id === "calc" ? undefined : handlePlaceholderToolClick}
              sx={{
                flexShrink: 0,
                borderRadius: 2,
                fontWeight: 600,
                borderColor: barOnDark ? "rgba(255,255,255,0.25)" : "divider",
                color: barOnDark ? "rgba(255,255,255,0.9)" : "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: barOnDark ? "rgba(234, 88, 12, 0.12)" : "rgba(234, 88, 12, 0.08)",
                },
              }}
            >
              {t.label}
            </Button>
          </Fragment>
        ))}
      </Box>
    </AppBar>
  );
}

function AccountMenu({
  menuOpen,
  anchorEl,
  setAnchorEl,
  userName,
  userEmail,
  profileLoading,
  onLogout,
  barOnDark,
}: {
  menuOpen: boolean;
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: null | HTMLElement) => void;
  userName?: string | null;
  userEmail?: string | null;
  profileLoading?: boolean;
  onLogout?: () => void;
  barOnDark: boolean;
}) {
  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="menu da conta"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          color: "primary.main",
          border: 2,
          borderColor: "rgba(234, 88, 12, 0.55)",
          bgcolor: barOnDark ? "rgba(234, 88, 12, 0.12)" : "rgba(234, 88, 12, 0.1)",
          "&:hover": { bgcolor: barOnDark ? "rgba(234, 88, 12, 0.2)" : "rgba(234, 88, 12, 0.16)" },
        }}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: { elevation: 4, sx: { minWidth: 228, mt: 1, borderRadius: 2 } },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          {profileLoading && !userName ? (
            <Typography variant="body2" color="text.secondary">
              Carregando perfil…
            </Typography>
          ) : (
            <>
              {userName ? (
                <Typography variant="subtitle2" fontWeight={700} noWrap>
                  {userName}
                </Typography>
              ) : null}
              {userEmail ? (
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                  {userEmail}
                </Typography>
              ) : null}
              {!userName && !userEmail && !profileLoading ? (
                <Typography variant="body2" color="text.secondary">
                  Conta
                </Typography>
              ) : null}
            </>
          )}
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onLogout?.();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </>
  );
}
