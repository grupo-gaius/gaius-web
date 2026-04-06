/** Payload enviado para POST /auth/login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Resposta do POST /auth/login (backend local: accessToken) */
export interface LoginResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  expires_in?: number;
  user?: AuthUser;
}

/** Resposta do GET /users/me */
export interface UserMeResponse {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

/** Payload enviado para POST /auth/register */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id?: string;
  message?: string;
  user?: AuthUser;
}

/** Item retornado pela API de ativos (campos opcionais para mapear variações de backend) */
export interface AssetApiItem {
  id: string;
  name: string;
  symbol?: string;
  price?: number;
  current_price?: number;
  value?: number;
  change_percent?: number;
  variation_percent?: number;
  changePercent?: number;
}

export interface AssetsListResponse {
  data?: AssetApiItem[];
  assets?: AssetApiItem[];
}

/** Modelo normalizado usado na UI */
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  changePercent: number;
}

export interface ApiErrorBody {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}
