import { useMemo, useState } from "react";

interface StatusCode {
  code: number;
  name: string;
  description: string;
}

const STATUS_CODES: StatusCode[] = [
  { code: 200, name: "OK", description: "The request has succeeded." },
  {
    code: 201,
    name: "Created",
    description: "The request succeeded and a new resource has been created.",
  },
  {
    code: 204,
    name: "No Content",
    description: "The request succeeded but there is no content to return.",
  },
  {
    code: 301,
    name: "Moved Permanently",
    description: "The requested resource has been permanently moved to a new URL.",
  },
  {
    code: 302,
    name: "Found",
    description: "The requested resource has been temporarily moved to a different URL.",
  },
  {
    code: 400,
    name: "Bad Request",
    description: "The server could not understand the request due to invalid syntax.",
  },
  {
    code: 401,
    name: "Unauthorized",
    description: "Authentication is required and has failed or was not provided.",
  },
  {
    code: 403,
    name: "Forbidden",
    description: "The server understood the request but refuses to authorize it.",
  },
  {
    code: 404,
    name: "Not Found",
    description: "The server can not find the requested resource.",
  },
  {
    code: 409,
    name: "Conflict",
    description: "The request conflicts with the current state of the target resource.",
  },
  {
    code: 429,
    name: "Too Many Requests",
    description: "The user has sent too many requests in a given amount of time.",
  },
  {
    code: 500,
    name: "Internal Server Error",
    description: "The server encountered an unexpected condition that prevented it from fulfilling the request.",
  },
  {
    code: 502,
    name: "Bad Gateway",
    description: "The server received an invalid response from an upstream server.",
  },
  {
    code: 503,
    name: "Service Unavailable",
    description: "The server is not ready to handle the request, often due to overload or maintenance.",
  },
];

const CATEGORIES: { digit: number; label: string; colorClass: string }[] = [
  { digit: 1, label: "1xx Informational", colorClass: "text-secondary bg-elevated border-border" },
  { digit: 2, label: "2xx Success", colorClass: "text-success bg-success-bg border-success-border" },
  { digit: 3, label: "3xx Redirection", colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
  { digit: 4, label: "4xx Client Errors", colorClass: "text-warning bg-warning-bg border-warning-border" },
  { digit: 5, label: "5xx Server Errors", colorClass: "text-danger bg-danger-bg border-danger-border" },
];

export default function HttpStatusCodes() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STATUS_CODES;
    return STATUS_CODES.filter(
      (s) => s.code.toString().includes(q) || s.name.toLowerCase().includes(q),
    );
  }, [query]);

  const groups = CATEGORIES.map((category) => ({
    ...category,
    codes: filtered.filter((s) => Math.floor(s.code / 100) === category.digit),
  })).filter((group) => group.codes.length > 0);

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by code or status name (e.g. 404, Not Found)..."
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 pl-10 text-sm outline-none focus:border-accent/50"
        />
        <div className="absolute left-3.5 top-3.5 text-muted pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
          No status codes found for "{query}".
        </div>
      ) : (
        groups.map((group) => (
          <div key={group.digit} className="space-y-3">
            <h3 className="text-sm font-semibold text-secondary">{group.label}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.codes.map((status) => (
                <div
                  key={status.code}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${group.colorClass}`}
                    >
                      {status.code}
                    </span>
                    <span className="font-semibold">{status.name}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{status.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
