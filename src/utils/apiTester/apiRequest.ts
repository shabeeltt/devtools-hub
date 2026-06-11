export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type Header = { key: string; value: string };

export interface ApiRequestOptions {
  method: HttpMethod;
  url: string;
  body?: string;
  headers?: Header[];
}

export interface ApiResponse {
  status: number;
  statusText: string;
  timeMs: number;
  data: string;
  isError: boolean;
}

function normalizeHeaders(headers?: Header[]) {
  const result: Record<string, string> = {
    Accept: "application/json",
  };

  if (!headers) return result;

  for (const h of headers) {
    if (h.key.trim()) {
      result[h.key.trim()] = h.value;
    }
  }

  return result;
}

export async function apiRequest(
  options: ApiRequestOptions,
): Promise<ApiResponse> {
  const { method, url, body, headers } = options;

  const start = performance.now();

  try {
    const hasBody = ["POST", "PUT", "PATCH"].includes(method);

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...normalizeHeaders(headers),
      },
      body: hasBody && body?.trim() ? body : undefined,
    });

    const end = performance.now();

    let data = "";

    const contentType = res.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      try {
        data = JSON.stringify(await res.json(), null, 2);
      } catch {
        data = await res.text();
      }
    } else {
      data = await res.text();
    }

    return {
      status: res.status,
      statusText: res.statusText,
      timeMs: Math.round(end - start),
      data,
      isError: !res.ok,
    };
  } catch (err: any) {
    const end = performance.now();

    return {
      status: 0,
      statusText: "Network Error",
      timeMs: Math.round(end - start),
      data: err?.message || "Request failed",
      isError: true,
    };
  }
}
