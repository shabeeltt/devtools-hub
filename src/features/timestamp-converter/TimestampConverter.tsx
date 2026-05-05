import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import ToolActions from "../../components/tool/ToolActions";
import CopyButton from "../../ui/CopyButton";
import Button from "../../ui/Button";

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
      <ToolTextarea
        label="Input"
        value={input}
        onChange={setInput}
        placeholder="Enter timestamp or date (e.g. 1714700000 or 2024-05-03)"
        rows={6}
      />

      <ToolActions className="gap-3">
        <Button
          isDisabled={!hasInput}
          onClick={convert}
          variant="primary"
        >
          Convert
        </Button>

        <Button
          onClick={setNow}
          variant="primary"
        >
          Now
        </Button>

        {output && (
          <Button
            onClick={clear}
            variant="secondary"
          >
            Clear
          </Button>
        )}
      </ToolActions>

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