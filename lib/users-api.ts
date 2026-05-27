import { apiClient } from "@/lib/api-client";
import type { MessageResponse } from "@/types/common";
import type { AuthUser, UpdateUserMeRequest, UserMeResponse } from "@/types/users";

function mapUserMeResponse(data: UserMeResponse): AuthUser {
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

/** GET /users/me */
export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<UserMeResponse>("/users/me");
  return mapUserMeResponse(data);
}

/** GET /users/me — resposta bruta do backend */
export async function fetchCurrentUserRaw(): Promise<UserMeResponse> {
  const { data } = await apiClient.get<UserMeResponse>("/users/me");
  return data;
}

/** PATCH /users/me */
export async function updateCurrentUser(body: UpdateUserMeRequest): Promise<UserMeResponse> {
  const { data } = await apiClient.patch<UserMeResponse>("/users/me", body);
  return data;
}

/** DELETE /users/me */
export async function deleteCurrentUser(): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>("/users/me");
  return data;
}
