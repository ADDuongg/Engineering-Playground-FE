import {
  benchmarkProgressSnapshotSchema,
  progressStreamErrorPayloadSchema,
} from "@/features/realtime-progress/schemas/progress-schema";
import type {
  ObserveBenchmarkProgressQuery,
  ProgressSseEvent,
} from "@/features/realtime-progress/types/progress";
import { API_BASE_URL } from "@/shared/config/env";
import { getApiAccessToken } from "@/shared/services/api-client";
import { ApiRequestError } from "@/shared/types/api";

export interface ObserveBenchmarkProgressHandlers {
  onEvent: (event: ProgressSseEvent) => void;
  onError?: (error: unknown) => void;
  onClose?: (reason: "terminal" | "error" | "abort") => void;
}

function buildProgressUrl(
  jobId: string,
  query?: ObserveBenchmarkProgressQuery,
): string {
  const params = new URLSearchParams();
  if (query?.sessionId) {
    params.set("sessionId", query.sessionId);
  }

  const qs = params.toString();
  return `${API_BASE_URL}/benchmarks/${encodeURIComponent(jobId)}/progress${
    qs ? `?${qs}` : ""
  }`;
}

async function parsePreStreamError(response: Response): Promise<ApiRequestError> {
  try {
    const body = (await response.json()) as {
      error?: { code?: string; message?: string; details?: unknown };
      success?: boolean;
    };

    return new ApiRequestError(
      response.status,
      body.error?.code ?? "UNKNOWN_ERROR",
      body.error?.message ?? (response.statusText || "Progress stream failed"),
      body.error?.details,
    );
  } catch {
    return new ApiRequestError(
      response.status,
      "UNKNOWN_ERROR",
      response.statusText || "Progress stream failed",
    );
  }
}

function dispatchSseBlock(
  eventName: string,
  dataLines: string[],
  onEvent: (event: ProgressSseEvent) => void,
): "continue" | "terminal" | "error" {
  const raw = dataLines.join("\n");
  if (!raw) {
    return "continue";
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ApiRequestError(
      0,
      "VALIDATION_ERROR",
      "Invalid progress stream payload.",
    );
  }

  if (eventName === "error") {
    const data = progressStreamErrorPayloadSchema.parse(parsed);
    onEvent({ type: "error", data });
    return "error";
  }

  const snapshot = benchmarkProgressSnapshotSchema.parse(parsed);

  if (eventName === "terminal" || snapshot.terminal) {
    onEvent({ type: "terminal", data: { ...snapshot, terminal: true } });
    return "terminal";
  }

  onEvent({ type: "progress", data: snapshot });
  return "continue";
}

/**
 * Opens a push-only SSE progress stream. Returns an abort function.
 * Does not use the JSON envelope client.
 */
export function observeBenchmarkProgress(
  jobId: string,
  query: ObserveBenchmarkProgressQuery | undefined,
  handlers: ObserveBenchmarkProgressHandlers,
): () => void {
  const controller = new AbortController();
  let closed = false;

  const close = (reason: "terminal" | "error" | "abort") => {
    if (closed) {
      return;
    }
    closed = true;
    if (!controller.signal.aborted) {
      controller.abort();
    }
    handlers.onClose?.(reason);
  };

  const run = async () => {
    try {
      const headers: Record<string, string> = {
        Accept: "text/event-stream",
      };

      const token = getApiAccessToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(buildProgressUrl(jobId, query), {
        method: "GET",
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await parsePreStreamError(response);
        handlers.onError?.(error);
        close("error");
        return;
      }

      if (!response.body) {
        const error = new ApiRequestError(
          response.status,
          "UNKNOWN_ERROR",
          "Progress stream response had no body.",
        );
        handlers.onError?.(error);
        close("error");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let eventName = "message";
      let dataLines: string[] = [];

      const flushBlock = (): "continue" | "terminal" | "error" => {
        if (eventName === "message" && dataLines.length === 0) {
          return "continue";
        }

        const result = dispatchSseBlock(eventName, dataLines, handlers.onEvent);
        eventName = "message";
        dataLines = [];
        return result;
      };

      while (!closed) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) {
            const lines = buffer.split(/\r?\n/);
            for (const line of lines) {
              if (line.startsWith("event:")) {
                eventName = line.slice(6).trim();
              } else if (line.startsWith("data:")) {
                dataLines.push(line.slice(5).trimStart());
              }
            }
            const result = flushBlock();
            if (result === "terminal") {
              close("terminal");
              return;
            }
            if (result === "error") {
              close("error");
              return;
            }
          }
          close("abort");
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split(/\r?\n/);
        buffer = parts.pop() ?? "";

        for (const line of parts) {
          if (line === "") {
            const result = flushBlock();
            if (result === "terminal") {
              close("terminal");
              return;
            }
            if (result === "error") {
              close("error");
              return;
            }
            continue;
          }

          if (line.startsWith(":")) {
            continue;
          }

          if (line.startsWith("event:")) {
            eventName = line.slice(6).trim();
            continue;
          }

          if (line.startsWith("data:")) {
            dataLines.push(line.slice(5).trimStart());
          }
        }
      }
    } catch (error) {
      if (controller.signal.aborted || closed) {
        return;
      }

      handlers.onError?.(error);
      close("error");
    }
  };

  void run();

  return () => {
    close("abort");
  };
}
