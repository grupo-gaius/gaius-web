const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function isValidPasswordMin6(password: string): boolean {
  return password.length >= 6;
}

export function validateLoginForm(email: string, password: string): string | null {
  if (!email.trim()) return "Informe o e-mail.";
  if (!isValidEmail(email)) return "E-mail inválido.";
  if (!password) return "Informe a senha.";
  if (!isValidPasswordMin6(password)) return "A senha deve ter no mínimo 6 caracteres.";
  return null;
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
): string | null {
  if (!name.trim()) return "Informe o nome.";
  if (!email.trim()) return "Informe o e-mail.";
  if (!isValidEmail(email)) return "E-mail inválido.";
  if (!password) return "Informe a senha.";
  if (!isValidPasswordMin6(password)) return "A senha deve ter no mínimo 6 caracteres.";
  return null;
}
