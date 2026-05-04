import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import CopyButton from "../../components/tool/CopyButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const canUseOutput = output && output !== "invalid json";

  const hasInput = input.trim().length > 0;

  function formatJson() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput("invalid json");
    }
  }

  function loadSample() {
    const compact = '{"name":"DevToolsHub","version":"1.0.0"}';

    setInput(compact);

    try {
      const parsed = JSON.parse(compact);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput("invalid json");
    }
  }

  function downloadJson() {
    if (!canUseOutput) {
      return;
    }

    const file = new Blob([output], {
      type: "application/json",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "formatted.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function clear() {
    setInput("");
    setOutput("");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">

        {/*Input */}
        <ToolTextarea
          label="Input"
          value={input}
          onChange={setInput}
          placeholder="Paste your JSON here (e.g. {'name': 'DevToolsHub'})"
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
          onClick={formatJson}
          className={`rounded-full px-8 py-3 font-semibold text-white transition-all active:scale-95 ${
            hasInput
              ? "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
              : "bg-neutral-700 cursor-not-allowed opacity-50"
          }`}
        >
          Format JSON
        </button>
        {/* only show clear if any output - even for error */}
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
