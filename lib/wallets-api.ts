import { apiClient } from "@/lib/api-client";
import type {
  ConsolidatedWalletsResponse,
  CreateTransactionRequest,
  CreateWalletRequest,
  ListWalletTransactionsParams,
  UpdateWalletRequest,
  Wallet,
  WalletSummary,
  WalletTransactionsResponse,
} from "@/types/wallets";

/** POST /wallets */
export async function createWallet(body: CreateWalletRequest): Promise<Wallet> {
  const { data } = await apiClient.post<Wallet>("/wallets", body);
  return data;
}

/** GET /wallets */
export async function listWallets(): Promise<Wallet[]> {
  const { data } = await apiClient.get<Wallet[] | { data?: Wallet[]; wallets?: Wallet[] }>(
    "/wallets",
  );
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.wallets)) return data.wallets;
  return [];
}

/** GET /wallets/consolidated */
export async function getConsolidatedWallets(): Promise<ConsolidatedWalletsResponse> {
  const { data } = await apiClient.get<ConsolidatedWalletsResponse>("/wallets/consolidated");
  return data;
}

/** GET /wallets/:id */
export async function getWalletById(walletId: string): Promise<Wallet> {
  const { data } = await apiClient.get<Wallet>(`/wallets/${encodeURIComponent(walletId)}`);
  return data;
}

/** GET /wallets/:id/summary */
export async function getWalletSummary(walletId: string): Promise<WalletSummary> {
  const { data } = await apiClient.get<WalletSummary>(
    `/wallets/${encodeURIComponent(walletId)}/summary`,
  );
  return data;
}

/** PATCH /wallets/:id */
export async function updateWallet(
  walletId: string,
  body: UpdateWalletRequest,
): Promise<Wallet> {
  const { data } = await apiClient.patch<Wallet>(
    `/wallets/${encodeURIComponent(walletId)}`,
    body,
  );
  return data;
}

/** DELETE /wallets/:id */
export async function deleteWallet(walletId: string): Promise<void> {
  await apiClient.delete(`/wallets/${encodeURIComponent(walletId)}`);
}

/** POST /wallets/:id/transactions */
export async function createWalletTransaction(
  walletId: string,
  body: CreateTransactionRequest,
): Promise<WalletTransactionsResponse> {
  const { data } = await apiClient.post<WalletTransactionsResponse>(
    `/wallets/${encodeURIComponent(walletId)}/transactions`,
    body,
  );
  return data;
}

/** GET /wallets/:id/transactions */
export async function listWalletTransactions(
  walletId: string,
  params?: ListWalletTransactionsParams,
): Promise<WalletTransactionsResponse> {
  const { data } = await apiClient.get<WalletTransactionsResponse>(
    `/wallets/${encodeURIComponent(walletId)}/transactions`,
    { params },
  );
  return data;
}
