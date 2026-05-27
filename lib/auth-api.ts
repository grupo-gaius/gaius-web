import { apiClient } from "@/lib/api-client";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
} from "@/types/auth";
import type { MessageResponse } from "@/types/common";

/** POST /auth/register */
export async function registerRequest(body: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>("/auth/register", body);
  return data;
}

/** POST /auth/login */
export async function loginRequest(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", body);
  return data;
}

/** POST /auth/refresh */
export async function refreshTokenRequest(body: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  const { data } = await apiClient.post<RefreshTokenResponse>("/auth/refresh", body);
  return data;
}

/** POST /auth/logout */
export async function logoutRequest(body: LogoutRequest): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>("/auth/logout", body);
  return data;
}

/** POST /auth/forgot-password */
export async function forgotPasswordRequest(body: ForgotPasswordRequest): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>("/auth/forgot-password", body);
  return data;
}

/** POST /auth/reset-password */
export async function resetPasswordRequest(body: ResetPasswordRequest): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>("/auth/reset-password", body);
  return data;
}

export function extractTokenFromLogin(data: LoginResponse): string | null {
  return data.accessToken ?? data.access_token ?? data.token ?? null;
}

export function extractRefreshTokenFromLogin(data: LoginResponse): string | null {
  return data.refreshToken ?? data.refresh_token ?? null;
}

export function extractTokenFromRefresh(data: RefreshTokenResponse): string | null {
  return data.accessToken ?? data.access_token ?? data.token ?? null;
}

export function extractRefreshTokenFromRefresh(data: RefreshTokenResponse): string | null {
  return data.refreshToken ?? data.refresh_token ?? null;
}
