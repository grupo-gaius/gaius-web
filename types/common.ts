/** Parâmetros de paginação por página (offset). */
export interface PageParams {
  page?: number;
  limit?: number;
}

/** Parâmetros de paginação por cursor. */
export interface CursorParams {
  cursor?: string;
  limit?: number;
}

export interface PaginatedMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
  nextCursor?: string;
}

export interface PaginatedResponse<T> {
  data?: T[];
  items?: T[];
  meta?: PaginatedMeta;
  page?: number;
  limit?: number;
  total?: number;
}

export interface ApiErrorBody {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface MessageResponse {
  message?: string;
}
