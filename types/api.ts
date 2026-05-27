/**
 * Barrel de tipos da API Gaius.
 * Preferir imports diretos de `@/types/auth`, `@/types/users`, etc.
 */
export type { ApiErrorBody, MessageResponse, PageParams, CursorParams, PaginatedMeta, PaginatedResponse } from "@/types/common";
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";
export type { AuthUser, UserMeResponse, UpdateUserMeRequest } from "@/types/users";
export type {
  Asset,
  AssetApiItem,
  AssetsListResponse,
  ListAssetsParams,
  SearchAssetsParams,
  AssetQuote,
  AssetDetailResponse,
  SyncAssetsResponse,
} from "@/types/assets";
export type {
  Wallet,
  CreateWalletRequest,
  UpdateWalletRequest,
  WalletSummary,
  ConsolidatedWalletsResponse,
  TransactionType,
  CreateTransactionRequest,
  WalletTransaction,
  ListWalletTransactionsParams,
  WalletTransactionsResponse,
} from "@/types/wallets";
