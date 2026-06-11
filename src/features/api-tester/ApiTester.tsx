import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import {
  apiRequest,
  HTTP_METHODS,
  type HttpMethod,
  type ApiResponse,
} from "../../utils/apiTester/apiRequest";

type Header = {
  key: string;
  value: string;
};

export default function ApiTester() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/todos/1",
  );
  const [reqBody, setReqBody] = useState(
    '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}',
  );
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [headers, setHeaders] = useState<Header[]>([
    { key: "Content-Type", value: "application/json" },
  ]);

  const hasBody = ["POST", "PUT", "PATCH"].includes(method);

  const addHeader = () => {
    setHeaders((prev) => [...prev, { key: "", value: "" }]);
  };

  const updateHeader = (index: number, field: keyof Header, value: string) => {
    setHeaders((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
    );
  };

  const removeHeader = (index: number) => {
    setHeaders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResponse(null);

    const headerObject = headers.reduce<Record<string, string>>((acc, h) => {
      if (h.key.trim()) {
        acc[h.key] = h.value;
      }
      return acc;
    }, {});

    const result = await apiRequest({
      method,
      url,
      body: hasBody ? reqBody : undefined,
      headers: headerObject,
    });

    setResponse(result);
    setLoading(false);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return "text-success bg-success-bg border-success-border";
    if (status >= 400 && status < 500)
      return "text-warning bg-warning-bg border-warning-border";
    if (status >= 500 || status === 0)
      return "text-danger bg-danger-bg border-danger-border";
    return "text-secondary bg-elevated border-border";
  };

  const getMethodColor = (m: HttpMethod) => {
    switch (m) {
      case "GET":
        return "text-blue-500";
      case "POST":
        return "text-success";
      case "PUT":
        return "text-warning";
      case "PATCH":
        return "text-orange-400";
      case "DELETE":
        return "text-danger";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Request Section */}
      <div className="rounded-xl border border-border bg-surface p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 flex rounded-lg border border-border bg-ground focus-within:border-accent/50 transition-colors">
            <div className="relative flex items-center border-r border-border hover:bg-surface/50 transition-colors">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className={`appearance-none bg-transparent pl-4 pr-10 py-3 font-semibold outline-none cursor-pointer w-full h-full ${getMethodColor(
                  method,
                )}`}
              >
                {HTTP_METHODS.map((m) => (
                  <option key={m} value={m} className="text-primary bg-surface">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/v1/users"
              className="flex-1 bg-transparent px-4 py-3 font-mono text-primary outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
          </div>

          <Button
            onClick={handleSend}
            isDisabled={loading || !url.trim()}
            className="md:w-32 justify-center"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>

        {/* HEADERS */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-primary">Headers</h4>

            <button
              onClick={addHeader}
              className="text-xs px-2 py-1 rounded bg-elevated hover:bg-border"
            >
              Add Header
            </button>
          </div>

          {headers.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={h.key}
                onChange={(e) => updateHeader(i, "key", e.target.value)}
                placeholder="Key (e.g. Authorization)"
                className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm"
              />

              <input
                value={h.value}
                onChange={(e) => updateHeader(i, "value", e.target.value)}
                placeholder="Value"
                className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm"
              />

              <button
                onClick={() => removeHeader(i)}
                className="px-2 text-danger"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {hasBody && (
          <div className="pt-2">
            <ToolTextarea
              label="JSON Request Body"
              value={reqBody}
              onChange={setReqBody}
              placeholder='{ "key": "value" }'
              rows={5}
            />
          </div>
        )}
      </div>

      {/* Response Section */}
      <div className="rounded-xl border border-border bg-surface p-4 md:p-6 min-h-[20rem] flex flex-col">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h3 className="text-lg font-semibold text-primary">Response</h3>

          {response && (
            <div className="flex items-center gap-3 text-sm font-mono">
              <span
                className={`px-2.5 py-1 rounded-md border ${getStatusColor(
                  response.status,
                )}`}
              >
                {response.status === 0
                  ? "ERROR"
                  : `${response.status} ${response.statusText}`}
              </span>
              <span className="text-muted">{response.timeMs} ms</span>
            </div>
          )}
        </div>

        <div className="flex-1 relative">
          {!response && !loading && (
            <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
              Enter a URL and click Send to see the response.
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            </div>
          )}

          {response && !loading && (
            <ToolTextarea
              value={response.data}
              readOnly
              rows={15}
              rightLabel={<CopyButton value={response.data} />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
