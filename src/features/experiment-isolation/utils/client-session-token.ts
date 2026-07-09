const STORAGE_PREFIX = "sql-play:experiment-client-token";

interface ClientSessionScope {
  trackSlug: string;
  labSlug: string;
}

function buildStorageKey(scope: ClientSessionScope): string {
  return `${STORAGE_PREFIX}:${scope.trackSlug}:${scope.labSlug}`;
}

export function getOrCreateClientSessionToken(
  scope: ClientSessionScope,
): string {
  const key = buildStorageKey(scope);

  if (typeof window === "undefined") {
    return crypto.randomUUID();
  }

  const existing = window.localStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const token = crypto.randomUUID();
  window.localStorage.setItem(key, token);
  return token;
}
