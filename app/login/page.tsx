"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { GuestAppBar } from "@/components/layout/GuestAppBar";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { setStoredToken } from "@/utils/storage";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hydrated, isAuthenticated } = useAuth();
  const justRegistered = searchParams.get("registered") === "1";

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/home");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {justRegistered ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Cadastro concluído. Faça login com sua nova conta.
        </Alert>
      ) : null}
      <Card elevation={2}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <LoginForm onLoggedIn={setStoredToken} />
        </CardContent>
      </Card>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <GuestAppBar showRegisterLink />
      <Suspense
        fallback={
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        }
      >
        <LoginInner />
      </Suspense>
    </Box>
  );
}
