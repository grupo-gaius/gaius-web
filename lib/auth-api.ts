import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types/api";
import { apiClient } from "@/lib/api-client";

export async function loginRequest(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", body);
  return data;
}

export async function registerRequest(body: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>("/auth/register", body);
  return data;
}

export function extractTokenFromLogin(data: LoginResponse): string | null {
  return data.accessToken ?? data.access_token ?? data.token ?? null;
}
