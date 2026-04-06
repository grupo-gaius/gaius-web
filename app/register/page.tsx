"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { GuestAppBar } from "@/components/layout/GuestAppBar";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { hydrated, isAuthenticated } = useAuth();

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/home");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <GuestAppBar showLoginLink />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <GuestAppBar showLoginLink />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Card elevation={2}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <RegisterForm />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
