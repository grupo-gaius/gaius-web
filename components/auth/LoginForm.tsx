"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { extractTokenFromLogin, loginRequest } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/api-client";
import { validateLoginForm } from "@/utils/validation";

type LoginFormProps = {
  onLoggedIn: (token: string) => void;
};

export function LoginForm({ onLoggedIn }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateLoginForm(email, password);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const data = await loginRequest({ email: email.trim(), password });
      const token = extractTokenFromLogin(data);
      if (!token) {
        setError("Resposta do servidor sem token. Verifique o contrato da API.");
        return;
      }
      onLoggedIn(token);
      router.replace("/home");
    } catch (err) {
      setError(getErrorMessage(err, "Falha no login."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
      <Typography variant="h5" component="h1" gutterBottom fontWeight={600}>
        Entrar
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Use seu e-mail e senha para acessar.
      </Typography>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="E-mail"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Senha"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25 }} disabled={submitting}>
        {submitting ? "Entrando…" : "Entrar"}
      </Button>
      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        Não tem conta?{" "}
        <Link component={NextLink} href="/register">
          Cadastre-se
        </Link>
      </Typography>
    </Box>
  );
}
