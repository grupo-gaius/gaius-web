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
import { registerRequest } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/api-client";
import { validateRegisterForm } from "@/utils/validation";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateRegisterForm(name, email, password);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await registerRequest({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      router.replace("/login?registered=1");
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível concluir o cadastro."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
      <Typography variant="h5" component="h1" gutterBottom fontWeight={600}>
        Criar conta
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Preencha os dados abaixo. Você será redirecionado para o login.
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
        id="name"
        label="Nome"
        name="name"
        autoComplete="name"
        autoFocus
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="E-mail"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Senha (mín. 6 caracteres)"
        type="password"
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.25 }} disabled={submitting}>
        {submitting ? "Enviando…" : "Cadastrar"}
      </Button>
      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        Já tem conta?{" "}
        <Link component={NextLink} href="/login">
          Entrar
        </Link>
      </Typography>
    </Box>
  );
}
