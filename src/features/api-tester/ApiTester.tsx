import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import { apiRequest } from "../../utils/apiTester/apiRequest";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

interface ApiResponse {
  status: number;
  statusText: string;
  timeMs: number;
  data: string;
  isError: boolean;
}

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

  const hasBody = ["POST", "PUT", "PATCH"].includes(method);

  const handleSend = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResponse(null);

    const result = await apiRequest({
      method,
      url,
      body: reqBody,
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
                className={`appearance-none bg-transparent pl-4 pr-10 py-3 font-semibold outline-none cursor-pointer w-full h-full ${getMethodColor(method)}`}
              >
                {METHODS.map((m) => (
                  <option key={m} value={m} className="text-primary bg-surface">
                    {m}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 flex items-center text-muted">
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
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
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

        {hasBody && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-2">
            <ToolTextarea
              label="JSON Request Body"
              value={reqBody}
              onChange={setReqBody}
              placeholder='{ "key": "value" }'
              rows={5}
            />
          </div>
        )}

        <div className="flex items-start gap-2 text-sm text-muted mt-2 bg-elevated/50 p-3 rounded-lg border border-border/50">
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
            className="shrink-0 mt-0.5 text-accent"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <p>
            <strong>Note:</strong> Since this runs in your browser, the target
            API must allow Cross-Origin (CORS) requests.
          </p>
        </div>
      </div>

      {/* Response Section */}
      <div className="rounded-xl border border-border bg-surface p-4 md:p-6 min-h-[20rem] flex flex-col">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h3 className="text-lg font-semibold text-primary">Response</h3>

          {response && (
            <div className="flex items-center gap-3 text-sm font-mono">
              <span
                className={`px-2.5 py-1 rounded-md border ${getStatusColor(response.status)}`}
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
              <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
            </div>
          )}

          {response && !loading && (
            <ToolTextarea
              value={response.data}
              readOnly
              rows={15}
              textColor={response.isError ? "default" : "default"}
              rightLabel={<CopyButton value={response.data} />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
