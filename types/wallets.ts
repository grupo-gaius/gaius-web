import type { CursorParams } from "@/types/common";

export interface Wallet {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface CreateWalletRequest {
  name: string;
  description?: string;
}

export interface UpdateWalletRequest {
  name?: string;
  description?: string;
}

export interface WalletSummary {
  walletId?: string;
  totalValue?: number;
  totalInvested?: number;
  profitLoss?: number;
  profitLossPercent?: number;
  positionsCount?: number;
  [key: string]: unknown;
}

export interface ConsolidatedWalletsResponse {
  totalValue?: number;
  totalInvested?: number;
  profitLoss?: number;
  profitLossPercent?: number;
  wallets?: WalletSummary[];
  [key: string]: unknown;
}

export type TransactionType = "BUY" | "SELL" | "DIVIDEND" | string;

export interface CreateTransactionRequest {
  assetId: string;
  type: TransactionType;
  quantity: number;
  price: number;
  fee?: number;
  date: string;
}

export interface WalletTransaction {
  id: string;
  walletId?: string;
  assetId?: string;
  type?: TransactionType;
  quantity?: number;
  price?: number;
  fee?: number;
  date?: string;
  [key: string]: unknown;
}

export interface ListWalletTransactionsParams extends CursorParams {}

export interface WalletTransactionsResponse {
  data?: WalletTransaction[];
  items?: WalletTransaction[];
  transactions?: WalletTransaction[];
  nextCursor?: string;
  [key: string]: unknown;
}
