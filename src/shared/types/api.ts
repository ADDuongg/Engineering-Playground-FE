export interface ApiMeta {
  timestamp: string;
  requestId?: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  meta: ApiMeta;
  error: ApiErrorBody | null;
}

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
