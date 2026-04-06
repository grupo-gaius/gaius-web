"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";

type GuestAppBarProps = {
  title?: string;
  showRegisterLink?: boolean;
  showLoginLink?: boolean;
};

export function GuestAppBar({
  title = "Gaius",
  showRegisterLink,
  showLoginLink,
}: GuestAppBarProps) {
  return (
    <AppBar position="static" elevation={0} color="default" sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {showLoginLink ? (
            <Button component={Link} href="/login" color="primary" variant="text">
              Entrar
            </Button>
          ) : null}
          {showRegisterLink ? (
            <Button component={Link} href="/register" variant="contained" disableElevation>
              Criar conta
            </Button>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
