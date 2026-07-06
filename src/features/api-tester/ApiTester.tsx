import { useEffect, useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import { apiRequest, type Header } from "../../utils/apiTester/apiRequest";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiResponse {
  status: number;
  statusText: string;
  timeMs: number;
  data: string;
  isError: boolean;
}

interface HistoryItem {
  method: HttpMethod;
  url: string;
  body: string;
  headers: Header[];
  response: ApiResponse;
}

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const DEFAULT_HEADERS: Header[] = [
  { key: "Content-Type", value: "application/json" },
  { key: "Accept", value: "application/json" },
];

export default function ApiTester() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/todos/1",
  );
  const [reqBody, setReqBody] = useState(
    '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}',
  );

  const [headers, setHeaders] = useState<Header[]>(DEFAULT_HEADERS);

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null);

  const hasBody = ["POST", "PUT", "PATCH"].includes(method);

  useEffect(() => {
    const saved = localStorage.getItem("api_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveHistory = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("api_history", JSON.stringify(updated));
  };

  const handleSend = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResponse(null);

    const result = await apiRequest({
      method,
      url,
      body: reqBody,
      headers,
    });

    setResponse(result);

    saveHistory({
      method,
      url,
      body: reqBody,
      headers,
      response: result,
    });

    setLoading(false);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const updateHeader = (i: number, key: string, value: string) => {
    const copy = [...headers];
    copy[i] = { key, value };
    setHeaders(copy);
  };

  const removeHeader = (i: number) => {
    setHeaders(headers.filter((_, idx) => idx !== i));
  };

  const loadHistory = (item: HistoryItem, index: number) => {
    setMethod(item.method);
    setUrl(item.url);
    setReqBody(item.body);
    setHeaders(item.headers);
    setResponse(item.response);
    setSelectedHistory(index);
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-surface p-4 md:p-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex flex-1 border border-border rounded-lg bg-ground">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className={`px-3 py-2 font-semibold bg-transparent outline-none ${getMethodColor(method)}`}
              >
                {METHODS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>

              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 px-3 bg-transparent outline-none font-mono"
              />
            </div>

            <Button onClick={handleSend} isDisabled={loading}>
              {loading ? "Sending" : "Send"}
            </Button>
          </div>

          {/* HEADERS PRESET STYLE */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium">Headers</p>
              <button
                onClick={addHeader}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-elevated hover:border-primary/40 active:scale-[0.98]"
              >
                <span>Add header</span>
                <span className="text-sm">+</span>
              </button>
            </div>

            <div className="space-y-2">
              {headers.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={h.key}
                    onChange={(e) => updateHeader(i, e.target.value, h.value)}
                    placeholder="key"
                    className="flex-1 border border-border px-2 py-1 rounded"
                  />
                  <input
                    value={h.value}
                    onChange={(e) => updateHeader(i, h.key, e.target.value)}
                    placeholder="value"
                    className="flex-1 border border-border px-2 py-1 rounded"
                  />
                  <button onClick={() => removeHeader(i)}>x</button>
                </div>
              ))}
            </div>
          </div>

          {hasBody && (
            <ToolTextarea
              label="Body"
              value={reqBody}
              onChange={setReqBody}
              rows={5}
            />
          )}
        </div>

        {/* RESPONSE */}
        <div className="rounded-xl border border-border bg-surface p-4 md:p-6">
          <div className="flex justify-between mb-3">
            <p className="font-medium">Response</p>

            {response && (
              <span className={getStatusColor(response.status)}>
                {response.status}
              </span>
            )}
          </div>

          {response && (
            <ToolTextarea
              value={response.data}
              readOnly
              rows={15}
              rightLabel={<CopyButton value={response.data} />}
            />
          )}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-surface p-4 h-fit">
        <div className="flex justify-between mb-3">
          <p className="font-medium">History</p>

          {history.length > 0 && (
            <button
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("api_history");
                setSelectedHistory(null);
              }}
              className="text-sm text-danger"
            >
              clear
            </button>
          )}
        </div>

        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="text-sm text-muted border border-dashed border-border rounded-lg p-4 text-center">
              No requests yet. Send a request to see history here.
            </div>
          ) : (
            history.map((h, i) => (
              <div
                key={i}
                onClick={() => loadHistory(h, i)}
                className={`p-2 rounded border cursor-pointer text-xs transition ${
                  selectedHistory === i
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-surface/50"
                }`}
              >
                <p className="font-semibold">{h.method}</p>
                <p className="truncate">{h.url}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
