import { useState } from "react";
import ToolTextarea from "../../components/tool/ToolTextarea";
import CopyButton from "../../components/tool/CopyButton";

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
          placeholder="Enter text or Base64 here"
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
