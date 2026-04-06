import axios, { type AxiosError } from "axios";
import { clearStoredToken, getStoredToken } from "@/utils/storage";
import type { ApiErrorBody } from "@/types/api";

/** Em dev, prefira `/api/proxy` + `API_ORIGIN` no next.config para evitar CORS. Ver `.env.example`. */
const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "/api/proxy";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiErrorBody>) => {
    if (err.response?.status === 401) {
      clearStoredToken();
    }
    return Promise.reject(err);
  },
);

export function getApiBaseUrl(): string {
  return baseURL;
}

export function getErrorMessage(err: unknown, fallback = "Erro inesperado."): string {
  if (axios.isAxiosError<ApiErrorBody>(err)) {
    if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
      return (
        "Sem conexão com a API (Network Error). Confira: backend no ar; " +
        "`NEXT_PUBLIC_API_URL` e `API_ORIGIN` no .env.local; reinicie o `pnpm dev` após mudar o env. " +
        "Se chama a API direta em outra porta, o backend precisa liberar CORS para a origem do front (ex.: http://localhost:3001)."
      );
    }
    const data = err.response?.data;
    if (data?.message && typeof data.message === "string") return data.message;
    if (data?.error && typeof data.error === "string") return data.error;
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
