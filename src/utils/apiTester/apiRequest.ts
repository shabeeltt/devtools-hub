// utils/apiRequest.ts

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method: HttpMethod;
  url: string;
  body?: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  timeMs: number;
  data: string;
  isError: boolean;
}

export async function apiRequest(
  options: ApiRequestOptions,
): Promise<ApiResponse> {
  const { method, url, body } = options;

  const startTime = performance.now();

  try {
    const hasBody = ["POST", "PUT", "PATCH"].includes(method);

    const requestOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    if (hasBody && body && body.trim()) {
      requestOptions.body = body;
    }

    const response = await fetch(url, requestOptions);

    const endTime = performance.now();
    const timeMs = Math.round(endTime - startTime);

    let dataStr = "";

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        const json = await response.json();
        dataStr = JSON.stringify(json, null, 2);
      } catch {
        dataStr = await response.text();
      }
    } else {
      dataStr = await response.text();
    }

    return {
      status: response.status,
      statusText: response.statusText,
      timeMs,
      data: dataStr,
      isError: !response.ok,
    };
  } catch (err: any) {
    const endTime = performance.now();

    return {
      status: 0,
      statusText: "Network Error / CORS Issue",
      timeMs: Math.round(endTime - startTime),
      data:
        err?.message || "Failed to fetch. Check network or CORS configuration.",
      isError: true,
    };
  }
}
