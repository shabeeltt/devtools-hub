import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import CopyButton from "../../components/tool/CopyButton";

export default function UrlConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [encodeFullUrl, setEncodeFullUrl] = useState(true);

  const hasInput = input.trim().length > 0;
  const canUseOutput = output && output !== "invalid input";

  function encodeQueryValues(value: string) {
    const url = new URL(value);

    url.searchParams.forEach((paramValue, key) => {
      url.searchParams.set(key, paramValue);
    });

    return url.toString();
  }

  function encode() {
    try {
      const result = encodeFullUrl
        ? encodeURIComponent(input)
        : encodeQueryValues(input);

      setOutput(result);
    } catch {
      setOutput("invalid input");
    }
  }

  function decode() {
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput("invalid input");
    }
  }

  function loadSample() {
    const text = "https://devtoolshub.com/search?q=hello world&type=json";

    setInput(text);

    const result = encodeFullUrl
      ? encodeURIComponent(text)
      : encodeQueryValues(text);

    setOutput(result);
  }

  function clear() {
    setInput("");
    setOutput("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={encodeFullUrl}
            onChange={(event) => setEncodeFullUrl(event.target.checked)}
            className="size-4 rounded border-neutral-700 bg-neutral-950 accent-blue-600"
          />

          <span className="text-sm font-medium text-white">
            Encode full URL
          </span>
        </label>

        <div className="group relative">
          <span className="flex size-5 cursor-help items-center justify-center rounded-full border border-neutral-700 text-xs text-neutral-400">
            ?
          </span>

          <div className="pointer-events-none absolute right-0 top-7 z-10 w-64 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            On: encode the whole URL. Off: keep the URL readable and encode only
            query values.
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        {/*Input */}
        <ToolTextarea
          label="Input"
          value={input}
          onChange={setInput}
          placeholder="Enter text or encoded URL"
          rows={15}
          rightLabel={
            <button
              onClick={loadSample}
              className="text-xs text-blue-500 hover:text-blue-400"
            >
              Sample
            </button>
          }
        />

        {/*Output */}
        <ToolTextarea
          label="Output"
          value={output}
          readOnly
          rows={15}
          textColor="accent"
        >
          {canUseOutput && (
            <CopyButton
              value={output}
              className="absolute right-4 top-4"
            />
          )}
        </ToolTextarea>
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          disabled={!hasInput}
          onClick={encode}
          className={`rounded-full px-6 py-2 text-white ${
            hasInput
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-neutral-700 opacity-50"
          }`}
        >
          Encode
        </button>

        <button
          type="button"
          disabled={!hasInput}
          onClick={decode}
          className={`rounded-full px-6 py-2 text-white ${
            hasInput
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-neutral-700 opacity-50"
          }`}
        >
          Decode
        </button>

        {output && (
          <button
            type="button"
            onClick={clear}
            className="rounded-full bg-neutral-600 px-6 py-2 text-white hover:bg-neutral-700"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
