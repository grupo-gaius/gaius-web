export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface UserMeResponse {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  theme?: string;
  preferredCurrency?: string;
  notificationsEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserMeRequest {
  name?: string;
  theme?: string;
  preferredCurrency?: string;
  notificationsEnabled?: boolean;
}
