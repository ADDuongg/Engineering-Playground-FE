import { API_BASE_URL } from "@/shared/config/env";
import {
  ApiRequestError,
  type ApiEnvelope,
  type ApiErrorBody,
  type ApiMeta,
} from "@/shared/types/api";

interface ApiClientHandlers {
  getAccessToken: () => string | null;
  refreshSession: () => Promise<boolean>;
  onSessionExpired: () => void;
}

let handlers: ApiClientHandlers | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function initApiClient(nextHandlers: ApiClientHandlers) {
  handlers = nextHandlers;
}

/** Access token for non-envelope clients (e.g. SSE) that cannot use `apiRequest`. */
export function getApiAccessToken(): string | null {
  return handlers?.getAccessToken() ?? null;
}

interface ApiRequestOptions {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  skipRefresh?: boolean;
}

async function parseEnvelopeError(
  response: Response,
): Promise<ApiRequestError> {
  try {
    const envelope = (await response.json()) as ApiEnvelope<unknown>;
    const error = envelope.error as ApiErrorBody | null;
    return new ApiRequestError(
      response.status,
      error?.code ?? "UNKNOWN_ERROR",
      error?.message ?? response.statusText,
      error?.details,
    );
  } catch {
    return new ApiRequestError(
      response.status,
      "UNKNOWN_ERROR",
      response.statusText || "Request failed",
    );
  }
}

async function attemptRefresh(): Promise<boolean> {
  if (!handlers) return false;

  if (!refreshPromise) {
    refreshPromise = handlers.refreshSession().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export interface ApiRequestResult<T> {
  data: T;
  meta: ApiMeta;
}

async function executeApiRequest<T>(
  options: ApiRequestOptions,
  isRetry = false,
): Promise<ApiRequestResult<T>> {
  const {
    path,
    method = "GET",
    body,
    auth = true,
    skipRefresh = false,
  } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth && handlers) {
    const accessToken = handlers.getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (
    response.status === 401 &&
    auth &&
    !skipRefresh &&
    !isRetry &&
    handlers
  ) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      return executeApiRequest<T>(options, true);
    }

    handlers.onSessionExpired();
    throw await parseEnvelopeError(response);
  }

  if (!response.ok) {
    throw await parseEnvelopeError(response);
  }

  const envelope = (await response.json()) as ApiEnvelope<T>;

  if (!envelope.success || envelope.data === null) {
    throw new ApiRequestError(
      response.status,
      envelope.error?.code ?? "UNKNOWN_ERROR",
      envelope.error?.message ?? "Request failed",
      envelope.error?.details,
    );
  }

  return {
    data: envelope.data,
    meta: envelope.meta,
  };
}

export async function apiRequest<T>(
  options: ApiRequestOptions,
): Promise<T> {
  const result = await executeApiRequest<T>(options);
  return result.data;
}

/** Like `apiRequest`, but also returns envelope `meta` (e.g. pagination). */
export async function apiRequestWithMeta<T>(
  options: ApiRequestOptions,
): Promise<ApiRequestResult<T>> {
  return executeApiRequest<T>(options);
}

export async function apiRequestNoContent({
  path,
  method = "POST",
  body,
  auth = true,
}: Omit<ApiRequestOptions, "skipRefresh">): Promise<void> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth && handlers) {
    const accessToken = handlers.getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return;
  }

  if (!response.ok) {
    throw await parseEnvelopeError(response);
  }
}
