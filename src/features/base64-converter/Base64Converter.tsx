import { useState } from "react";

export default function Base64Converter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const hasInput = input.trim().length > 0;
  const canUseOutput = output && output !== "invalid base64";

  function encodeBase64() {
    try {
      setOutput(btoa(input));
    } catch {
      setOutput("unable to encode text");
    }
  }

  function decodeBase64() {
    try {
      setOutput(atob(input));
    } catch {
      setOutput("invalid base64");
    }
  }

  function loadSample() {
    const sampleText = "DevToolsHub";

    setInput(sampleText);
    setOutput(btoa(sampleText));
  }

  function copyOutput() {
    if (!canUseOutput) {
      return;
    }

    navigator.clipboard.writeText(output);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function clear() {
    setInput("");
    setOutput("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-400">
              Input
            </label>

            <button
              type="button"
              onClick={loadSample}
              className="text-xs font-medium text-blue-500 transition-colors hover:text-blue-400"
            >
              Sample
            </button>
          </div>

          <textarea
            className="custom-scrollbar w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-white outline-none transition-colors focus:border-blue-500/50"
            rows={15}
            placeholder="Enter text or Base64 here"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-400">
              Output
            </label>
          </div>
          <div className="relative">
            <textarea
              readOnly
              className="custom-scrollbar w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-blue-400 outline-none"
              rows={15}
              value={output}
            />

            {canUseOutput && (
              <div className="absolute right-4 top-4">
                <button
                  type="button"
                  onClick={copyOutput}
                  className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          disabled={!hasInput}
          onClick={encodeBase64}
          className={`rounded-full px-8 py-3 font-semibold text-white transition-all active:scale-95 ${
            hasInput
              ? "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
              : "cursor-not-allowed bg-neutral-700 opacity-50"
          }`}
        >
          Encode
        </button>

        <button
          type="button"
          disabled={!hasInput}
          onClick={decodeBase64}
          className={`rounded-full px-8 py-3 font-semibold text-white transition-all active:scale-95 ${
            hasInput
              ? "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
              : "cursor-not-allowed bg-neutral-700 opacity-50"
          }`}
        >
          Decode
        </button>

        {output && (
          <button
            type="button"
            onClick={clear}
            className="rounded-full bg-neutral-600 px-8 py-3 font-semibold text-white transition-all hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-500/20 active:scale-95"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
