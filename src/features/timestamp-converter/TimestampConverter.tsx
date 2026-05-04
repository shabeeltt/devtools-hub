import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import CopyButton from "../../components/tool/CopyButton";

export default function TimestampConverter() {
  const [input, setInput] = useState("");

  const [output, setOutput] = useState<{
    local: string;
    utc: string;
    seconds: string;
    milliseconds: string;
    error: string | null;
  }>({
    local: "",
    utc: "",
    seconds: "",
    milliseconds: "",
    error: null,
  });

  const hasInput = input.trim().length > 0;

  const hasOutput =
    output.local ||
    output.utc ||
    output.seconds ||
    output.milliseconds ||
    output.error;

  function convert() {
    try {
      const value = input.trim();

      if (!isNaN(Number(value))) {
        let timestamp = Number(value);

        if (value.length === 10) {
          timestamp = timestamp * 1000;
        }

        const date = new Date(timestamp);

        setOutput({
          local: date.toLocaleString(),
          utc: date.toUTCString(),
          seconds: Math.floor(date.getTime() / 1000).toString(),
          milliseconds: date.getTime().toString(),
          error: null,
        });
      } else {
        const date = new Date(value);

        if (isNaN(date.getTime())) {
          throw new Error();
        }

        setOutput({
          local: date.toLocaleString(),
          utc: date.toUTCString(),
          seconds: Math.floor(date.getTime() / 1000).toString(),
          milliseconds: date.getTime().toString(),
          error: null,
        });
      }
    } catch {
      setOutput({
        local: "",
        utc: "",
        seconds: "",
        milliseconds: "",
        error: "invalid input",
      });
    }
  }

  function setNow() {
    const now = Date.now();
    const date = new Date(now);

    setInput(now.toString());

    setOutput({
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      seconds: Math.floor(now / 1000).toString(),
      milliseconds: now.toString(),
      error: null,
    });
  }

  function clear() {
    setInput("");
    setOutput({
      local: "",
      utc: "",
      seconds: "",
      milliseconds: "",
      error: null,
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
          <ToolTextarea
            label="Input"
            value={input}
            onChange={setInput}
            placeholder="Enter timestamp or date (e.g. 1714700000 or 2024-05-03)"
            rows={6}
          />
      </div>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!hasInput}
          onClick={convert}
          className={`rounded-full px-8 py-3 font-semibold text-white transition-all active:scale-95 ${
            hasInput
              ? "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
              : "cursor-not-allowed bg-neutral-700 opacity-50"
          }`}
        >
          Convert
        </button>

        <button
          type="button"
          onClick={setNow}
          className="rounded-full bg-neutral-700 px-8 py-3 font-semibold text-white transition-all hover:bg-neutral-600 active:scale-95"
        >
          Now
        </button>

        {hasOutput && (
          <button
            type="button"
            onClick={clear}
            className="rounded-full bg-neutral-600 px-8 py-3 font-semibold text-white transition-all hover:bg-neutral-700 active:scale-95"
          >
            Clear
          </button>
        )}
      </div>

      {output.error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {output.error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* local */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-neutral-400">Local Time</p>
            {output.local && (
              <CopyButton value={output.local} />
            )}
          </div>
          <p className="font-mono text-sm text-white break-all">
            {output.local || <span className="text-neutral-600">—</span>}
          </p>
        </div>

        {/* utc */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-neutral-400">UTC Time</p>
            {output.utc && (
              <CopyButton value={output.utc} />
            )}
          </div>
          <p className="font-mono text-sm text-white break-all">
            {output.utc || <span className="text-neutral-600">—</span>}
          </p>
        </div>

        {/* seconds */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-neutral-400">Unix (seconds)</p>
            {output.seconds && (
              <CopyButton value={output.seconds} />
            )}
          </div>
          <p className="font-mono text-sm text-white">
            {output.seconds || <span className="text-neutral-600">—</span>}
          </p>
        </div>

        {/* milliseconds */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-neutral-400">Unix (milliseconds)</p>
            {output.milliseconds && (
              <CopyButton value={output.milliseconds} />
            )}
          </div>
          <p className="font-mono text-sm text-white">
            {output.milliseconds || <span className="text-neutral-600">—</span>}
          </p>
        </div>
      </div>
    </div>
  );
}