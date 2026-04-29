import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function formatJson() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput("invalid json");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-400">Input JSON</label>
            <button
              type="button"
              onClick={() => {
                const compact = '{"name":"DevToolsHub","version":"1.0.0"}';
                setInput(compact);
                try {
                  const parsed = JSON.parse(compact);
                  setOutput(JSON.stringify(parsed, null, 2));
                } catch {
                  setOutput("invalid json");
                }
              }}
              className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors"
            >
              Sample
            </button>
          </div>
          <textarea
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-mono text-white outline-none focus:border-blue-500/50 transition-colors"
            rows={15}
            placeholder='Paste your JSON here (e.g. {"name": "DevToolsHub"})'
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400">Formatted Output</label>
          <div className="relative group">
            <textarea
              readOnly
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm font-mono text-blue-400 outline-none"
              rows={15}
              value={output}
            />
            {output && output !== "invalid json" && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  setCopied(true);

                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
                className="absolute right-4 top-4 rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 transition-colors"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
          onClick={formatJson}
        >
          Format JSON
        </button>
      </div>
    </div>
  );
}
