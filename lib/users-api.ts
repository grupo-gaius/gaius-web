import type { AuthUser, UserMeResponse } from "@/types/api";
import { apiClient } from "@/lib/api-client";

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<UserMeResponse>("/users/me");
  const id = String(data.id ?? data._id ?? "").trim();
  if (!id) {
    throw new Error("Resposta de /users/me sem identificador.");
  }
  return {
    id,
    name: data.name?.trim() || "Usuário",
    email: data.email?.trim() ?? "",
  };
}
