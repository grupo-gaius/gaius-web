const TOKEN_KEY = "gaius_auth_token";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Permite que `useSyncExternalStore` reaja a login/logout na mesma aba. */
export function subscribeAuthStorage(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
  emit();
}

export function clearStoredToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  emit();
}
